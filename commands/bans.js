const { Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "bans",
  description: "View the bans for your guild!",
  usage: "{prefix}bans",
  userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
  clientPermissions: [],
  type: "Moderation",
  cooldown: ms("5s"),
  testing: false,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var currentBans = await message.guild.bans.fetch();
    if (currentBans.size <= 0)
      return await message.reply({
        content: "This server does not have any bans (yet)!",
      });
    var final = [];
    var number = 1;
    currentBans.forEach((ban) => {
      var value = `\`${number}\` - **User:** \`${
        ban.user.tag
      }\`, **Reason:** \`${
        ban.reason != null ? ban.reason : "Unknown Reason"
      }\``;
      final.push(value);
      number++;
    });
    const bans_embed = new MessageEmbed()
      .setColor(colors.dred)
      .setTitle(`Bans in ${message.guild.name}`)
      .setDescription(`${final.join("\n")}`);
    await message.reply({
      embeds: [bans_embed],
    });
  },
};
