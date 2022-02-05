const express = require("express");
const router = express.Router();
const { Changelogs, Users, DocumentStatus } = require("../models");
const { createTrail } = require("../middlewares/miscjs");
const { Op } = require("sequelize");

// Get All Changelogs
router.get("/user/:id", (req, res, next) => {
  const { query } = req.query;
  const userId = req.params.id;
  const queryObj = { [Op.substring]: query };
  Changelogs.findAll({
    include: [
      {
        model: Users,
        as: "User",
        required: true,
        attributes: ["username", "name"],
      },
      {
        model: DocumentStatus,
        as: "DocumentStatus",
        required: true,
        attributes: ["description"],
      },
    ],
    where: {
      [Op.or]: [
        { title: queryObj },
        { changelog: queryObj },
        { "$User.username$": queryObj },
        { "$User.name$": queryObj },
        { "$DocumentStatus.description$": queryObj },
        { createdAt: queryObj },
        { updatedAt: queryObj },
      ],
      status: true,
    },
    order: [["updatedAt", "DESC"]],
  })
    .then((changelogs) => {
      const procChangelogs = changelogs.map((change) => {
        return {
          ...change.dataValues,
          username: change.User.username,
          name: change.User.name,
          documentStatusDesc: change.DocumentStatus.description,
        };
      });
      res.json(procChangelogs);
    })
    .catch((error) => {
      console.log(error);
      createTrail(
        "Get All Changelogs",
        "Error during get all changelogs",
        null,
        null,
        userId,
        error.message
      );
      next(error);
    });
});

//Update User (this include delete=disable access)
router.patch("/users/:id", (req, res, next) => {
  Users.findByPk(req.params.id).then((prevValue) => {
    const userId = prevValue.id;
    Users.update(req.body.data, { where: { id: req.params.id } })
      .then((response) => {
        return Users.findOne({ where: { id: req.params.id } });
      })
      .then((newValue) => {
        createTrail(
          "Update User",
          "Update success",
          prevValue,
          newValue,
          userId,
          null
        );
        res.send(true);
      })
      .catch((error) => {
        createTrail(
          "Update User",
          "Error during user update",
          prevValue,
          req.body.data,
          userId,
          error.message
        );
        res.send(false);
      });
  });
});

//Post new Changelogs
router.post("/", (req, res, next) => {
  var changelog = req.body.data;
  console.log(changelog);
  Changelogs.create(changelog)
    .then((createdChangelog) => {
      createTrail(
        "Create New Changelog",
        "New changelog created",
        null,
        createdChangelog,
        createdChangelog.UserId,
        null
      );
      res.send(true);
    })
    .catch((error) => {
      console.log(error);
      createTrail(
        "Create New Changelog",
        "Error during changelog save",
        null,
        changelog,
        changelog.UserId,
        error?.message
      );
      res.send(false);
    });
});

//Update Changelogs (this include delete=disable access)
router.patch("/id/:id", (req, res, next) => {
  var changeId = req.params.id;
  Changelogs.findByPk(changeId)
    .then((prevValue) => {
      const userId = prevValue.id;
      Changelogs.update(req.body.data, { where: { id: changeId } })
        .then((response) => {
          return Changelogs.findOne({ where: { id: changeId } }).catch(
            (error) => next(error)
          );
        })
        .then((newValue) => {
          createTrail(
            "Update Changelog",
            "Update success",
            prevValue,
            newValue,
            userId,
            null
          );
          res.send(true);
        })
        .catch((error) => {
          createTrail(
            "Update Changelog",
            "Error during changelog update",
            null,
            prevValue,
            userId,
            error.message
          );
          res.send(false);
        });
    })
    .catch((error) => next(error));
});

module.exports = router;
