const Users = require("../schemas/userSchema");
const { returnUserStatusText } = require("../utils/");
const { utc } = require("moment");
const { GuildBan, Message } = require("discord.js");

const flags = {
  DISCORD_EMPLOYEE: "Discord Employee",
  DISCORD_PARTNER: "Discord Partner",
  BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
  BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
  HYPESQUAD_EVENTS: "HypeSquad Events",
  HOUSE_BRAVERY: "House of Bravery",
  HOUSE_BRILLIANCE: "House of Brilliance",
  HOUSE_BALANCE: "House of Balance",
  EARLY_SUPPORTER: "Early Supporter",
  TEAM_USER: "Team User",
  SYSTEM: "System",
  VERIFIED_BOT: "Verified Bot",
  EARLY_VERIFIED_BOT_DEVELOPER: "Verified Bot Developer",
};

module.exports = {
  name: "userinfo",
  description: "View info on a user (or yourself)!",
  aliases: ["ui", "user", "whois"],
  usage: "{prefix}userinfo [@user/user id]",
  type: "Information",
  cooldown: ms("5s"),
  testing: false,
  ownerOnly: false,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var user =
      message.mentions.users.first() ||
      message.client.users.cache.get(args[0]) ||
      message.author;
    var member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    var User = await Users.findOne({ id: user.id });
    if (!User) {
      User = new Users({
        id: user.id,
      });
      User.save();
    }
    var isAdmin = User.admin;
    var isOwner = User.owner;

    const returnStaffEmotes = (action) => {
      var final = "";
      switch (action) {
        case "admin":
          if (isAdmin) {
            final = `${emojis.admin} - **Admin**`;
          } else {
            final = "\u2800";
          }
          break;
        case "owner":
          if (isOwner) {
            final = `${emojis.owner} - **Owner**`;
          } else {
            final = "\u2800";
          }
          break;
      }
      return final;
    };

    const supportServer = message.client.guilds.cache.get("977632347862216764");
    const cachedBan = supportServer.bans.cache.get(user.id);
    let banExists = false;

    try {
      const ban = await supportServer.bans.fetch(user.id)
      banExists = true;
    } catch (e) { }

    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);
    var role_array = [];
    member.roles.cache.forEach((r) => {
      /*
      if(role_array.length < 15) {
        role_array.push(`<@&${r.id}>`)
      }
      */
      role_array.push(`<@&${r.id}>`);
    });
    role_array.splice(member.roles.cache.size - 1, 1);
    var t = `**❯ Roles (except everyone):**`;
    const userFlags = user.flags.toArray();
    var flagMap = userFlags?.map((flag) => flags[flag]) || null;
    const userArray = [
      `**❯ Username:** ${user.username}`,
      `**❯ Discriminator:** ${user.discriminator}`,
      `**❯ Tag:** ${user.tag}`,
      `**❯ ID:** ${user.id}`,
      `**❯ Is Bot?** ${user.bot ? "Yes" : "No"}`,
      `**❯ Is Blacklisted?** ${User.blacklisted ? "Yes" : "No"}`,
      `**❯ Flags:** ${flagMap != null
        ? flagMap.length == 1
          ? flagMap[0]
          : flagMap.join(", ")
        : "None"
      }`,
      `**❯ Time Created:** ${utc(user.createdTimestamp).format("LT")} - ${utc(
        user.createdTimestamp
      ).format("LL")} **|** ${utc(user.createdTimestamp).fromNow()}`,
      `**❯ Commands Used:** ${User.commandsUsed}`,
      `**❯ Global Warnings:** ${User.globalWarnings}`,
      `**❯ Is Banned from Support Server:** ${cachedBan ? "Yes" : banExists ? "Yes" : "No"}`,
      "\u200b",
    ];
    const memberArray = [
      `**❯ Nickname:** ${member.nickname != null ? member.nickname : "None"}`,
      `${t} ${role_array.length > 1
        ? role_array.length == 1
          ? role_array[0]
          : role_array.join(", ")
        : "None"
      }`,
      `**❯ Highest Role:** ${member.roles.highest.id === message.guild.id
        ? "None"
        : member.roles.highest.name
      }`,
      `**❯ Joined Server On:** ${utc(member.joinedAt).format(
        "LL - LTS"
      )} **|** ${utc(member.joinedAt).fromNow()}`,
      `**❯ Hoisted Role:** ${member.roles.hoist ? member.roles.hoist.name : "No hoisted role"
      }`,
      `**❯ Status:** ${member.presence != null
        ? returnUserStatusText(member)
        : `${emojis.offline} **-** Offline`
      }`,
      "\u200b",
    ];
    var acksArray = [
      `${returnStaffEmotes("admin")}`,
      `${returnStaffEmotes("owner")}`,
    ];
    const userInfoEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle(`User Info for \`${user.username}\``)
      .addField("User", `${userArray.join("\n")}`)
      .addField("Member", `${memberArray.join("\n")}`)
      .addField(
        "Acknowledgements",
        `${acksArray[0] != "\u2800" || acksArray[1] != "\u2800"
          ? acksArray.join("\n")
          : "None"
        }`
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }));
    await message.reply({
      embeds: [userInfoEmbed],
    });
  },
};
