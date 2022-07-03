const Guilds = require("../schemas/guildSchema");
const Users = require("../schemas/userSchema");
const {
  Interaction,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");
const fs = require("fs/promises");
const shell = require("shelljs");
const moment = require("moment");

module.exports = {
  name: "fight",
  description: "Fight someone for money!",
  usage: "{prefix}fight <@user | user id> <bet>",
  type: "Economy",
  cooldown: ms("2m") + ms("30s"),
  aliases: "battle",
  userPermissions: [],
  clientPermissions: [],
  testing: true,
  ownerOnly: false,
  nsfw: false,
  voteOnly: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var challengedUser =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    var challengedMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!challengedUser || !challengedMember) {
      const invalid_user_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Please mention or give me the ID of someone in this guild! ❌"
        );
      return await message.reply({
        embeds: [invalid_user_embed],
      });
    }
    if (challengedUser.bot) {
      const userIsBotEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ I'm sorry, but bots cannot be fought (you'd break your hand trying to punch them anyway). ❌"
        );
      return await message.reply({
        embeds: [userIsBotEmbed],
      });
    }
    var challengingUserBet = parseInt(args[1]);
    if (isNaN(challengingUserBet)) {
      const invalid_bet_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's not a number, please give me a number as your second argument! ❌"
        );
      return await message.reply({
        embeds: [invalid_bet_embed],
      });
    }
    if (challengingUserBet < 200 || challengingUserBet > 1000) {
      const bad_bet_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Your bet has to be between 200 and 1000 coins! ❌");
      return await message.reply({
        embeds: [bad_bet_embed],
      });
    }
    var EndUser = await Users.findOne({
      id: message.author.id,
    });
    if (!EndUser) {
      EndUser = new Users({
        id: message.author.id,
      });
      EndUser.save();
    }
    var ChallengedUser = await Users.findOne({
      id: challengedUser.id,
    });
    if (!ChallengedUser) {
      ChallengedUser = new Users({
        id: challengedUser.id,
      });
      ChallengedUser.save();
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
    if (challengingUserBet > EndUser.tokens) {
      const tooHighEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You're betting more than you already have! ❌");
      return await message.reply({
        embeds: [tooHighEmbed],
      });
    }
    const agreementEmbed = new MessageEmbed()
      .setColor(colors.orange)
      .setTitle("A Challenger Appears!")
      .setDescription(
        `**${message.author.tag}** wants to challenge you to a fight, do you accept?`
      )
      .setFooter({
        text: "Click the no button or wait 45 seconds for this to expire.",
      });
    var row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SUCCESS")
        .setLabel("Yes")
        .setCustomId("fight-agree")
        .setEmoji("✅"),
      new MessageButton()
        .setStyle("SECONDARY")
        .setLabel("No")
        .setCustomId("fight-deny")
        .setEmoji("❌")
    );
    var challengeAgreementMessage = await message.channel.send({
      content: `<@${challengedUser.id}>`,
      embeds: [agreementEmbed],
      components: [row],
    });
    /**
     * @param {Interaction} interaction
     */
    var filter = async (interaction) => {
      if (interaction.user.id != challengedUser.id)
        return await interaction.reply({
          content: "This isn't yours!",
          ephemeral: true,
        });
      return true;
    };
    var collector = challengeAgreementMessage.createMessageComponentCollector({
      filter,
      time: ms("45s"),
      max: 1,
    });
    collector.on("end", async (collected) => {
      var first = collected.first();
      for (var component of row.components) {
        component.setDisabled(true);
      }
      if (!first || first?.customId == "fight-deny") {
        agreementEmbed.title = "Hmm...";
        agreementEmbed.color = colors.dred;
        agreementEmbed.description = "This agreement ended in a denial.";
        agreementEmbed.footer = null;
        return await challengeAgreementMessage.edit({
          components: [row],
          embeds: [agreementEmbed],
        });
      } else {
        await challengeAgreementMessage.edit({
          components: [row],
        });
        await first.reply({
          content:
            "Before we begin, I want for you to enter how much money you want to bet on this fight.\n\n**Please enter how much you want to bet now.**",
        });
        /**
         * @param {Message} m
         */
        var betFilter = async (m) => {
          if (m.author.bot) return;
          if (m.author.id != challengedUser.id)
            return await m.reply({ content: "This isn't yours!" });
          if (isNaN(parseInt(m.content.trim().split(/ +/g)[0])))
            return await m.reply({ content: "Please enter a number!" });
          if (
            parseInt(m.content.trim().split(/ +/g)) < 200 ||
            parseInt(m.content.trim().split(/ +/g)) > 1000
          )
            return await m.reply({
              content:
                "Your bet is out of the betting range (minimum 200 and maximum 1000)",
            });
          return true;
        };
        var betCollector = message.channel.createMessageCollector({
          filter: betFilter,
        });
        const generateFightID = () => {
          var idLetters = "abcdefghijklmnopqrstuvwxyz";
          idLetters += idLetters.toUpperCase();
          idLetters += "-1234567890_.";
          var i = 0;
          var id = "";

          while (i < 12) {
            id += idLetters[Math.floor(Math.random() * idLetters.length)];
            i++;
          }

          return id;
        };

        /**
         * Checks if a fight ID is taken or not.
         * @param {String} id
         * @returns `true` if `id` is taken or `false` if not
         */
        const checkFightID = (id) => {
          var check = Guild.fights.find((f) => f.id == id);
          if (!check) return false;
          else return true;
        };

        var validID = "";

        var interval = setTimeout(() => {
          var secretID = generateFightID();
          if (checkFightID(secretID) == true) {
            secretID = generateFightID();
            clearTimeout(interval);
          } else {
            validID = secretID;
          }
        });

        console.log(validID);

        betCollector.on("collect", async (first) => {
          var bet = parseInt(first.content.trim().split(/ +/g)[0]);
          if (first.author.bot || isNaN(bet) || bet < 200 || bet > 1000) return;
          var object = {
            challengingUser: message.author.id,
            challengedUser: challengedUser.id,
            challengingUserBet,
            challengedUserBet: bet,
            playing: message.author.id,
            id: generateFightID(),
          };
          fs.appendFile(
            `fights/${message.guild.id}/${object.id}.txt`,
            `This fight was started at ${moment(first.createdTimestamp).format(
              "HH:MM:SS"
            )} on ${moment(first.createdTimestamp).format("MM/DD/YYYY")}\n`
          )
            .then(() => console.log("File created!"))
            .catch(() => {
              shell.exec(`cd fights && mkdir ${message.guild.id}`);
              fs.appendFile(
                `fights/${message.guild.id}/${object.id}.txt`,
                `This fight was started at ${moment(
                  first.createdTimestamp
                ).format("HH:MM:SS")} on ${moment(
                  first.createdTimestamp
                ).format("MM/DD/YYYY")}\n`
              );
            });
          var emptyString = "\u2800";
          await challengeAgreementMessage.delete();
          const fightEmbed = new MessageEmbed()
            .setColor(colors.cyan)
            .setTitle("Fighting Time!")
            .setDescription(
              `We're ready to start, let's begin!\n\n${emptyString}**${message.author.username}**${emptyString}${emptyString}${challengedUser.username}\n${emptyString}**HP:** 100/100${emptyString}${emptyString}${emptyString}**HP:** 100/100`
            );
          const fightActionsRow = new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("PRIMARY")
              .setLabel("Shoot")
              .setCustomId("fight-attack"),
            new MessageButton()
              .setStyle("SUCCESS")
              .setLabel("Heal")
              .setCustomId("fight-heal"),
            new MessageButton()
              .setStyle("PRIMARY")
              .setLabel("Reload")
              .setCustomId("fight-reload"),
            new MessageButton()
              .setStyle("DANGER")
              .setLabel("Forfeit")
              .setCustomId("fight-quit")
          );
          betCollector.stop();
          Guilds.findOneAndUpdate(
            {
              id: message.guild.id,
            },
            {
              $push: {
                fights: object,
              },
              $inc: {
                fightsStarted: 1,
              },
            }
          ).then((data) => data.save());
          await first.reply({
            content: `<@${object.playing}>, Time for you to make your move!`,
            embeds: [fightEmbed],
            components: [fightActionsRow],
          });
        });
      }
    });
  },
};
