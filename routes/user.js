const express = require("express");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require("passport");

// Render login and register pages
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

// Handle registration
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  console.log("Request body:", req.body);

  let errors = [];

  // Validation checks
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
 

  // Render errors if any
  if (errors.length > 0) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  }

  // Check if user already exists
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ msg: "Email is already registered" });
      return res.render("register", {
        errors,
        name,
        email,
        password,
        password2,
      });
    } else {
      // Create a new user instance
      const newUser = new User({
        name,
        email,
        password,
      });

      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error("Salt generation error:", err);
          return res.status(500).send("Server error during password hashing");
        }

        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.error("Hashing error:", err);
            return res.status(500).send("Server error during password hashing");
          }

          // Set password to hashed and save user
          newUser.password = hash;
          newUser
            .save()
            .then(() => {
              console.log("User registered successfully");
              res.redirect("/users/login");
            })
            .catch((err) => console.error("Error saving user:", err));
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res);
})

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
  }})
  req.flash('You are logged out');
  res.redirect('/users/login');
})

module.exports = router;
