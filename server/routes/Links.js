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
    include: { model: Users, required: true, attributes: ["username"] },
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
    include: { model: Users, required: true, attributes: ["username"] },
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
  const link = req.body;
  const userId = req.user.id;
  Links.create(link)
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
        userId,
        error.message
      );
      res.send(false);
    });
});

//Delete Link (update status to false)
router.delete("/id/:id", (req, res, next) => {
  const linkId = req.params.id;
  const userId = req.user.id;
  const getPrevValue = Links.findByPk(linkId);
  getPrevValue.then((prevValue) => {
    Links.update({ status: false }, { where: { id: linkId } })
      .then((response) => {
        return Links.findOne({ where: { id: linkId } });
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
          { id: linkId },
          userId,
          error.message
        );
        res.send(false);
      });
  });
});

//Bulk Delete Link (update status to false)
router.delete("/ids", (req, res, next) => {
  const { linkIds, userId } = req.body;
  Links.update({ status: false }, { where: { id: linkIds } })
    .then((response) => {
      return response;
    })
    .then((response) => {
      createTrail(
        "Bulk Delete Link",
        "Bulk Delete link success",
        { status: true },
        { id: linkIds, status: false },
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
        { id: linkIds },
        userId,
        error.message
      );
      res.send(false);
    });
});

//Update Pin
router.patch("/id/:id", (req, res, next) => {
  const linkId = req.params.id;
  const userId = req.user.id;
  const update = req.body;
  const getPrevValue = Links.findByPk(linkId);
  getPrevValue.then((prevValue) => {
    Links.update(update, { where: { id: linkId } })
      .then((response) => {
        return Links.findOne({ where: { id: linkId } });
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
          { id: linkId },
          userId,
          error.message
        );
        res.send(false);
      });
  });
});

module.exports = router;
