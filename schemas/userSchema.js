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
    default: {
      padlocks: 0,
      boosters: 0,
      gun: "",
    },
  },
  commandsUsed: {
    type: Number,
    default: 1,
  },
  admin: opBool,
  owner: opBool,
  voted: opBool,
  voteExpiration: {
    type: Number,
    default: 0,
  },
  blacklisted: opBool,
  carColor: {
    type: String,
    default: "#136bea",
  },
  reminders: {
    type: Array,
    default: [],
  },
  globalWarnings: {
    type: Number,
    default: 0,
  },
  bugHunterLevel: {
    type: Number,
    default: 0,
  },
  wakaTimeAccessToken: {
    type: String,
    default: "",
  },
});

module.exports = model("users", userSchema);
