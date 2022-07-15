const { GuildMember, Permissions, MessageAttachment } = require("discord.js");
const Guilds = require("../schemas/guildSchema");
const { createCanvas, loadImage } = require("canvas");
const { applyText } = require("../utils/");
const config = require("../config.json");

module.exports = {
  name: "guildMemberRemove",
  once: false,
  /**
   * @param {GuildMember} member
   */
  execute: async (member) => {
    var Guild = await Guilds.findOne({ id: member.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: member.guild.id,
      });
      Guild.save();
    }
    var welcomeChannel = member.guild.channels.cache.get(Guild.welcomeChannel);

    if (!welcomeChannel) return;
    if (
      !member.guild.me
        .permissionsIn(welcomeChannel)
        .has([Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES])
    )
      return;

    if (member.guild.bans.cache.has(member.user.id)) {
      var ban = member.guild.bans.cache.get(member.user.id);
      var banMessage = Guild.banMessage
        .replace("{username}", `${member.user.username}`)
        .replace("{usertag}", `${member.user.tag}`)
        .replace("{guild}", `${member.guild.name}`)
        .replace("{userdisc}", `${member.user.discriminator}`)
        .replace("{membercount}", `${member.guild.members.cache.size}`)
        .replace(
          "{reason}",
          `${ban.reason != null ? ban.reason : "Unknown Reason"}`
        );

      return await welcomeChannel.send({
        content: `${banMessage}`,
      });
    }

    var leaveMessage = Guild.leaveMessage
      .replace("{usertag}", `${member.user.tag}`)
      .replace("{userid}", `${member.user.id}`)
      .replace("{guild}", `${member.guild.name}`)
      .replace("{username}", `${member.user.username}`)
      .replace("{userdisc}", `${member.user.discriminator}`);

    await welcomeChannel.send({
      content: `${leaveMessage}`,
    });
  },
};
