const { Message } = require("discord.js");
const Users = require("../schemas/userSchema");

module.exports = {
  name: "vote",
  description: "View some links with places to vote for the bot!",
  usage: "{prefix}vote",
  aliases: [],
  type: "Other",
  testing: false,
  ownerOnly: false,
  userPermissions: [],
  clientPermissions: [],
  nsfw: false,
  voteOnly: false,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var User = Users.findOne({ id: message.author.id });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
    }
    var voted = User.voted;
    const voteLinksEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle(`Vote for ${client.user.username}`)
      .setDescription(
        `Here are some links for you to be able to vote for me!\n\n**Vote Status:** **\`${
          voted
            ? "You have voted within the last 24 hours!"
            : "You haven't voted yet!"
        }\`**`
      )
      .addFields([
        {
          name: "Fates List",
          value: "[Go to page](https://fateslist.xyz/bot/975450018360229908)",
          inline: true,
        },
        {
          name: "Infinity Bots",
          value:
            "[Go to page](https://infinitybots.gg/bots/975450018360229908)",
          inline: true,
        },
      ]);
    await message.reply({
      embeds: [voteLinksEmbed],
    });
  },
};
