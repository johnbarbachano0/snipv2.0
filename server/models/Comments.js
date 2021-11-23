module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Comments.associate = (models) => {
    Comments.belongsTo(models.Pins);
    Comments.belongsTo(models.Users);
  };

  return Comments;
};
