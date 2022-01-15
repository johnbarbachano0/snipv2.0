"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Users", // table name
        "socialId", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        }
      ),
      queryInterface.addColumn(
        "Users", // table name
        "name", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Users", // table name
        "email", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
          validate: { isEmail: true },
        }
      ),
      queryInterface.addColumn(
        "Users", // table name
        "provider", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Users", // table name
        "accessToken", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "Users", // table name
        "refreshToken", // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "socialId"),
      queryInterface.removeColumn("Users", "name"),
      queryInterface.removeColumn("Users", "email"),
      queryInterface.removeColumn("Users", "provider"),
      queryInterface.removeColumn("Users", "accessToken"),
      queryInterface.removeColumn("Users", "refreshToken"),
    ]);
  },
};
