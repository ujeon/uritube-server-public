/*eslint-disable */
/* eslint no-use-before-define: 0 */
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var session = require("express-session");
var cookieParser = require("cookie-parser");

var Title = require("./routes/Title");
var Users = require("./routes/Users");
var Category = require("./routes/Category");
var Comments = require("./routes/Comments");
var Favorite = require("./routes/Favorite");

var checkValidReq = require("./middleware/checkValidReq");
var checkToken = require("./middleware/checkToken");

const app = express();

app.use(cors());

app.use(
  session({
    secret: "Uritube",
    cookie: {
      maxAge: 1000 * 60 * 5
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkValidReq);
app.use(checkToken);

app.use("/titles", Title);
app.use("/users", Users);
app.use("/categories", Category);
app.use("/comments", Comments);
app.use("/favorite", Favorite);

app.listen(8080, () => {
  console.log("URITUBE SERVER IS RUNNING 😃");
});
