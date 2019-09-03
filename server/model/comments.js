const sequelize = require("./index");
const Sequelize = require("sequelize");

const Comments = sequelize.define("comments", {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Comments;
