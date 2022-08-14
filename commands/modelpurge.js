const { Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const { purgeModel } = require("../purgeDatabase");

module.exports = {
  name: "modelpurge",
  description: "Purge a model (owner only)",
  usage: "{prefix}modelpurge <model>",
  cooldown: ms("20s"),
  type: "Owner",
  aliases: "purgemodel",
  ownerOnly: true,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    if (message.author.id == "381710555096023061") {
      return await message.reply({
        content: "You aren't authorized to run this command (yet)!"
      })
    }
    var model = args[0];
    if (!["users", "reviews", "guilds", "shortlinks"].includes(model))
      return await message.reply({
        content: "That's not a valid model available to purge!",
      });
    purgeModel(model);
    const embed = new MessageEmbed().setDescription(`Model Purged!`);
    await message.reply({
      embeds: [embed],
    });
  },
};
