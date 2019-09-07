"use strict";
module.exports = (sequelize, DataTypes) => {
  const Titles = sequelize.define(
    "Titles",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Titles.associate = function(models) {
    // associations can be defined here
    models.Titles.hasMany(models.Categories, {
      foreignKey: "title_id",
      onDelete: "cascade"
    });
  };
  return Titles;
};
