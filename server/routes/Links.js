const express = require("express");
const router = express.Router();
const { Links, Users } = require("../models");
const { createTrail } = require("../middlewares/miscjs");
const { Op } = require("sequelize");

//Get All Links
router.get("/search", (req, res, next) => {
  const { query } = req.query;
  const queryObj = {
    [Op.like]: `%${query}%`,
  };
  Links.findAll({
    include: {
      model: Users,
      as: "User",
      required: true,
      attributes: ["username"],
    },
    where: {
      [Op.or]: [
        { title: queryObj },
        { description: queryObj },
        { tags: queryObj },
        { "$User.username$": queryObj },
      ],
      status: true,
    },
  })
    .then((links) => {
      res.json(links);
    })
    .catch((error) => {
      createTrail(
        "Get Links",
        "Error during get all links",
        null,
        null,
        req.user.id,
        error.message
      );
      next(error);
    });
});

router.get("/page/:offset", (req, res, next) => {
  const page = req.params.offset;
  const offset = (page - 1) * 10;
  Links.findAndCountAll({
    where: { status: true },
    include: { model: Users, required: true, attributes: ["username", "name"] },
    limit: 10,
    offset: offset,
  })
    .then((links) => {
      res.json(links);
    })
    .catch((error) => {
      createTrail(
        "Get Links By page",
        "Error during get links by page",
        null,
        null,
        req.user.id,
        error.message
      );
      next(error);
    });
});

//Get Link By Id
router.get("/id/:id", async (req, res, next) => {
  const id = req.params.id;
  Links.findByPk(id, {
    include: { model: Users, required: true, attributes: ["username", "name"] },
  })
    .then((link) => {
      res.json(link);
    })
    .catch((error) => {
      createTrail(
        "Get Link by Id",
        "Error during get link",
        null,
        id,
        req.user.id,
        error.message
      );
      next(error);
    });
});

//Post New Link
router.post("/", (req, res, next) => {
  Links.create(req.body)
    .then((createdLink) => {
      createTrail(
        "Create New Link",
        "New link created",
        null,
        createdLink,
        createdLink.UserId,
        null
      );
      res.send(true);
    })
    .catch((error) => {
      createTrail(
        "Create New Link",
        "Error during link save",
        null,
        link,
        req.user.id,
        error.message
      );
      res.send(false);
    });
});

//Delete Link (update status to false)
router.delete("/id/:id", (req, res, next) => {
  Links.findByPk(req.params.id).then((prevValue) => {
    const userId = prevValue.UserId;
    Links.update({ status: false }, { where: { id: req.params.id } })
      .then((response) => {
        return Links.findOne({ where: { id: req.params.id } });
      })
      .then((newValue) => {
        createTrail(
          "Delete Link",
          "Delete link success",
          prevValue,
          newValue,
          userId,
          null
        );
        res.send(true);
      })
      .catch((error) => {
        createTrail(
          "Delete Link",
          "Error during link delete",
          null,
          { id: req.params.id },
          userId,
          error.message
        );
        res.send(false);
      });
  });
});

//Bulk Delete Link (update status to false)
router.delete("/ids", (req, res, next) => {
  Links.update({ status: false }, { where: { id: req.body.linkIds } })
    .then((response) => {
      return response;
    })
    .then((response) => {
      createTrail(
        "Bulk Delete Link",
        "Bulk Delete link success",
        { status: true },
        { id: req.body.linkIds, status: false },
        req.body.userId,
        null
      );
      res.send(true);
    })
    .catch((error) => {
      createTrail(
        "Delete Link",
        "Error during link delete",
        null,
        { id: req.body.linkIds },
        req.body.userId,
        error.message
      );
      res.send(false);
    });
});

//Update Links
router.patch("/id/:id", (req, res, next) => {
  Links.findByPk(req.params.id).then((prevValue) => {
    const userId = prevValue.UserId;
    Links.update(req.body.data, { where: { id: req.params.id } })
      .then((response) => {
        return Links.findOne({ where: { id: req.params.id } });
      })
      .then((newValue) => {
        createTrail(
          "Update Link",
          "Update link success",
          prevValue,
          newValue,
          userId,
          null
        );
        res.send(true);
      })
      .catch((error) => {
        createTrail(
          "Update Link",
          "Error during link update",
          null,
          { id: req.params.id },
          userId,
          error.message
        );
        res.send(false);
      });
  });
});

module.exports = router;
