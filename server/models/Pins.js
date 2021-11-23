module.exports = (sequelize, DataTypes) => {
  const Pins = sequelize.define("Pins", {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Pins.associate = (models) => {
    Pins.hasMany(models.Comments);
    Pins.belongsTo(models.Users);
  };

  return Pins;
};
