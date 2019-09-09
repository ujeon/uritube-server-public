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

  //TOFIX 좀 더 세련된..? 방법이 없을까요
  for (let i = 0; i < result.length; i++) {
    result[i] = await result[i];
  }

  res.send(JSON.stringify(result));
});

//REVIEW next가 필요한지?
router.post("/add", (req, res) => {
  if (req.session.id !== 1) {
    res.sendStatus(401);
  } else {
    titles
      .create({
        name: req.body.name
      })
      .then(result => res.send(JSON.stringify(result)))
      .catch(err => res.send(JSON.stringify(err)));
  }
});

router.post("/update", (req, res) => {
  if (req.session.id !== 1) {
    res.sendStatus(401);
  } else {
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
        res.send(JSON.stringify(memo));
      })
      .catch(err => res.send(JSON.stringify(err)));
  }
});

router.post("/delete", (req, res) => {
  if (req.session.id !== 1) {
    res.sendStatus(401);
  } else {
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

        res.send(JSON.stringify(result));
      })
      .catch(err => res.send(JSON.stringify(err)));
  }
});
module.exports = router;
