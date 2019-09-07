var express = require("express");
var comments = require("../models").Comments;
var categories = require("../models").Categories;
var users = require("../models").Users;

var router = express.Router();

router.post("/add", async (req, res) => {
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
});

router.post("/update", (req, res) => {
  comments
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
});

router.post("/delete", (req, res) => {
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
