const { Schema, model } = require("mongoose");

const twitchSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
});

module.exports = model("twitch-users", twitchSchema);
