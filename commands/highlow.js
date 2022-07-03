const Users = require("../schemas/userSchema");
const {
  ButtonInteraction,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "highlow",
  description:
    "Guess whether a number is higher or lower, if you're right, you'll earn some money!",
  usage: "{prefix}highlow [optional bet]",
  cooldown: ms("45s"),
  type: "Economy",
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  nsfw: false,
  ownerOnly: false,
  aliases: "hl, hlbet",
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var bet = parseInt(args[0]);
    var number = Math.floor(Math.random() * 101);
    if (number <= 0) number = 1;
    var hint = Math.floor(Math.random() * 101 - Math.random());
    if (hint <= 0) hint = Math.floor(Math.random() * 101 - Math.random());
    var User = await Users.findOne({
      id: message.author.id,
    });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
    }
    var minimumAmount = 100;
    if (isNaN(bet)) {
      bet = args[0];
      // console.log(bet);
      if (bet == "max" || bet == "maximum" || bet == "all") {
        bet = User.tokens;
      } else if (bet == "half") {
        bet = User.tokens / 2;
      } else if (bet == "min" || bet == "minimum") {
        bet = minimumAmount;
      } else {
        bet = null;
      }
    }
    if (bet != null) {
      if (bet < minimumAmount) {
        const too_low_embed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription("❌ You need to bet at least 100 tokens! ❌");
        return await message.reply({
          embeds: [too_low_embed],
        });
      } else if (bet > User.tokens) {
        const too_high_embed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription("❌ You're betting more than you have! ❌");
        return await message.reply({
          embeds: [too_high_embed],
        });
      }
    }
    if (bet > User.highestBet)
      Users.findOneAndUpdate(
        { id: message.author.id },
        { $set: { highestBet: bet } }
      ).then((data) => data.save());
    var hasVoted = User.voted;
    var earnedMoney =
      bet != null
        ? hasVoted
          ? bet * 3
          : bet * 2
        : hasVoted
        ? Math.floor(Math.random() * 425) * 2
        : Math.floor(Math.random() * 425);
    const highLowGameEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setAuthor({
        name: `${message.author.username}`,
        iconURL: `${message.author.displayAvatarURL({ format: "png" })}`,
      })
      .setDescription(
        `Time to play!\n\n**Is the number I'm thinking of higher or lower than \`${hint}\`?**`
      )
      .setFooter({
        text: "Same button if you think it's the same.",
      })
      .setTimestamp();
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Lower")
        .setCustomId("lower"),
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Same")
        .setCustomId("same"),
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Higher")
        .setCustomId("higher")
    );

    var msg = await message.reply({
      embeds: [highLowGameEmbed],
      components: [row],
    });

    /**
     * @param {ButtonInteraction} btnInt
     */
    const filter = async (btnInt) => {
      if (btnInt.user.id != message.author.id)
        return await btnInt.reply({
          content: "This isn't yours!",
          ephemeral: true,
        });
      return true;
    };

    var collector = msg.createMessageComponentCollector({
      filter,
      max: 1,
    });

    collector.on("end", async (collected) => {
      var interaction = collected.first();

      const correctEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("Correct!")
        .setDescription(
          `That was correct!\n\n**You have earned ${earnedMoney} tokens!**`
        );

      if (bet != null && !User.voted) {
        correctEmbed.setFooter({
          text: "Did you know that voting for this bot and running this command with a bet allows you to get triple your bet? Now you do!",
        });
      } else if (bet == null && !User.voted) {
        correctEmbed.setFooter({
          text: "Did you know that voting for this bot and running this command without betting anything allows you to get double the amount of money you'd normally get? Now you do!",
        });
      } else if (User.voted) {
        if (bet != null) {
          correctEmbed.setFooter({
            text: `Thanks for voting for ${client.user.username}, you've earned triple your bet!`,
          });
        } else {
          correctEmbed.setFooter({
            text: `Thanks for voting for ${client.user.username}, you've earned double the normal amount of cash!`,
          });
        }
      }

      const wrongEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("Incorrect!")
        .setDescription(
          `That wasn't quite right, you'll get it next time (The number was **\`${number}\`**)!${
            bet != null
              ? `\n\n**You did however lose your bet of ${bet} tokens, but that's nothing for you!**`
              : ""
          }`
        );

      for (var component of row.components) {
        if (component.customId == interaction.customId) {
          if (interaction.customId == "lower") {
            if (number < hint) component.setStyle("SUCCESS");
            else component.setStyle("DANGER");
          } else if (interaction.customId == "same") {
            if (number == hint) component.setStyle("SUCCESS");
            else component.setStyle("DANGER");
          } else {
            if (number > hint) component.setStyle("SUCCESS");
            else component.setStyle("DANGER");
          }
        } else {
          component.setStyle("SECONDARY");
        }
        component.setDisabled(true);
      }

      if (interaction.customId == "lower") {
        if (number < hint) {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $inc: {
                tokens: earnedMoney,
              },
            }
          ).then((data) => data.save());
          await interaction.update({
            embeds: [correctEmbed],
            components: [row],
          });
        } else {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $set: {
                tokens: User.tokens - bet,
              },
            }
          ).then((data) => data.save());
          await interaction.update({
            embeds: [wrongEmbed],
            components: [row],
          });
        }
      } else if (interaction.customId == "same") {
        if (number == hint) {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $inc: {
                tokens: earnedMoney,
              },
            }
          ).then((data) => data.save());
          await interaction.update({
            embeds: [correctEmbed],
            components: [row],
          });
        } else {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $set: {
                tokens: User.tokens - bet,
              },
            }
          ).then((data) => data.save());
          await interaction.update({
            embeds: [wrongEmbed],
            components: [row],
          });
        }
      } else {
        if (number > hint) {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $inc: {
                tokens: earnedMoney,
              },
            }
          ).then((data) => data.save());
          await interaction.update({
            embeds: [correctEmbed],
            components: [row],
          });
        } else {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $set: {
                tokens: User.tokens - bet,
              },
            }
          ).then((data) => data.save());
          await interaction.update({
            embeds: [wrongEmbed],
            components: [row],
          });
        }
      }
    });
  },
};
