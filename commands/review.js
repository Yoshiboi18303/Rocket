const { Message } = require("discord.js");
const Reviews = require("../schemas/reviewSchema");

module.exports = {
  name: "review",
  description: "Send a review on the bot!",
  usage: "{prefix}review <stars> <review>",
  aliases: [],
  type: "Other",
  cooldown: ms("5s"),
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

    /**
     * Parses stars into emojis
     * @param {Number} stars
     * @returns String
     */
    const parseStars = (stars) => {
      if (!stars) throw new Error("The stars parameter is required!".red);
      if (!(stars instanceof Number)) {
        var check = parseInt(stars);
        if (isNaN(check))
          throw new TypeError(
            "Couldn't convert your stars argument into a number.".red
          );
        stars = check;
      }
      var final = "";
      switch (stars) {
        case 1:
          final = "⭐";
          break;
        case 2:
          final = "⭐⭐";
          break;
        case 3:
          final = "⭐⭐⭐";
          break;
        case 4:
          final = "⭐⭐⭐⭐";
          break;
        case 5:
          final = "⭐⭐⭐⭐⭐";
          break;
      }
      return final;
    };

    if (isNaN(stars))
      return await message.reply({ content: "That's not a number!" });
    if (stars <= 0 || stars > 5)
      return await message.reply({
        content: "Please provide a number between `1` and `5`!",
      });
    if (!review)
      return await message.reply({ content: "You need to provide a review!" });

    var formattedStars = parseStars(stars);

    var data = new Reviews({
      user: message.author.id,
      starCount: stars,
      formattedStars,
      review,
    });
    data.save();
    await message.reply({
      content: "Successfully created your review on the database!",
    });
  },
};
