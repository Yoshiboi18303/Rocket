const { GuildMember, Permissions } = require("discord.js");
const Guilds = require("../schemas/guildSchema");

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

    var leaveMessage = Guild.leaveMessage
      .replace("{usertag}", `${member.user.tag}`)
      .replace("{userid}", `${member.user.id}`)
      .replace("{guild}", `${member.guild.name}`)
      .replace("{username}", `${member.user.username}`);

    await welcomeChannel.send({
      content: `${leaveMessage}`,
    });
  },
};
