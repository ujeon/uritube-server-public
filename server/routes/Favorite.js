var express = require("express");
var favorites = require("../models").Favorites;

var router = express.Router();

router.post("/toggle", (req, res) => {
  if (req.token && req.token.id) {
    favorites
      .findOne({
        where: {
          user_id: req.body.user_id,
          category_id: req.body.category_id
        }
      })
      .then(result => {
        if (!result) {
          favorites
            .create({
              check: true,
              user_id: req.body.user_id,
              category_id: req.body.category_id
            })
            .then(result => res.json(result))
            .catch(err => res.json(err));
        } else {
          favorites
            .destroy({
              where: {
                user_id: req.body.user_id,
                category_id: req.body.category_id
              }
            })
            .then(result => res.json(result))
            .catch(err => res.json(err));
        }
      });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
