const sequelize = require("./index");
const Sequelize = require("sequelize");
const Titles = require("./titles");

const Categories = sequelize.define("categories", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Categories.belongsTo(Titles);

module.exports = Categories;
