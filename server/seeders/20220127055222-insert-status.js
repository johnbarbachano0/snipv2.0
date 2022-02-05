"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert("DocumentStatuses", [
        {
          description: "draft",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "final",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface, sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete("DocumentStatuses", null, {}),
    ]);
  },
};
