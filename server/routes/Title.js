var express = require("express");
var titles = require("../models").titles;
var categories = require("../models").categories;

var router = express.Router();

router.get("/", async (req, res) => {
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
});

//REVIEW next가 필요한지?
router.post("/add", (req, res) => {
  titles
    .create({
      name: req.body.name
    })
    .then(result => res.send(JSON.stringify(result)));
});

router.post("/update", (req, res) => {
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
    });
});

router.post("/delete", (req, res) => {
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
      // console.log("Destroyed Memo? :", memo); // null
      res.send(result);
    });
});
module.exports = router;
