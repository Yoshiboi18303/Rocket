const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  starCount: {
    type: Number,
    default: 3,
  },
  formattedStars: {
    type: String,
    default: "⭐⭐⭐",
  },
  review: {
    type: String,
    default: "",
  },
});

module.exports = model("reviews", reviewSchema);
