const express = require("express");
const router = express.Router();
const { AuditTrail, Users } = require("../models");
const { Op } = require("sequelize");

//Get All History
router.get("/id/:id", (req, res, next) => {
  const { query } = req.query;
  const userId = req.params.id;
  const queryObj = {
    [Op.like]: `%${query}%`,
  };
  Users.findAll({
    where: { id: userId },
  })
    .then((resultUser) => {
      const userData = resultUser.pop().dataValues;
      const isAdmin = userData.role === "Admin";
      AuditTrail.findAll({
        include: {
          model: Users,
          as: "User",
          required: true,
          attributes: ["username"],
        },
        where: {
          [Op.or]: [
            { action: queryObj },
            { message: queryObj },
            { prevValue: queryObj },
            { newValue: queryObj },
            { error: queryObj },
            { "$User.username$": queryObj },
          ],
          UserId: isAdmin ? { [Op.like]: `%%` } : userId,
        },
        order: [["createdAt", "DESC"]],
      }).then((result) => {
        console.log(result);
        res.json(result);
      });
    })
    .catch((error) => next(error));
});

module.exports = router;
