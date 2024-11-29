const express = require("express");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require('passport');

router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  console.log(req.body);
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill the form" });
  }
  if (password !== password2) {
    errors.push({ msg: "Password does not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render(
      "register",
      {
        errors,
        name,
        email,
        password,
        password2,
      },
      console.log(errors)
    );
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email alrready exists" });
        res.render(
          "register",
          { errors, name, email, password, password2 },
          console.log(errors)
        );
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hashed
            newUser.password = hash;
            //sav user
            newUser
              .save()
              .then((user) => {
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

})

router.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          return next(err);
      }})
  req.flash( 'You are logged out');
  res.redirect('/users/login');
})

module.exports = router;
