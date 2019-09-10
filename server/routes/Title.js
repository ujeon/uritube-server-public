var express = require("express");
var titles = require("../models").Titles;
var categories = require("../models").Categories;

var router = express.Router();

router.get("/", async (req, res) => {
  const titleResult = await titles.findAll().then(res => res);

  let result = titleResult.map(async el => {
    const temp = Object.assign({}, el.dataValues);
    temp.categories = await categories
      .findAll({
        where: { title_id: el.id }
      })
      .then(res => {
        return res.map(el => {
          return el.dataValues;
        });
      });

    return temp;
  });

  for (let i = 0; i < result.length; i++) {
    result[i] = await result[i];
  }

  res.json(result);
});

router.post("/add", (req, res) => {
  if (req.token && req.token.id === 1) {
    titles
      .create({
        name: req.body.name
      })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  } else {
    res.sendStatus(401);
  }
});

router.post("/update", (req, res) => {
  if (req.token && req.token.id === 1) {
    titles
      .update(
        {
          name: req.body.name
        },
        {
          where: { id: req.body.id }
        }
      )
      .then(() => {
        return titles.findOne({
          where: { name: req.body.name }
        });
      })
      .then(memo => {
        res.json(memo);
      })
      .catch(err => res.json(err));
  } else {
    res.sendStatus(401);
  }
});

router.post("/delete", (req, res) => {
  if (req.token && req.token.id === 1) {
    let result = {};
    titles
      .destroy({
        where: { name: req.body.name }
      })
      .then(() => {
        return titles.findOne({ where: { name: req.body.name } });
      })
      .then(() => {
        result.isTitlesDeleted = true;

        res.json(result);
      })
      .catch(err => res.json(err));
  } else {
    res.sendStatus(401);
  }
});
module.exports = router;
