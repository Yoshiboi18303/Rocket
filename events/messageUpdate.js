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
    if (oldMsg.author.id == client.user.id) return;
    if (oldMsg.content == newMsg.content) return;
    Log(client, newMsg.guild, Enum.Log.MessageEdit, {
      member: oldMsg.member,
      oldMessage:
        oldMsg.content.length <= 0 ? "*empty message*" : oldMsg.content,
      newMessage:
        newMsg.content.length <= 0 ? "*empty message*" : newMsg.content,
    });
  },
};
