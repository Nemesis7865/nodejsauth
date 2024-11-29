const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

const app = express();

//passport config
require("./config/passport")(passport);

//import db
const db = require("./db/connect").Mongo_URL;

//db connection
mongoose
  .connect(db, { dbName: "nodejsauth" })
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.error(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser middleware
app.use(express.urlencoded({ extended: false }));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport session
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(2000, console.log("listening on port 2000"));
