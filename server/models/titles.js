module.exports = function(sequelize, DataTypes) {
  const Titles = sequelize.define(
    "titles",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci",
      underscored: true,
      freezeTableName: true,
      tableName: "titles"
    }
  );
  Titles.associate = function(models) {
    models.titles.hasMany(models.categories, {
      foreignKey: "titles_id",
      onDelete: "cascade"
    });
  };
  return Titles;
};
