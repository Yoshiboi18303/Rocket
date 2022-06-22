const {
  Message,
  MessageActionRow,
  MessageButton,
  Permissions,
} = require("discord.js");
const Log = require("../utils/logger");

module.exports = {
  name: "kick",
  description: "Kick a member from this Discord server!",
  usage: "{prefix}kick <member mention | member id> [reason]",
  aliases: ["remove"],
  type: "Moderation",
  cooldown: ms("5s"),
  userPermissions: [Permissions.FLAGS.KICK_MEMBERS],
  clientPermissions: [Permissions.FLAGS.KICK_MEMBERS],
  testing: false,
  ownerOnly: false,
  nsfw: false,
  voteOnly: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var user =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    var member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    var reason = args.slice(1).join(" ") || "No reason provided!";
    if (!user || !member) {
      const invalid_user_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ That's not a valid user in this server! ❌");
      return await message.reply({
        embeds: [invalid_user_embed],
      });
    }
    if (user.id == message.author.id)
      return await message.reply({ content: "You can't kick yourself!" });
    if (user.id == client.user.id)
      return await message.reply({ content: "You can't kick the client!" });
    if (user.id == message.guild.ownerId)
      return await message.reply({
        content: "You can't kick the owner of this server!",
      });
    if (!member.kickable)
      return await message.reply({ content: "I can't kick that member!" });
    member
      .kick(reason)
      .then(async () => {
        const memberKickedEmbed = new MessageEmbed()
          .setColor(colors.green)
          .setDescription(
            `✅ **${user.username}** kicked for reason \`${reason}\`! ✅`
          );
        var kickedMsg = await message.reply({
          embeds: [memberKickedEmbed],
        });
        Log(client, message.guild, Enum.Log.Kick, {
          moderator: message.member,
          member,
          reason,
        });
        const kickedEmbed = new MessageEmbed()
          .setColor(colors.orange)
          .setTitle("You were kicked!")
          .setDescription(
            `❗ You were kicked from **${message.guild.name}** by **${message.author.tag}** (<@${message.author.id}>) for reason \`${reason}\`! ❗`
          )
          .setFooter({
            text: "Maybe be nicer in that server next time.",
          })
          .setTimestamp(kickedMsg.createdTimestamp);
        user
          .send({
            embeds: [kickedEmbed],
          })
          .catch(() => {
            return;
          });
      })
      .catch(async (e) => {
        const kickFailedEmbed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription(`An error occurred while trying to kick that member!`)
          .addField("Error", `${e.slice(0, 2000)}`, true)
          .setTimestamp();
        return await message.reply({
          embeds: [kickFailedEmbed],
        });
      });
  },
};
