const express = require("express");
const passport = require("passport");
const routes = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utilities/wrapAsync");

routes.get("/register", (req, res) => {
  res.render("users/register");
});

routes.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const regUser = await User.register(user, password);
      req.flash("success", "Account created");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

routes.get("/login", (req, res) => {
  res.render("users/login");
});

routes.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/campgrounds");
  }
);

routes.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/campgrounds");
});

module.exports = routes;
