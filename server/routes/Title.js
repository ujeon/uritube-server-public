var express = require("express");
var titles = require("../models").titles;
var categories = require("../models").categories;

var router = express.Router();

router.get("/", async (req, res, next) => {
  const titleResult = await titles.findAll().then(res => res);

  let result = titleResult.map(async el => {
    const temp = Object.assign({}, el.dataValues);
    temp.categories = await categories
      .findAll({
        where: { titles_id: el.id }
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
  next();
});

//REVIEW next가 필요한지?
router.post("/add", async (req, res, next) => {
  await titles
    .create({
      name: req.body.name
    })
    .then(result => res.send(JSON.stringify(result)));
  next();
});

router.post("/update", async (req, res, next) => {
  await titles
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
    });
  next();
});

router.post("/delete", async (req, res) => {
  titles
    .destroy({
      where: { name: req.body.name }
    })
    .then(() => {
      return titles.findOne({ where: { name: req.body.name } });
    })
    .then(memo => {
      console.log("Destroyed Memo? :", memo); // null
      res.send(memo);
    });
});
module.exports = router;
