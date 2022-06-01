const { Schema, model } = require("mongoose");

const warningSchema = Schema({
  user: {
    type: String,
    required: true,
  },
  guild: {
    type: String,
    default: "",
  },
  context: {
    type: Array,
    default: [],
  },
});

module.exports = model("user-warnings", warningSchema);
