const { Schema, model } = require("mongoose");

const guildSchema = Schema({
  id: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: "r!",
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
  leaveMessage: {
    type: String,
    default: "Goodbye **{usertag}**, we will miss you...",
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
  filters: {
    type: Object,
    default: {
      language: {
        on: false,
        action: 0,
      },
      links: {
        on: false,
        action: 0,
      },
      mentions: {
        on: false,
        action: 0,
      },
      ghostPings: {
        on: false,
        action: 0,
      },
    },
  },
  starboard: {
    type: String,
    default: "",
  },
  ticketSettings: {
    type: Object,
    default: {
      modRole: "",
      msgChannel: "",
      parent: "",
      message: "",
    },
  },
  ticketsOpened: {
    type: Number,
    default: 0,
  },
});

module.exports = model("guilds", guildSchema);
