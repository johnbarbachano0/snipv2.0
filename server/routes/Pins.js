const express = require("express");
const router = express.Router();
const { Pins, Users } = require("../models");
const { createTrail } = require("../middlewares/miscjs");
const { Op } = require("sequelize");

//Get Search Pins
router.get("/search", (req, res, next) => {
  const { query } = req.query;
  const queryObj = {
    [Op.like]: `%${query}%`,
  };
  Pins.findAll({
    include: {
      model: Users,
      as: "User",
      required: true,
      attributes: ["username", "name"],
    },
    where: {
      [Op.or]: [
        { title: queryObj },
        { description: queryObj },
        { "$User.username$": queryObj },
        { "$User.name$": queryObj },
      ],
      status: true,
    },
  })
    .then((pins) => {
      res.json(pins);
    })
    .catch((error) => {
      createTrail(
        "Get All Pins",
        "Error during get all pins",
        null,
        null,
        req.user.id,
        error.message
      );
      next(error);
    });
});

//Get Pin By Id
router.get("/id/:id", async (req, res, next) => {
  const id = req.params.id;
  Pins.findByPk(id, {
    include: { model: Users, required: true, attributes: ["username", "name"] },
  })
    .then((pins) => {
      res.json(pins);
    })
    .catch((error) => {
      createTrail(
        "Get Pin By Id",
        "Error during get pin by id",
        null,
        null,
        req.user.id,
        error.message
      );
      next(error);
    });
});

//Post New Pin
router.post("/", (req, res, next) => {
  Pins.create(req.body)
    .then((createdPin) => {
      createTrail(
        "Create New Pin",
        "New pin created",
        null,
        createdPin,
        createdPin.UserId,
        null
      );
      res.send(true);
    })
    .catch((error) => {
      createTrail(
        "Create New Pin",
        "Error during pin save",
        null,
        pin,
        req.user.id,
        error.message
      );
      res.send(false);
    });
});

//Delete Pin (update status to false)
router.delete("/id/:id", (req, res, next) => {
  try {
    Pins.findByPk(req.params.id).then((prevValue) => {
      const userId = prevValue.UserId;
      Pins.update({ status: false }, { where: { id: req.params.id } })
        .then((response) => {
          return Pins.findOne({ where: { id: req.params.id } });
        })
        .then((newValue) => {
          createTrail(
            "Delete Pin",
            "Delete success",
            prevValue,
            newValue,
            userId,
            null
          );
          res.send(true);
        })
        .catch((error) => {
          createTrail(
            "Delete Pin",
            "Error during pin delete",
            null,
            { id: req.params.id },
            userId,
            error.message
          );
          res.send(false);
        });
    });
  } catch (error) {
    next(error);
  }
});

//Update Pin
router.patch("/id/:id", (req, res, next) => {
  Pins.findByPk(req.params.id).then((prevValue) => {
    const userId = prevValue.UserId;
    Pins.update(req.body.data, { where: { id: req.params.id } })
      .then((response) => {
        return Pins.findOne({ where: { id: req.params.id } });
      })
      .then((newValue) => {
        createTrail(
          "Update Pin",
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
          "Update Pin",
          "Error during pin update",
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
