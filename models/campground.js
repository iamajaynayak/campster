const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

// Schema
const campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  location: String,
  description: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Model

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
