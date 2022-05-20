const { Schema, model } = require("mongoose");

const userSchema = Schema({
  id: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    default: 0,
  },
  wins: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "Bronze",
  },
  items: {
    type: Object,
    default: {},
  },
});

module.exports = model("users", userSchema);
