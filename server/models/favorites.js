"use strict";
module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define(
    "Favorites",
    {
      check: DataTypes.BOOLEAN
    },
    {}
  );

  return Favorites;
};
