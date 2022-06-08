const fetch = require("node-fetch");
const { Message } = require("discord.js");

module.exports = {
  name: "review",
  description: "Send a review on the bot!",
  usage: "{prefix}review <stars> <review>",
  aliases: [],
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  ownerOnly: false,
  nsfw: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var stars = parseInt(args[0]);
    var review = args.slice(1).join(" ");

    if (isNaN(stars))
      return await message.reply({ content: "That's not a number!" });
    if (stars <= 0 || stars > 5)
      return await message.reply({
        content: "Please provide a number between `1` and `5`!",
      });

    var req = await fetch.default(
      `https://${config.origin}/report/sendreview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            id: message.author.id,
          },
          stars,
          review,
        }),
      }
    );
    if (req.status != 200)
      return await message.reply({
        content:
          "Hmm... seems like your review didn't go through... Please try again later!",
      });
    await message.reply({ content: "Review sent!" });
  },
};
