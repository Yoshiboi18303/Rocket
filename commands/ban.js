const { Message, Permissions, MessageEmbed } = require("discord.js");
const Log = require("../utils/logger");

module.exports = {
  name: "ban",
  description: "Ban a member from this Discord server!",
  usage: "{prefix}ban <member mention | member id> [days] [reason]",
  aliases: ["hammer"],
  type: "Moderation",
  cooldown: ms("5s"),
  userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
  clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
  testing: true,
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
    var days = args[1] ? parseInt(args[1]) : 0;
    var reason = args.slice(2).join(" ") || "No reason provided!";
    if (!user) {
      const invalid_user_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ That's not a valid user of the bot! ❌");
      return await message.reply({
        embeds: [invalid_user_embed],
      });
    }
    if (isNaN(days))
      return await message.reply({ content: "That's not a number!" });
    if (days < 0 || days > 7)
      return await message.reply({
        content: "Please input a number between `0` and `7`!",
      });
    if (user.id == message.author.id)
      return await message.reply({ content: "You can't ban yourself!" });
    if (user.id == client.user.id)
      return await message.reply({ content: "You can't ban the client!" });
    if (user.id == message.guild.ownerId)
      return await message.reply({
        content: "You can't ban the owner of this server!",
      });
    if (!member) {
      return message.guild.bans
        .create(user, {
          deleteMessageDays: days,
          reason,
        })
        .then(async () => {
          const bannedEmbed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Ban Created")
            .setDescription(
              "I couldn't find that member in this guild, but I was able to still create a ban for that user."
            )
            .setTimestamp();
          return await message.reply({
            embeds: [bannedEmbed],
          });
        })
        .catch(async (e) => {
          return await message.reply({
            content: `I couldn't create a ban due to the following reason: \`${e}\``,
          });
        });
    }
    if (!member.bannable)
      return await message.reply({ content: "I can't ban that member!" });
    member
      .ban({ deleteMessageDays: days, reason })
      .then(async () => {
        const memberBannedEmbed = new MessageEmbed()
          .setColor(colors.green)
          .setDescription(
            `✅ **${user.username}** banned for reason \`${reason}\`! ✅`
          );
        var bannedMsg = await message.reply({
          embeds: [memberBannedEmbed],
        });
        Log(client, message.guild, Enum.Log.Ban, {
          moderator: message.member,
          member,
          reason,
        });
        const bannedEmbed = new MessageEmbed()
          .setColor(colors.orange)
          .setTitle("You were banned!")
          .setDescription(
            `‼️ You were banned from **${message.guild.name}** by **${message.author.tag}** (<@${message.author.id}>) for reason \`${reason}\`! ‼️`
          )
          .setFooter({
            text: "You shouldn't have been a bad person there.",
          })
          .setTimestamp(bannedMsg.createdTimestamp);
        user
          .send({
            embeds: [bannedEmbed],
          })
          .catch(() => {
            return;
          });
      })
      .catch(async (e) => {
        const banFailedEmbed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription(`An error occurred while trying to ban that member!`)
          .addField("Error", `${`${e}`.slice(0, 2000)}`, true)
          .setTimestamp();
        return await message.reply({
          embeds: [banFailedEmbed],
        });
      });
  },
};
