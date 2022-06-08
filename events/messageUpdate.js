const Log = require("../utils/logger");
const { Message } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  once: false,
  /**
   * @param {Message} oldMsg
   * @param {Message} newMsg
   */
  execute: async (oldMsg, newMsg) => {
    if (oldMsg.author.bot || newMsg.author.bot) return;
    Log(client, newMsg.guild, Enum.Log.MessageEdit, {
      member: oldMsg.member,
      oldMessage: oldMsg.content,
      newMessage: newMsg.content,
    });
  },
};
