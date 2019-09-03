const sequelize = require("./index");
const Sequelize = require("sequelize");

const Users = sequelize.define("users", {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Users;
