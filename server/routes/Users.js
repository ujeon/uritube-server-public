var express = require("express");
var crypto = require("crypto");
var router = express.Router();

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
  var sess = req.session;

  let response = {};

  users
    .findOne({
      where: {
        email: req.body.email
      }
    })
    .then(result => {
      sess.user_id = result.dataValues.id;
      crypto.pbkdf2(
        req.body.password,
        result.dataValues.key,
        199543,
        64,
        "sha512",
        (err, key) => {
          if (key.toString("base64") === result.dataValues.password) {
            response.isSignin = true;
            res.send(JSON.stringify(response));
          } else {
            response.isSignin = false;
            res.send(JSON.stringify(response));
          }
        }
      );
    });
});

//NOTE 로그아웃 기능 프로토 타입
router.post("/signout", (req, res) => {
  if (req.session.user_id) {
    res.session.destroy();
    res.clearCookie("connect.sid");
    res.end();
  } else {
    res.end();
  }
});

router.post("/update", (req, res) => {
  if (req.session.user_id) {
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
            .then(result => res.send(JSON.stringify(result)))
            .catch(err => res.send(JSON.stringify(err)));
        }
      );
    });
  } else {
    res.sendStatus(401);
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
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
