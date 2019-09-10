var express = require("express");
var comments = require("../models").Comments;
var categories = require("../models").Categories;
var users = require("../models").Users;

var router = express.Router();

router.post("/add", async (req, res) => {
  var category_id = await categories
    .findOne({
      where: { id: req.body.category_id }
    })
    .then(val => val.dataValues.id);

  var user_id = await users
    .findOne({
      where: { name: req.body.user }
    })
    .then(val => val.dataValues.id);

  if (req.token && req.token.id === user_id) {
    await comments
      .create({
        text: req.body.text,
        user_id: user_id,
        category_id: category_id
      })
      .then(val => res.json(val));
  } else {
    res.sendStatus(401);
  }
});

router.post("/update", async (req, res) => {
  if (req.token && req.token.id) {
    comments
      .update(
        {
          text: req.body.text
        },
        {
          where: { id: req.body.comment_id }
        }
      )
      .then(() => {
        return comments.findOne({
          where: { text: req.body.text }
        });
      })
      .then(memo => {
        res.json(memo);
      });
  } else {
    res.sendStatus(401);
  }
});

router.post("/delete", (req, res) => {
  if (req.token && req.token.id) {
    comments
      .destroy({
        where: { id: req.body.comment_id }
      })
      .then(() => {
        return comments.findOne({ where: { id: req.body.comment_id } });
      })
      .then(memo => {
        res.json(memo);
      });
  } else {
    res.sendStatus(401);
  }
});
module.exports = router;
