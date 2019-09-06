var express = require("express");
var comments = require("../models").comments;
var categories = require("../models").categories;
var users = require("../models").users;

var router = express.Router();

router.post("/add", async (req, res, next) => {
  var category_id = await categories
    .findOne({
      where: { name: req.body.category }
    })
    .then(val => val.dataValues.id);

  var user_id = await users
    .findOne({
      where: { name: req.body.user }
    })
    .then(val => val.dataValues.id);

  await comments
    .create({
      text: req.body.text,
      user_id: user_id,
      category_id: category_id
    })
    .then(val => res.send(val));
  next();
});

router.post("/update", async (req, res, next) => {
  await comments
    .update(
      {
        text: req.body.text
      },
      {
        where: { id: req.body.id }
      }
    )
    .then(() => {
      return comments.findOne({
        where: { text: req.body.text }
      });
    })
    .then(memo => {
      res.send(JSON.stringify(memo));
    });
  next();
});

router.post("/delete", async (req, res) => {
  comments
    .destroy({
      where: { id: req.body.id }
    })
    .then(() => {
      return comments.findOne({ where: { id: req.body.id } });
    })
    .then(memo => {
      console.log("Destroyed Memo? :", memo); // null
      res.send(memo);
    });
});
module.exports = router;
