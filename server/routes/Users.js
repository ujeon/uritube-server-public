var express = require("express");
var crypto = require("crypto");
var router = express.Router();
var jwt = require("jsonwebtoken");

var jwtKey = require("../secret/jwtKey.json");

var users = require("../models").Users;
var comments = require("../models").Comments;
var favorites = require("../models").Favorites;

router.route("/:id/info").get((req, res) => {
  const userId = req.params.id;
  if (req.token && req.token.id) {
    users
      .findOne({
        attributes: ["name", "email"],
        where: {
          id: userId
        }
      })
      .then(result => res.json(result))
      .catch(err => res.send(err));
  } else {
    res.sendStatus(401);
  }
});

router.route("/:id/comments").get((req, res) => {
  const userId = req.params.id;
  users
    .findOne({
      attributes: ["id", "email", "name"],
      include: [{ model: comments }],
      where: {
        id: userId
      }
    })
    .then(result => {
      result.dataValues["user_name"] = result.name;
      res.json(result);
    })
    .catch(err => res.send(err));
});

//TODO
router.route("/:id/favorite").get((req, res) => {
  const userId = req.params.id;
  users
    .findOne({
      attributes: ["id", "email", "name"],
      include: [{ model: favorites }],
      where: {
        id: userId
      }
    })
    .then(result => res.json(result));
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
              res.json(response);
            });
        }
      );
    });
  } else {
    response.isSignup = false;
    res.json(response);
  }
});

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
            let salt = jwtKey.key;
            res.cookie("isLogined", "true");
            res.json({
              token: jwt.sign(
                {
                  iat: Math.floor(Date.now() / 1000) - 30,
                  exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1시간 뒤 만료
                  id: user.id
                },
                salt
              ),
              id: user.id,
              user_name: user.name,
              user_email: user.email
            });
          } else {
            response.isSignin = false;
            res.json(response);
          }
        }
      );
    })
    .catch(function(err) {
      res.send(err);
    });
});

router.post("/signout", (req, res) => {
  if (req.token && req.token.id) {
    res.cookie("isLogined", "false");
    req.session.destroy(err => {
      if (err) res.send(err);
      res.end();
    });
  } else {
    res.send("이미 로그아웃 되었습니다.");
  }
});

router.post("/update", (req, res) => {
  if (req.token && req.token.id) {
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
                  id: req.token.id
                }
              }
            )
            .then(() => {
              return users.findOne({
                attributes: ["name", "email"],
                where: {
                  id: req.token.id
                }
              });
            })
            .then(result => res.json(result))
            .catch(err => res.send(err));
        }
      );
    });
  } else {
    res.sendStatus(403);
  }
});

router.post("/delete", (req, res) => {
  let result = {};

  if (req.token && req.token.id) {
    users
      .destroy({
        where: {
          id: req.token.id
        }
      })
      .then(() => {
        result.isUserDeleted = true;
        // req.cookie.isLogined = false; // TOFIX 여기서 에러가 납니다.
        // res.session.destroy(); // TOFIX 여기서 에러가 납니다.
        // res.clearCookie("");
        res.json(result);
      });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
