const ms = require("ms");
const Users = require("../schemas/userSchema");
const {
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const colors = require("../colors.json");

module.exports = {
  name: "blackjack",
  description: "Play blackjack against the bot!",
  usage: "{prefix}blackjack <bet>",
  aliases: ["bj"],
  cooldown: ms("10s"),
  userPermissions: [],
  clientPermissions: [],
  type: "Economy",
  testing: true,
  ownerOnly: false,
  voteOnly: false,
  nsfw: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var bet = parseInt(args[0]);
    if (isNaN(bet)) {
      const bad_bet_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ That's not a number! ❌");
      return await message.reply({
        embeds: [bad_bet_embed],
      });
    }
    if (bet < 250) {
      const too_low_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You have to bet at least 250 coins! ❌");
      return await message.reply({
        embeds: [too_low_embed],
      });
    }
    var User = await Users.findOne({ id: message.author.id });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
    }
    if (bet > User.tokens) {
      const too_high_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You're betting more than you have! ❌");
      return await message.reply({
        embeds: [too_high_embed],
      });
    }
    await message.reply({
      content: "Stuff works so far!",
    });
  },
};
