var Sequelize = require("sequelize");

const sequelize = new Sequelize("Uritube", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: "6900"
});

module.exports = sequelize;
