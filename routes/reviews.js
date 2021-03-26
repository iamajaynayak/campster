const express = require("express");
const wrapAsync = require("../utilities/wrapAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const router = express.Router();

// 1. post review
router.post(
  "/:id/reviews",
  wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "You have successfully created a new Review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// 2. delete review
router.delete(
  "/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted Review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
