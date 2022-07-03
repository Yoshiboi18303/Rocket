const { Message } = require("discord.js");
const { emojifyText } = require("../utils/");
const ms = require("ms");

module.exports = {
  name: "emojify",
  description: "Turns your text into Discord emojis!",
  usage: "{prefix}emojify <text>",
  aliases: [],
  type: "Fun",
  cooldown: ms("5s"),
  testing: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var text = args.join(" ");
    if (!text)
      return await message.reply({ content: "Please define some text!" });
    if (text.length > 2000)
      return await message.reply({
        content: "Your text is past the limit of 2000 characters!",
      });
    var final = emojifyText(text);
    await message.reply({
      content: `${final}`,
    });
  },
};
