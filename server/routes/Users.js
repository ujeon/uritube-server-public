var express = require("express");

var router = express.Router();

var users = require("../models").users;

router.route("/:id/info").get((req, res) => {
  const userId = req.params.id;
  if (req.session.user_id) {
    users
      .findOne({
        attributes: ["name", "email"],
        where: {
          id: userId
        }
      })
      .then(result => res.send(JSON.stringify(result)));
  }
});

router.route("/:id/comments").get((req, res) => {
  const userId = req.params.id;
  users
    .findOne({
      attributes: ["id", "email", "name"],
      include: [{ all: true }],
      where: {
        id: userId
      }
    })
    .then(result => res.send(JSON.stringify(result)));
});

router.post("/signup", async (req, res) => {
  const userExist = await users
    .findOne({ where: { email: req.body.email } })
    .then(result => result);

  let response = {};
  if (!userExist) {
    users
      .create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      })
      .then(() => {
        response.isSignup = true;
        res.send(JSON.stringify(response));
      });
  } else {
    response.isSignup = false;
    res.send(JSON.stringify(response));
  }
});

//NOTE 로그인 기능 프로토 타입
router.post("/signin", async (req, res) => {
  var sess = req.session;

  const userExist = await users
    .findOne({ where: { email: req.body.email } })
    .then(result => result);

  let response = {};
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

        response.isSignin = true;
        res.send(JSON.stringify(response));
      });
  } else {
    response.isSignin = false;
    res.send(JSON.stringify(response));
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

router.post("/update", (req, res) => {
  if (req.session.user_id) {
    users
      .update(
        {
          name: req.body.name,
          password: req.body.password
        },
        {
          where: {
            id: req.session.user_id
          }
        }
      )
      .then(() => {
        return users.findOne({
          attributes: ["name", "email"],
          where: {
            id: req.session.user_id
          }
        });
      })
      .then(result => res.send(JSON.stringify(result)));
  }
});

router.post("/delete", (req, res) => {
  let result = {};
  if (req.session.user_id) {
    users
      .destroy({
        where: {
          email: req.body.email,
          password: req.body.password
        }
      })
      .then(() => {
        result.isUserDeleted = true;
        res.clearCookie("connect.sid");
        res.send(JSON.stringify(result));
      });
  }
});

module.exports = router;
