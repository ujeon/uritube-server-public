// const sequelize = require("./index");
// const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  const Users = sequelize.define(
    "users",
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
      }
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci",
      underscored: true,
      freezeTableName: true,
      tableName: "users"
    }
  );
  Users.associate = function(models) {
    models.users.hasMany(models.user_comments, {
      foreignKey: "user_id",
      onDelete: "cascade"
    });
  };
  return Users;
};
