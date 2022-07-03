const { Schema, model } = require("mongoose");

const shortLinkSchema = Schema({
  id: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: "",
  },
  visits: {
    type: Number,
    default: 0,
  },
  reports: {
    type: Array,
    default: [],
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  userIP: {
    type: String,
    default: "",
  },
});

module.exports = model("short-links", shortLinkSchema);
