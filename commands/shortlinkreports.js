const ShortLinks = require("../schemas/shortLinkSchema");
const { Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "shortlinkreports",
  description: "View the reports of a short link!",
  usage: "{prefix}shortlinkreports <id>",
  type: "Other",
  cooldown: ms("5s"),
  aliases: ["linkreports"],
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var id = args[0];
    var ShortLink = await ShortLinks.findOne({
      id,
    });
    if (!ShortLink) {
      const unknown_link_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("That's an unknown short link ID in the database!");
      return await message.reply({
        embeds: [unknown_link_embed],
      });
    }
    if (ShortLink.reportCount <= 0) {
      const no_reports_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("That short link doesn't have any reports as of now!");
      return await message.reply({
        embeds: [no_reports_embed],
      });
    }
    var reports = ShortLink.reports.map(
      (report, index) =>
        `\`${index + 1}\` - Reporter: ${
          message.client.users.cache.get(report.reporter)?.username ||
          "Unknown User"
        } (${
          message.client.users.cache.get(report.reporter)?.tag ||
          "Unknown User#0000"
        }), Reason: **\`${report.reason}\`**`
    );
    const reports_embed = new MessageEmbed()
      .setColor(colors.orange)
      .setTitle(`Reports for Short Link \`${id}\``)
      .setDescription(`${reports.join("\n")}`);
    await message.reply({
      embeds: [reports_embed],
    });
  },
};
