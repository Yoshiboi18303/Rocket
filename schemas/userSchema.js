const { Schema, model } = require("mongoose");

const opBool = {
  type: Boolean,
  default: false,
};

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
  commandsUsed: {
    type: Number,
    default: 1,
  },
  admin: opBool,
  owner: opBool,
  voted: opBool,
  blacklisted: opBool,
  carColor: {
    type: String,
    default: "#136bea",
  },
});

module.exports = model("users", userSchema);
