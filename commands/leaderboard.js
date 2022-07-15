const Users = require("../schemas/userSchema");
const { Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "leaderboard",
  description:
    "View a leaderboard of some of the richest people in your server!",
  usage: "{prefix}leaderboard [--global] [type]",
  aliases: "lb",
  type: "Economy",
  cooldown: ms("5s"),
  testing: false,
  ownerOnly: false,
  voteOnly: false,
  nsfw: false,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var wantsGlobal = args.includes("--global");
    if (wantsGlobal) {
      args.splice(
        args.findIndex((arg) => arg == "--global"),
        1
      );
    }
    var type = args[0]?.toLowerCase() || "tokens";
    var guild = message.guild;
    var BotUsers = await Users.find({});

    if (!wantsGlobal) {
      BotUsers = BotUsers.filter((u) => guild.members.cache.has(u.id));
    }

    if (wantsGlobal) {
      guild = {
        name: "Global",
      };
    }

    var lbTypes = ["tokens", "bank", "stolen", "bets"];

    if (type == "types") {
      var array = [];
      lbTypes.forEach((type, index) => {
        var currentItem = index + 1;

        if (currentItem == lbTypes.length && lbTypes.length > 1) {
          array.push(`and \`${type}\``);
        } else {
          array.push(`\`${type}\``);
        }
      });
      const leaderboardTypesEmbed = new MessageEmbed()
        .setColor(colors.cyan)
        .setTitle("Leaderboard Types")
        .setDescription(
          `These are all the current leaderboard types.\n\n${array.join(", ")}`
        );
      return await message.reply({
        embeds: [leaderboardTypesEmbed],
      });
    }

    if (!lbTypes.includes(type)) {
      const invalid_type_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's not a valid leaderboard type! The valid types are `tokens`, `bank` `stolen` and `bets`! ❌"
        );
      return await message.reply({
        embeds: [invalid_type_embed],
      });
    }

    switch (type) {
      case "tokens":
        var array = [];

        for (var user of BotUsers) {
          var object = {
            user: user.id,
            tokens: user.tokens,
          };
          array.push(object);
        }

        array.sort((a, b) => b.tokens - a.tokens);

        var final = array.map(
          (item, index) =>
            `\`${index + 1}\` - **${
              item.user == message.author.id
                ? `${client.users.cache.get(item.user).username} \`(You)\``
                : client.users.cache.get(item.user).username
            }:** \`${item.tokens} tokens\``
        );

        const embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`\`${guild.name}\` Token Leaderboard`)
          .setDescription(`${final.join("\n")}`);
        await message.reply({
          embeds: [embed],
        });
        break;
      case "bank":
        var users = [];

        for (var User of BotUsers) {
          var object = {
            user: User.id,
            bank: User.bank,
          };
          users.push(object);
        }

        users.sort((a, b) => b.bank - a.bank);

        var final = users.map(
          (item, index) =>
            `\`${index + 1}\` - **${
              item.user == message.author.id
                ? `${client.users.cache.get(item.user).username} \`(You)\``
                : client.users.cache.get(item.user).username
            }:** \`${item.bank} ${
              item.bank == 1 ? "token" : "tokens"
            } in their bank\``
        );

        const bankLeaderboardEmbed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`\`${guild.name}\` Bank Leaderboard`)
          .setDescription(`${final.join("\n")}`);
        await message.reply({
          embeds: [bankLeaderboardEmbed],
        });
        break;
      case "stolen":
        var StolenFromSelfArray = [];
        var StolenFromOthersArray = [];

        for (var User of BotUsers) {
          var fromSelfObject = {
            user: User.id,
            stolenFromSelf: User.stolen.fromSelf,
          };
          var fromOthersObject = {
            user: User.id,
            stolenFromOthers: User.stolen.fromOthers,
          };

          StolenFromSelfArray.push(fromSelfObject);
          StolenFromOthersArray.push(fromOthersObject);
        }

        StolenFromSelfArray.sort((a, b) => b.stolenFromSelf - a.stolenFromSelf);
        StolenFromOthersArray.sort(
          (a, b) => b.stolenFromOthers - a.stolenFromOthers
        );

        var StolenFromSelfFinal = StolenFromSelfArray.map(
          (v, i) =>
            `\`${i + 1}\` - **${
              v.user == message.author.id
                ? `${client.users.cache.get(v.user).username} \`(You)\``
                : client.users.cache.get(v.user).username
            }:** ${v.stolenFromSelf} Tokens`
        );
        var StolenFromOthersFinal = StolenFromOthersArray.map(
          (v, i) =>
            `\`${i + 1}\` - **${
              v.user == message.author.id
                ? `${client.users.cache.get(v.user).username} \`(You)\``
                : client.users.cache.get(v.user).username
            }:** ${v.stolenFromOthers} Tokens`
        );

        const stolenFromLB = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`\`${guild.name}\` Stolen Leaderboard`)
          .addFields([
            {
              name: "Stolen From Self",
              value: `${StolenFromSelfFinal.join("\n")}`,
              inline: true,
            },
            {
              name: "Stolen From Others",
              value: `${StolenFromOthersFinal.join("\n")}`,
              inline: true,
            },
          ]);
        await message.reply({
          embeds: [stolenFromLB],
        });
        break;
      case "bets":
        var HighestBetsArray = [];

        for (var User of BotUsers) {
          var ob = {
            user: User.id,
            highestBet: User.highestBet,
          };

          HighestBetsArray.push(ob);
        }

        HighestBetsArray.sort((a, b) => b.highestBet - a.highestBet);

        var HighestBetsFinal = HighestBetsArray.map(
          (v, i) =>
            `\`${i + 1}\` - **${
              v.user == message.author.id
                ? `${client.users.cache.get(v.user).username} \`(You)\``
                : client.users.cache.get(v.user).username
            }:** ${v.highestBet} Tokens`
        );

        const em = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`\`${message.guild.name}\` Highest Bets`)
          .setDescription(`${HighestBetsFinal.join("\n")}`);
        await message.reply({
          embeds: [em],
        });
        break;
    }
  },
};
