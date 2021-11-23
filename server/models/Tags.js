module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define("Tags", {
    tag: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  //   Tags.associate = (models) => {
  //     Tags.belongsTo(models.Links);
  //   };

  return Tags;
};
