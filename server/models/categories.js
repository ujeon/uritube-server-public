"use strict";
module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    "Categories",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Categories.associate = function(models) {
    // associations can be defined here
    models.Categories.hasMany(models.Comments, {
      foreignKey: "category_id",
      onDelete: "cascade"
    });
    models.Categories.hasMany(models.Favorites, {
      foreignKey: "category_id",
      onDelete: "cascade"
    });
  };
  return Categories;
};
