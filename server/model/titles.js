const sequelize = require("./index");
const Sequelize = require("sequelize");

const Titles = sequelize.define("titles", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Titles;
