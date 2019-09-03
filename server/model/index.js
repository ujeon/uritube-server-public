"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("./node_modules/sequelize");
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize("Uritube", "root", "", {
  host: "localhost",
  dialect: "mysql"
  // port: "8080"
});

sequelize.sync();

fs.readdirSync(__dirname)
  .filter(file => {
    console.log(file);
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
