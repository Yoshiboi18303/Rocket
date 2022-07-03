const { Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "massban",
  description: "Bans every ID that you insert",
  usage: "{prefix}massban <ids (separated by spaces)>",
  type: "Moderation",
  cooldown: ms("10s"),
  userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
  clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
  testing: true,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var membersSuccessfullyBanned = 0;
    var errors = [];
    var arguments = args;
    arguments.shift();
    if (args.length <= 0)
      return await message.reply({
        content: "Please define at least one ID of a user in this server!",
      });
    setInterval(async () => {
      var arg = args.shift();
      if (arg) {
        var oldLength = errors.length;
        await message.guild.bans
          .create(arg, {
            reason: "Requested to be hit in the massban",
          })
          .catch((e) => errors.push(`${e}`));
        if (errors.length == oldLength + 1) membersSuccessfullyBanned++;
      }
    }, 1000);
    var timeout = 1000;
    arguments.forEach(() => (timeout = timeout + 1000));
    setTimeout(async () => {
      console.log(membersSuccessfullyBanned, errors);
      const doneEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("Massban Finished")
        .setDescription(`I have finished massbanning, here are the results!`)
        .addField(`Members Banned`, `${membersSuccessfullyBanned}`, true)
        .addField(
          `Errors Encountered`,
          `\`${errors.length > 0 ? errors.join(", ") : "None"}\``,
          true
        );

      await message.reply({
        embeds: [doneEmbed],
      });
    }, timeout);
  },
};
