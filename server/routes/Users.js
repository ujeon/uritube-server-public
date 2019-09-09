var express = require("express");
var crypto = require("crypto");
var router = express.Router();
var jwt = require("jsonwebtoken");

var users = require("../models").Users;

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
      .then(result => res.setStatus(200).send(JSON.stringify(result)))
      .catch(err => JSON.stringify(err));
  } else {
    res.sendStatus(401);
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
    crypto.randomBytes(64, (err, buf) => {
      crypto.pbkdf2(
        req.body.password,
        buf.toString("base64"),
        199543,
        64,
        "sha512",
        (err, key) => {
          users
            .create({
              email: req.body.email,
              name: req.body.name,
              password: key.toString("base64"),
              key: buf.toString("base64")
            })
            .then(() => {
              response.isSignup = true;
              res.send(JSON.stringify(response));
            });
        }
      );
    });
  } else {
    response.isSignup = false;
    res.send(JSON.stringify(response));
  }
});

//NOTE 로그인 기능 프로토 타입
router.post("/signin", async (req, res) => {
  let response = {};
  users
    .findOne({
      where: { email: req.body.email }
    })
    .then(user => {
      crypto.pbkdf2(
        req.body.password,
        user.dataValues.key,
        199543,
        64,
        "sha512",
        (err, key) => {
          if (key.toString("base64") === user.dataValues.password) {
            res.cookie.isLogined = true;
            res.json({
              token: jwt.sign(
                {
                  iat: 1440,
                  id: user.id
                },
                "Uritube!!Zzang"
              ),
              user_name: user.name,
              user_email: user.email
            });
          } else {
            response.isSignin = false;
            res.send(JSON.stringify(response));
          }
        }
      );
    })
    .catch(function(err) {
      res.send(err);
    });
});

//NOTE 로그아웃 기능 프로토 타입
router.post("/signout", (req, res) => {
  if (typeof token !== "undefined" && req.cookie.isLogined === true) {
    req.cookie.isLogined = false;
    res.session.destroy();
    res.clearCookie("connect.sid");
    res.end();
  } else {
    res.end();
  }
});

router.post("/update", (req, res) => {
  var token = req.headers.token;
  if (typeof token !== "undefined") {
    var decoded = jwt.verify(token, "Uritube!!Zzang");
    crypto.randomBytes(64, (err, buf) => {
      crypto.pbkdf2(
        req.body.password,
        buf.toString("base64"),
        199543,
        64,
        "sha512",
        (err, key) => {
          users
            .update(
              {
                name: req.body.name,
                password: key.toString("base64"),
                key: buf.toString("base64")
              },
              {
                where: {
                  id: decoded.id
                }
              }
            )
            .then(() => {
              return users.findOne({
                attributes: ["name", "email"],
                where: {
                  id: decoded.id
                }
              });
            })
            .then(result => res.send(JSON.stringify(result)))
            .catch(err => res.send(JSON.stringify(err)));
        }
      );
    });
  } else {
    res.sendStatus(403);
  }
});

router.post("/delete", (req, res) => {
  var token = req.headers.token;
  let result = {};
  if (typeof token !== "undefined") {
    var decoded = jwt.verify(token, "Uritube!!Zzang");
    users
      .destroy({
        where: {
          id: decoded.id
        }
      })
      .then(() => {
        result.isUserDeleted = true;
        req.cookie.isLogined = false;
        res.session.destroy();
        res.clearCookie("connect.sid");
        res.send(JSON.stringify(result));
      });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
