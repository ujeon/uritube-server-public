var express = require("express");
var categories = require("../models").Categories;
var comments = require("../models").Comments;
var users = require("../models").Users;
var titles = require("../models").Titles;

var router = express.Router();

router.route("/:id/comments").get(async (req, res) => {
  try {
    let ca_comments = await categories.findAll({ include: [comments] });
    let ca_id = req.params.id - 1;
    let ca_name = ca_comments[ca_id].dataValues.name;
    let result = ca_comments[ca_id].dataValues.Comments.map(async ca_val => {
      return await users
        .findOne({
          where: { id: ca_val.dataValues.user_id }
        })
        .then(val => {
          ca_val.dataValues.ca_name = ca_name;
          ca_val.dataValues.user_name = val.dataValues.name;
          return ca_val;
        });
    });
    for (let i = 0; i < result.length; i++) {
      result[i] = await result[i];
    }

    res.send(JSON.stringify(result));
  } catch (err) {
    res.send(JSON.stringify(err));
  }
});

router.post("/add", async (req, res) => {
  if (req.session.id !== 1) {
    res.sendStatus(401);
  } else {
    let title_id = await titles
      .findOne({
        where: { name: req.body.title }
      })
      .then(val => val.dataValues.id);

    await categories
      .create({
        name: req.body.name,
        title_id: title_id
      })
      .then(val => res.send(JSON.stringify(val)))
      .catch(err => res.send(JSON.stringify(err)));
  }
});

router.post("/update", async (req, res) => {
  if (req.session.id !== 1) {
    res.sendStatus(401);
  } else {
    await categories
      .update(
        {
          name: req.body.name
        },
        {
          where: { id: req.body.id }
        }
      )
      .then(() => {
        return categories.findOne({
          where: { name: req.body.name }
        });
      })
      .then(memo => {
        res.send(JSON.stringify(memo));
      })
      .catch(err => res.send(JSON.stringify(err)));
  }
});

router.post("/delete", async (req, res) => {
  if (req.session.id !== 1) {
    res.sendStatus(401);
  } else {
    await categories
      .destroy({
        where: { id: req.body.id }
      })
      .then(() => {
        return categories.findOne({ where: { id: req.body.id } });
      })
      .then(memo => {
        console.log("Destroyed Memo? :", memo); // null
        res.send(JSON.stringify(memo));
      })
      .catch(err => res.send(JSON.stringify(err)));
  }
});

module.exports = router;
