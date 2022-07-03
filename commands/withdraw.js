const Users = require("../schemas/userSchema");
const { Message, MessageEmbed } = require("discord.js");
const colors = require("../colors.json");
const ms = require("ms");

module.exports = {
  name: "withdraw",
  description: "Withdraw some money from your bank!",
  usage: "{prefix}withdraw <amount>",
  aliases: "wd, rmvbank, bankrmv",
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
        amount = User.bank;
      } else if (amount == "half") {
        amount = User.bank / 2;
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
        .setDescription("❌ You need to withdraw at least 1 token! ❌");
      return await message.reply({
        embeds: [too_low_embed],
      });
    }
    if (amount > User.bank) {
      const too_high_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Your bank account doesn't have that much! ❌");
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
          tokens: amount,
        },
        $set: {
          bank: User.bank - amount,
        },
      }
    ).then((data) => data.save());
    const withdrawn_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `Successfully withdrawed \`${amount}\` tokens from your bank!\n\n**You now have \`${
          User.bank - amount
        }\` tokens left in your bank account.**`
      );
    await message.reply({
      embeds: [withdrawn_embed],
    });
  },
};
