const { Message } = require("discord.js");
const ms = require("ms");
const Users = require("../schemas/userSchema");

module.exports = {
  name: "blacklist",
  description: "Blacklist a user from using the bot",
  usage: "{prefix}blacklist <id>",
  aliases: ["bl"],
  type: "Owner",
  cooldown: ms("5s"),
  testing: false,
  voteOnly: false,
  ownerOnly: true,
  nsfw: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var user = client.users.cache.get(args[0]);
    var id = args[0];
    if (!user)
      return await message.reply({
        content: "That's not a valid user of the bot!",
      });
    var User = await Users.findOne({ id });
    if (!User) {
      User = new Users({
        id,
        blacklisted: true,
      });
      User.save();
    } else {
      Users.findOneAndUpdate(
        {
          id,
        },
        {
          $set: {
            blacklisted: true,
          },
        }
      ).then((data) => data.save());
    }
    const blacklisted_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `✅ Successfully added **${user.username}** to the blacklist! ✅`
      )
      .setTimestamp();
    await message.reply({
      embeds: [blacklisted_embed],
    });
  },
};
