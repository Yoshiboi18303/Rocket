const ShortLinks = require("../schemas/shortLinkSchema");
const { Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "reportshortlink",
  description:
    "Report a short link (ensuring that the short link system is clean)!",
  usage: "{prefix}reportshortlink <id> [reason]",
  aliases: ["reportlink", "linkreport"],
  type: "Other",
  cooldown: ms("10s"),
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var id = args[0];
    var reason = args.slice(1).join(" ") || "No Reason Provided!";
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
    var supportServer = message.client.guilds.cache.get("977632347862216764");
    var logChannel = supportServer.channels.cache.get("978346448880029776");
    const new_report_embed = new MessageEmbed()
      .setColor(colors.orange)
      .setTitle("New Short Link Report!")
      .setDescription(`A short link was just reported!`)
      .addFields([
        {
          name: "ID",
          value: `\`\`\`\n${id}\n\`\`\``,
          inline: true,
        },
        {
          name: "Link",
          value: `\`\`\`\n${ShortLink.link}\n\`\`\``,
          inline: true,
        },
        {
          name: "New Report Count",
          value: `\`\`\`\n${ShortLink.reportCount + 1}\n\`\`\``,
          inline: true,
        },
        {
          name: "Reason",
          value: `\`\`\`\n${reason}\n\`\`\``,
          inline: true,
        },
      ]);
    await logChannel.send({
      content: `<@${config.owner}>`,
      embeds: [new_report_embed],
    });
    var object = {
      reporter: message.author.id,
      reason,
    };
    ShortLinks.findOneAndUpdate(
      {
        id,
      },
      {
        $push: {
          reports: object,
        },
        $inc: {
          reportCount: 1,
        },
      }
    ).then((data) => data.save());
    const reported_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription("Link Reported!");
    await message.reply({
      embeds: [reported_embed],
    });
  },
};
