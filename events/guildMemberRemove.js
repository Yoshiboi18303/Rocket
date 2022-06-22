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

    if (member.guild.id != config.testServerId) {
      var leaveMessage = Guild.leaveMessage
        .replace("{usertag}", `${member.user.tag}`)
        .replace("{userid}", `${member.user.id}`)
        .replace("{guild}", `${member.guild.name}`)
        .replace("{username}", `${member.user.username}`);

      await welcomeChannel.send({
        content: `${leaveMessage}`,
      });
    }
    const canvas = createCanvas(1100, 500);
    const ctx = canvas.getContext("2d");

    var background = await loadImage(process.env.BACKGROUND_URL);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    var avatar = await loadImage(
      member.user.displayAvatarURL({ format: "png", size: 512 })
    );
    ctx.drawImage(avatar, 50, -200, 512, 512);

    var attachment = new MessageAttachment(canvas.toBuffer(), "goodbye.png");

    var leaveMessage = Guild.leaveMessage
      .replace("{usertag}", `${member.user.tag}`)
      .replace("{userid}", `${member.user.id}`)
      .replace("{guild}", `${member.guild.name}`)
      .replace("{username}", `${member.user.username}`);

    await welcomeChannel.send({
      content: `${leaveMessage}`,
      files: [attachment],
    });
  },
};
