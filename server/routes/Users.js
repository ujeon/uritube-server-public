var express = require("express");

var router = express.Router();

var users = require("../models").users;

router.route("/:id/info").get(async (req, res, next) => {
  const userId = req.params.id;

  await users
    .findOne({
      attributes: ["name", "email"],
      where: {
        id: userId
      }
    })
    .then(result => res.send(JSON.stringify(result)));

  next();
});

router.route("/:id/comments").get(async (req, res, next) => {
  const userId = req.params.id;
  await users
    .findOne({
      attributes: ["id", "email", "name"],
      include: [{ all: true }],
      where: {
        id: userId
      }
    })
    .then(result => res.send(JSON.stringify(result)));
  next();
});

router.post("/signup", async (req, res) => {
  const userExist = await users
    .findOne({ where: { email: req.body.email } })
    .then(result => result);

  let result = {};
  if (!userExist) {
    users
      .create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      })
      .then(() => {
        result.isSignup = true;
        res.send(result);
      });
  } else {
    result.isSignup = false;
    res.send(result);
  }
});

//NOTE 로그인 기능 프로토 타입
router.post("/signin", async (req, res) => {
  var sess = req.session;
  console.log(req.cookies);

  const userExist = await users
    .findOne({ where: { email: req.body.email } })
    .then(result => result);

  let temp = {};
  if (userExist) {
    users
      .findOne({
        where: {
          email: req.body.email,
          password: req.body.password
        }
      })
      .then(result => {
        sess.user_id = result.dataValues.id;
        console.log(sess);

        temp.isSignin = true;
        res.send(temp);
      });
  } else {
    temp.isSignin = false;
    res.send(temp);
  }
});

//NOTE 로그아웃 기능 프로토 타입
router.post("/signout", (req, res) => {
  if (req.session.user_id) {
    res.clearCookie("connect.sid");
    res.end();
  } else {
    res.end();
  }
});

module.exports = router;
