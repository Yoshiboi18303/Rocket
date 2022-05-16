const { Schema, model } = require("mongoose");

const guildSchema = Schema({
  id: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: "rlc!",
  },
  unknownCommandMessage: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("guilds", guildSchema);
