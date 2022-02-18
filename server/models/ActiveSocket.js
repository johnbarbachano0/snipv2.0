module.exports = (sequelize, DataTypes) => {
  const ActiveSocket = sequelize.define("ActiveSocket", {
    socketId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  ActiveSocket.associate = (models) => {
    ActiveSocket.belongsTo(models.Users);
  };

  return ActiveSocket;
};
