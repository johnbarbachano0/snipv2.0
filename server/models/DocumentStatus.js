module.exports = (sequelize, DataTypes) => {
  const DocumentStatus = sequelize.define("DocumentStatus", {
    description: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  DocumentStatus.associate = (models) => {
    DocumentStatus.hasMany(models.Changelogs);
  };
  return DocumentStatus;
};
