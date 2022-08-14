const Users = require("../schemas/userSchema");
const { Message, MessageEmbed } = require("discord.js");
const colors = require("../colors.json");
const ms = require("ms");

module.exports = {
  name: "deposit",
  description: "Deposit some money into your bank!",
  usage: "{prefix}deposit <amount>",
  aliases: "dep, bankadd, addbank, dp",
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
    var amount = parseInt(args[0]);
    var User = await Users.findOne({ id: message.author.id });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
    }
    if (isNaN(amount)) {
      var amount = args[0];
      if (amount == "max" || amount == "maximum" || amount == "all") {
        amount = User.tokens;
      } else if (amount == "half") {
        amount = User.tokens / 2;
      } else {
        const invalid_argument_embed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            "❌ That's not a valid argument (you can use `max`, `maximum`, `all` or `half` as text arguments instead of a number argument)! ❌"
          );
        return await message.reply({
          embeds: [invalid_argument_embed],
        });
      }
    }
    if (!(amount instanceof Number)) amount = Math.round(amount);
    if (amount <= 0) {
      const too_low_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You need to deposit at least 1 token! ❌");
      return await message.reply({
        embeds: [too_low_embed],
      });
    }
    if (amount > User.tokens) {
      const too_high_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You're depositing more than you already have! ❌");
      return await message.reply({
        embeds: [too_high_embed],
      });
    }
    Users.findOneAndUpdate(
      {
        id: message.author.id,
      },
      {
        $inc: {
          bank: amount,
        },
        $set: {
          tokens: User.tokens - amount,
        },
      }
    ).then((data) => data.save());
    const deposited_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `Successfully deposited \`${amount}\` tokens into your bank!\n\n**You now have \`${
          User.tokens - amount
        }\` tokens left.**`
      );
    await message.reply({
      embeds: [deposited_embed],
    });
  },
};
