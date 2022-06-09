const Warnings = require("../schemas/warningSchema");
const Users = require("../schemas/userSchema");
const Guilds = require("../schemas/guildSchema");
const { Permissions, Message } = require("discord.js");
const { convertToUpperCase } = require("../utils/");
const wait = require("util").promisify(setTimeout);
const Log = require("../utils/logger");

module.exports = {
  name: "warn",
  description: "Warn someone!",
  aliases: [],
  usage: "{prefix}warn <@user | userid> <severity> [reason]",
  type: "Moderation",
  userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  clientPermissions: [],
  testing: false,
  ownerOnly: false,
  nsfw: false,
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
    var severity = args[1] ? convertToUpperCase(args[1]) : undefined;
    var reason = args.slice(2).join(" ") || "No reason provided!";
    if (!user) {
      const no_user_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a user to warn! ❌");
      return await message.reply({
        embeds: [no_user_embed],
      });
    }
    if (!["LOW", "MEDIUM", "HIGH"].includes(severity)) {
      const invalid_severity_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's an invalid severity option! ❌\n\n**ℹ️ Valid options include: `LOW`, `MEDIUM` and `HIGH` (it can be lower case or randomly capitalized).** ℹ️"
        );
      return await message.reply({
        embeds: [invalid_severity_embed],
      });
    }
    if (user.id == message.author.id) {
      const cant_warn_self_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You can't warn yourself! ❌");
      return await message.reply({
        embeds: [cant_warn_self_embed],
      });
    }
    if (user.id == client.user.id) {
      const cant_warn_client_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You can't warn the client! ❌");
      return await message.reply({
        embeds: [cant_warn_client_embed],
      });
    }
    var User = await Users.findOne({ id: user.id });
    if (!User) {
      User = new Users({
        id: user.id,
      });
      User.save();
    }
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var warningData = await Warnings.findOne({
      user: user.id,
      guild: message.guild.id,
    });
    if (!warningData) {
      warningData = new Warnings({
        user: user.id,
        guild: message.guild.id,
        context: [
          {
            moderator: message.author.id,
            reason,
            severity,
          },
        ],
      });
      var warnRole1 = message.guild.roles.cache.get(Guild.warnRoles.warn1);
      if (warnRole1) {
        if (message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
          if (
            message.guild.roles.comparePositions(
              message.guild.roles.botRoleFor(client.user),
              warnRole1
            ) > 0
          ) {
            member.roles.add(warnRole1).catch(() => {
              return;
            });
          }
        }
      }
    } else {
      const nextWarningData = {
        moderator: message.author.id,
        reason,
        severity,
      };
      warningData.context.push(nextWarningData);
      var currentWarningNumber = warningData.context.length;
      switch (currentWarningNumber) {
        case 2:
          var warnRole2 = message.guild.roles.cache.get(Guild.warnRoles.warn2);
          if (!warnRole2) break;
          if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
            break;
          if (
            message.guild.roles.comparePositions(
              message.guild.roles.botRoleFor(client.user),
              warnRole2
            ) <= 0
          )
            break;
          member.roles.add(warnRole2).catch(() => {
            return;
          });
          break;
        case 3:
          var warnRole3 = message.guild.roles.cache.get(Guild.warnRoles.warn2);
          if (!warnRole3) break;
          if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
            break;
          if (
            message.guild.roles.comparePositions(
              message.guild.roles.botRoleFor(client.user),
              warnRole3
            ) <= 0
          )
            break;
          member.roles.add(warnRole3).catch(() => {
            return;
          });
          break;
      }
    }
    warningData.save();
    var newUserData = await Users.findOneAndUpdate(
      {
        id: user.id,
      },
      {
        $inc: {
          globalWarnings: 1,
        },
      }
    );
    newUserData.save();
    const doneEmbed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `✅ **${
          user.tag
        }** successfully warned for reason \`${reason}\` with \`${severity}\` severity! ✅\n\n**ℹ️ This user now has \`${
          User.globalWarnings + 1
        }\` ${
          User.globalWarnings + 1 == 1 ? "warning" : "warnings"
        } on the bot altogether. ℹ️**`
      );
    await message.reply({
      embeds: [doneEmbed],
    });
    if (!user.bot) {
      var extraText =
        User.globalWarnings + 1 >= 5
          ? `‼️ This is warning number \`${
              User.globalWarnings + 1
            }\` on this bot, you might be subject to a blacklist from the bot! ‼️`
          : `❗ This is warning number \`${
              User.globalWarnings + 1
            }\` on this bot, you might be subject to a blacklist from the bot if this continues! ❗`;
      user
        .send({
          content: `⚠️ You were warned in **${message.guild.name}** by **${message.author.tag}** with the provided reason: \`${reason}\` ⚠️\n\n**${extraText}**`,
        })
        .catch(() => {
          return;
        });
    }
    Log(client, message.guild, Enum.Log.Warn, {
      moderator: message.member,
      member,
      reason,
    });
  },
};
