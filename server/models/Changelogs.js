module.exports = (sequelize, DataTypes) => {
  const Changelogs = sequelize.define("Changelogs", {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    changelog: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Changelogs.associate = (models) => {
    Changelogs.belongsTo(models.DocumentStatus, {
      foreignKey: {
        allowNull: false,
      },
    });
    Changelogs.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Changelogs;
};
