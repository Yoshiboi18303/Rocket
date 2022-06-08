const { Schema, model } = require("mongoose");

const twitchSchema = Schema({
  id: {
    type: String,
    required: true,
  },
});

module.exports = model("twitch-users", twitchSchema);
