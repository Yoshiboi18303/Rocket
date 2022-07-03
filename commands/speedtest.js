const { Message } = require("discord.js");
const ms = require("ms");
const shell = require("shelljs");

module.exports = {
  name: "speedtest",
  description: "Get the current speed of the network!",
  usage: "{prefix}speedtest",
  aliases: ["speed", "st", "testnetwork"],
  ownerOnly: true,
  type: "Owner",
  cooldown: ms("25s"),
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var msg = await message.reply({
      content: "Checking Network Speed...",
    });
    const output = shell.exec("speedtest");
    await msg.edit({
      content: `\`\`\`\n${output}\n\`\`\``,
    });
  },
};
