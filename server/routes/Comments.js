const express = require("express");
const router = express.Router();
const { Comments, Users } = require("../models");
const { createTrail } = require("../middlewares/miscjs");

//Get Comment By PinId
router.get("/:pinId", (req, res, next) => {
  const pinId = req.params.pinId;
  Comments.findAll({
    where: { PinId: pinId, status: true },
    order: [["updatedAt", "DESC"]],
    include: { model: Users, required: true, attributes: ["username"] },
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
  const commentData = req.body;
  const userId = req.body.UserId;
  Comments.create(commentData)
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
        commentData,
        userId,
        error.message
      );
      res.json(false);
    });
});

module.exports = router;
