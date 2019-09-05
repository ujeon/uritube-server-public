var express = require("express");
var categories = require("../models").categories;
var comments = require("../models").comments;
var users = require("../models").users;
var titles = require("../models").titles;

var router = express.Router();

router.route("/:id/comments").get(async (req, res, next) => {
  let ca_comments = await categories.findAll({ include: [comments] });

  let ca_id = req.params.id - 1;
  let result = ca_comments[ca_id].dataValues.comments.map(async ca_val => {
    return await users
      .findOne({
        where: { id: ca_val.dataValues.user_id }
      })
      .then(val => {
        ca_val.dataValues.ca_name = val.dataValues.name;
        return ca_val;
      });
  });

  for (let i = 0; i < result.length; i++) {
    result[i] = await result[i];
  }

  res.send(result);
  next();
});

router.post("/add", async (req, res) => {
  let title_id = await titles
    .findOne({
      where: { name: req.body.title }
    })
    .then(val => val.dataValues.id);

  categories
    .create({
      name: req.body.name,
      title_id: title_id
    })
    .then(val => res.send(val));
});

module.exports = router;
