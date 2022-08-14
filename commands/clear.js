const { Message, Permissions, User } = require("discord.js");
const Log = require("../utils/logger");

module.exports = {
  name: "clear",
  description: "Clear some messages from the current channel!",
  usage: "{prefix}clear <message amount> [user mention | user id]",
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
    var id = message.mentions.users.first() || args[1];
    if (id instanceof User) id = id.id;
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
    if (!id) {
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
    } else {
      if (!message.guild.members.cache.has(id))
        return await message.reply({
          content: "That's not a valid member in this guild!",
        });
      var messagesToDelete = [];
      var messagesLookedAt = 0;
      var fetched = await message.channel.messages.fetch();
      var limit = Date.now() - ms("2w");
      fetched.forEach((msg) => {
        if (
          messagesToDelete.length >= amount ||
          messagesLookedAt == fetched.size
        )
          return;
        if (msg.createdTimestamp >= limit) {
          if (msg.author.id == id) {
            messagesToDelete.push(msg);
          }
        }
        messagesLookedAt++;
      });
      var deletedLength = messagesToDelete.length;
      if (deletedLength <= 0)
        return await message.reply({ content: "No messages were found." });
      messagesToDelete[0].delete();
      messagesToDelete.shift();
      const deleting_embed = new MessageEmbed()
        .setColor(colors.yellow)
        .setTitle("Please Wait...")
        .setDescription(
          `Deleting \`${deletedLength}\` (fetched) messages from \`${
            client.users.cache.get(id)?.tag
          }\` between 2 second intervals...`
        );
      var m = await message.channel.send({
        embeds: [deleting_embed],
      });
      setInterval(async () => {
        if (messagesToDelete.length <= 0) {
          const purged_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Completed")
            .setDescription(
              `Purged \`${deletedLength}\` messages from \`${
                client.users.cache.get(id)?.tag
              }\` in <#${message.channel.id}>`
            );
          return await m.edit({
            embeds: [purged_embed],
          });
        }
        messagesToDelete[0].delete();
        messagesToDelete.shift();
      }, 2000);
    }
  },
};
