var express = require("express");
var jwt = require("jsonwebtoken");
var jwtKey = require("../secret/jwtKey.json");

var router = express.Router();

router.use((req, res, next) => {
  let token = req.headers.token;
  let salt = jwtKey.key;

  if (token) {
    jwt.verify(token, salt, (err, token) => {
      if (err) res.json(err); // TODO 토큰이 만료되면 로그인 페이지로 리디렉트 필요!
      req.token = token;
      next();
    });
  } else {
    next();
  }
});

module.exports = router;
