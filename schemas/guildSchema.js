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
  welcomeChannel: {
    type: String,
    default: "",
  },
  memberRole: {
    type: String,
    default: "",
  },
  dmUsersOnJoin: {
    type: Boolean,
    default: false,
  },
  welcomeMessage: {
    type: String,
    default: "Hello **{usermention}**, welcome to **{guild}**!",
  },
  dmMessage: {
    type: String,
    default: "Hello and welcome to **{guild}**!",
  },
  warnRoles: {
    type: Object,
    default: {
      warn1: "",
      warn2: "",
      warn3: "",
    },
  },
  logChannel: {
    type: String,
    default: "",
  },
});

module.exports = model("guilds", guildSchema);
