module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { min: 4 },
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "User",
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Pins);
    Users.hasMany(models.AuditTrail);
    Users.hasMany(models.Comments);
    Users.hasMany(models.Links);
  };
  return Users;
};
