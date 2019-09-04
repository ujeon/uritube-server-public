var express = require("express");
var titles = require("../models").titles;
var categories = require("../models").categories;

var router = express.Router();

router.get("/", async (req, res, next) => {
  const titleResult = await titles.findAll().then(result => {
    console.log(result);
  });
  const categoryResult = await categories.findAll().then(val => val);
  [...titleResult, ...categoryResult];
  res.send([...titleResult, ...categoryResult]);
  next();
});

router.post("/add", (req, res) => {
  console.log(req.body);
  titles
    .create({
      name: req.body.name
    })
    .then(val => res.send(val));
  // next();
});

module.exports = router;
