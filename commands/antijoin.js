const { Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");
const Guilds = require("../schemas/guildSchema");
const colors = require("../colors.json");

module.exports = {
  name: "antijoin",
  description: "Set your antijoin status",
  usage: "{prefix}antijoin <status>",
  type: "Moderation",
  cooldown: ms("5s"),
  aliases: "aj, antij, nojoin",
  userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
  clientPermissions: [],
  testing: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var status = args[0]?.toLowerCase();
    var validStatuses = ["true", "false", "on", "off"];
    if (!validStatuses.includes(status)) {
      const invalid_status_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "That's not a valid status! The valid statuses are `true`, `false`, `on` and `off`"
        );
      return await message.reply({
        embeds: [invalid_status_embed],
      });
    }
    var Guild = await Guilds.findOne({
      id: message.guild.id,
    });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    status = status == "on" || status == "true" ? true : false;
    if (
      status &&
      !message.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
    ) {
      const bad_permissions_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "I require the `KICK_MEMBERS` permission before you can enable the Anti Join system!"
        );
      return await message.reply({
        embeds: [bad_permissions_embed],
      });
    }
    Guilds.findOneAndUpdate(
      {
        id: message.guild.id,
      },
      {
        $set: {
          antiJoin: status,
        },
      }
    ).then((data) => data.save());
    const changedEmbed = new MessageEmbed()
      .setColor(colors.orange)
      .setDescription(`Anti Join ${status ? "Enabled" : "Disabled"}`);
    await message.reply({
      embeds: [changedEmbed],
    });
  },
};
