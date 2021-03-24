const express = require("express");
const wrapAsync = require("../utilities/wrapAsync");
const AppError = require("../utilities/AppError");
const Campground = require("../models/campground");
const router = express.Router();

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campground/index", { campgrounds });
  })
);

// Order of these app.get / app.post matters

router.get("/new", (req, res) => {
  res.render("campground/createNew");
});

router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    console.log(req.body);
    if (
      !req.body.title &&
      !req.body.location &&
      !req.body.price &&
      !req.body.description
    )
      throw new AppError(400, "Invalid data");
    const newCamp = new Campground(req.body);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);
// individual id camp

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campground/show", { campground });
  })
);

//edit

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/editCamp", { campground });
  })
);

router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    if (
      !req.body.title &&
      !req.body.location &&
      !req.body.price &&
      !req.body.description
    )
      throw new AppError(400, "Invalid data");
    const { id } = req.params;
    const { title, location, image, price, description } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, {
      title,
      location,
      image,
      price,
      description,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//delete

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
