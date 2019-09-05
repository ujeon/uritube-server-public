var express = require("express");
var comments = require("../models").comments;
var categories = require("../models").categories;
var users = require("../models").users;

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

  comments
    .create({
      text: req.body.text,
      user_id: user_id,
      category_id: category_id
    })
    .then(val => res.send(val));
});

module.exports = router;
