/*eslint-disable */
var express = require("express");
var bodyParser = require("body-parser");
var titles = require("./model").titles;
var categories = require("./model").categories;
var users = require("./model").users;
var ca_comments = require("./model").ca_comments;
var user_comments = require("./model").user_comments;
var cors = require("cors");
const app = express();

app.listen(3000, () => {
  console.log("server open!!!!!!!!!!!!!!!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/title", (req, res) => {
  titles
    .create({
      name: req.body.name
    })
    .then(val => res.send(val));
});

app.post("/category",   (req, res) => {
  var id =   titles
    .findOne({
      where: { name: req.body.title }
    })
    .then(val => val.dataValues.id);

  categories
    .create({
      name: req.body.name,
      titles_id: id
    })
    .then(val => res.send(val));
});

app.post("/user", (req, res) => {
   users
    .create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    })
    .then(val => res.send(val));
});

app.post("/comment",  (req, res) => {
  var category_id =  categories
    .findOne({
      where: { name: req.body.category }
    })
    .then(val => val.dataValues.id);

  var user_id =  users
    .findOne({
      where: { name: req.body.user }
    })
    .then(val => val.dataValues.id);

  user_comments
    .create({
      text: req.body.text,
      user_id: user_id,
      category_id: category_id
    })
    .then(val => res.send(val));
});
