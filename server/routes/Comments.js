const express = require("express");
const router = express.Router();
const { Comments, Users } = require("../models");
const { createTrail } = require("../middlewares/miscjs");

//Get Comment By PinId
router.get("/:pinId", (req, res, next) => {
  Comments.findAll({
    where: { PinId: req.params.pinId, status: true },
    order: [["updatedAt", "DESC"]],
    include: { model: Users, required: true, attributes: ["username", "name"] },
  })
    .then((comments) => {
      res.json(comments);
    })
    .catch((error) => {
      createTrail(
        "Get Comments by PinId",
        "Error during get comments by PinId",
        null,
        null,
        req.user.id,
        error.message
      );
      next(error);
    });
});

//Post New Comment
router.post("/", (req, res, next) => {
  Comments.create(req.body)
    .then((comment) => {
      createTrail(
        "Post Comment",
        "Comment success",
        null,
        comment,
        comment.UserId,
        null
      );
      res.json(true);
    })
    .catch((error) => {
      createTrail(
        "Post Comment",
        "Comment failed",
        null,
        req.body,
        req.body.UserId,
        error.message
      );
      res.json(false);
    });
});

module.exports = router;
