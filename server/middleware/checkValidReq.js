var express = require("express");
var router = express.Router();

var reqBody = require("../request/reqBody.json");

//NOTE 타당한 요청인지 확인하는 미들웨어
router.use((req, res, next) => {
  if (req.method === "POST") {
    let bodyArray = Object.keys(req.body); // []
    let isValid = true;
    let validator;
    let pathArr = req.path.split("/"); //  ["","path1","path2"]

    let paths = pathArr.filter(el => {
      if (el !== "" && isNaN(parseInt(el))) {
        return el;
      }
    });

    validator = reqBody[paths[0]][paths[1]];

    if (bodyArray.length === validator.length) {
      for (let i = 0; i < validator.length; i++) {
        if (!req.body[validator[i]]) {
          isValid = false;
          break;
        }
      }
    } else {
      isValid = false;
    }

    if (!isValid) {
      res.sendStatus(400);
    } else {
      next();
    }
  } else {
    next();
  }
});

module.exports = router;
