const express = require("express");
const routes = express.Router();

routes.get("/register", (req, res) => {
  res.render("users/register");
});

routes.post("/register", async (req, res) => {
  res.send(req.body);
});

module.exports = routes;
