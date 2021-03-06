const express = require("express");
const router = express.Router();
const { AuditTrail, Users } = require("../models");
const { Op } = require("sequelize");

//Get All History
router.get("/id/:id", (req, res, next) => {
  const { query } = req.query;
  const userId = req.params.id;
  const queryObj = { [Op.substring]: query };
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
            { newValue: query },
            { error: queryObj },
            { "$User.username$": queryObj },
            { createdAt: queryObj },
            { updatedAt: queryObj },
          ],
          UserId: isAdmin ? { [Op.like]: `%%` } : userId,
        },
        order: [["createdAt", "DESC"]],
      }).then(async (results) => {
        const newResults = await results.map((result) => {
          var procResult = result.dataValues;
          if (result.dataValues.prevValue?.hash) {
            procResult = {
              ...procResult,
              prevValue: { ...procResult.prevValue, hash: "****" },
            };
          }
          if (result.dataValues.newValue?.hash) {
            procResult = {
              ...procResult,
              newValue: { ...procResult.newValue, hash: "****" },
            };
            return procResult;
          }
          return procResult;
        });
        res.json(newResults);
      });
    })
    .catch((error) => next(error));
});

module.exports = router;
