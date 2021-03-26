const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverRide = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const AppError = require("./utilities/AppError");

const campgroundRoute = require("./routes/campground");
const reviewRoute = require("./routes/reviews");

// database

mongoose
  .connect("mongodb://localhost:27017/campster", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("database is connected"))
  .catch((e) => console.log(e));

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisissecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

// campground route

app.use("/campgrounds", campgroundRoute);

// review route

app.use("/campgrounds", reviewRoute);

app.all("*", (req, res, next) => {
  next(new AppError(404, " Page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).render("error", { err });
});

app.listen(8080, () => console.log("running on 8080"));
