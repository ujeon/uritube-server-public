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

const app = express();

app.use(
  session({
    secret: "Uritube"
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/titles", Title);
app.use("/users", Users);
app.use("/categories", Category);
app.use("/comments", Comments);

app.listen(3000, () => {
  console.log("URITUBE SERVER IS RUNNING 😃");
});
