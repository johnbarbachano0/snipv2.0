module.exports = (sequelize, DataTypes) => {
  const Links = sequelize.define("Links", {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    siteUrl: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Links.associate = (models) => {
    Links.belongsTo(models.Users);
  };

  return Links;
};
