const { Message, Permissions, MessageEmbed } = require("discord.js");
const ms = require("ms");
const Log = require("../utils/logger");

module.exports = {
  name: "softban",
  description: "Softbans a user (bans then unbans them)",
  usage: "{prefix}softban <user> <days> [reason]",
  aliases: ["soft", "sb"],
  testing: true,
  type: "Moderation",
  userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
  clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
  ownerOnly: false,
  nsfw: false,
  voteOnly: false,
  cooldown: ms("5s"),
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
    if (!user || !member) {
      const invalidMemberEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please specify a valid member in this server. ❌");
      return await message.reply({
        embeds: [invalidMemberEmbed],
      });
    }
    if (user.id == message.author.id)
      return await message.reply({ content: "You can't softban yourself!" });
    if (user.id == client.user.id)
      return await message.reply({ content: "You can't softban the client!" });
    if (user.id == message.guild.ownerId)
      return await message.reply({
        content:
          "Who even gave you permission to softban the owner of this guild?",
      });
    var days = parseInt(args[1]);
    if (isNaN(days)) {
      const invalidArgumentEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Your second argument must be a number (it's also required)! ❌"
        );
      return await message.reply({
        embeds: [invalidArgumentEmbed],
      });
    } else if (days < 1 || days > 7) {
      const argumentOutOfRangeEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Your second argument is out of the range of 1 and 7! ❌"
        );
      return await message.reply({
        embeds: [argumentOutOfRangeEmbed],
      });
    }
    var reason = args.slice(2).join(" ") || "No reason provided!";
    if (!member.bannable)
      return await message.reply({ content: "I can't ban that member!" });
    member
      .ban({ days, reason })
      .then(async () => {
        await message.guild.bans.remove(user);
        const softbannedEmbed = new MessageEmbed()
          .setColor(colors.green)
          .setDescription(`Softbanned **${user.username}**!`)
          .setTimestamp();
        await message.reply({
          embeds: [softbannedEmbed],
        });
        Log(client, message.guild, Enum.Log.Softban, {
          moderator: message.member,
          reason,
          member,
        });
      })
      .catch(async (e) => {
        await message.reply({
          content: `Couldn't softban **${
            user.username
          }** due to the following reason: \`${`${e}`.slice(0, 2000)}\``,
        });
      });
  },
};
