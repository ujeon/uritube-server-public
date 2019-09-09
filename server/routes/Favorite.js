var express = require("express");
var favorites = require("../models").Favorites;

var router = express.Router();

router.post("/toggle", (req, res) => {
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
          .then(result => res.send(JSON.stringify(result)))
          .catch(err => res.send(JSON.stringify(err)));
      } else {
        favorites
          .destroy({
            where: {
              user_id: req.body.user_id,
              category_id: req.body.category_id
            }
          })
          .then(result => res.send(JSON.stringify(result)))
          .catch(err => res.send(JSON.stringify(err)));
      }
    });
});

module.exports = router;
