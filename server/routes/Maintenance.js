const express = require("express");
const router = express.Router();
const { DocumentStatus, Users } = require("../models");
const { Op } = require("sequelize");

//Get All Maintenance
router.get("/", (req, res, next) => {
  const DocumentStatusTable = DocumentStatus.findAll()
    .then((results) => {
      return { DocumentStatus: results };
    })
    .catch((error) => next(error));
  Promise.all([DocumentStatusTable]).then((values) => {
    const newValues = Object.assign({}, ...values);
    res.json([newValues]);
  });
});

module.exports = router;
