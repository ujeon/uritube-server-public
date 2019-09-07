"use strict";
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Users.associate = function(models) {
    // associations can be defined here
    models.Users.hasMany(models.Comments, {
      foreignKey: "user_id",
      onDelete: "cascade"
    });
    models.Users.hasMany(models.Favorites, {
      foreignKey: "user_id",
      onDelete: "cascade"
    });
  };
  return Users;
};
