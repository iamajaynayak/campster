const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverRide = require("method-override");
const ejsMate = require("ejs-mate");

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
