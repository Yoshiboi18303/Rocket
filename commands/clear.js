const { Message, Permissions } = require("discord.js");
const Log = require("../utils/logger");

module.exports = {
  name: "clear",
  description: "Clear some messages from the current channel!",
  usage: "{prefix}clear <message amount>",
  aliases: ["purge"],
  type: "Moderation",
  cooldown: ms("5s"),
  testing: false,
  voteOnly: false,
  ownerOnly: false,
  nsfw: false,
  userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  clientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var amount = parseInt(args[0]);
    if (isNaN(amount)) {
      const nanEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ That's not a number! ❌");
      return await message.reply({
        embeds: [nanEmbed],
      });
    }
    if (amount <= 0 || amount > 100) {
      const invalidAmountEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          `❌ ${
            amount <= 0
              ? "You need to purge at least 1 message!"
              : "You can't purge more than 100 messages at a time!"
          } ❌`
        );
      return await message.reply({
        embeds: [invalidAmountEmbed],
      });
    }
    message.channel.bulkDelete(amount, true).then(async () => {
      const purgedEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setDescription(
          `✅ Purged ${amount} messages from <#${message.channel.id}>! ✅`
        )
        .setTimestamp();
      await message.channel.send({
        embeds: [purgedEmbed],
      });
      Log(client, message.guild, Enum.Log.Purge, {
        moderator: message.member,
        channel: message.channel,
        messages: amount,
      });
    });
  },
};
