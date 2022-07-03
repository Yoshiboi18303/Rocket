const Log = require("../utils/logger");
const { Message } = require("discord.js");

module.exports = {
  name: "messageDelete",
  once: false,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    Log(client, message.guild, Enum.Log.MessageDelete, {
      member: message.member,
      message: message.content,
    });
  },
};
