"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize("Uritube", "LA", "Uritube!!0290", {
  host: "uritube-database.cucu5jpgrdgl.ap-northeast-2.rds.amazonaws.com",
  dialect: "mysql",
  port: "6900"
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
