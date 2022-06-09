const { Message } = require("discord.js");

module.exports = {
  name: "guilds",
  description: "Shows the guilds the bot is in (owner only)",
  aliases: ["servers"],
  usage: "{prefix}guilds",
  type: "Owner",
  testing: false,
  ownerOnly: true,
  nsfw: false,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var guilds = client.guilds.cache;
    var map = guilds.map((g) => `\`${g.name}\``);
    const map_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setDescription(`${map.join(",\n")}`);
    await message.reply({
      embeds: [map_embed],
    });
  },
};
