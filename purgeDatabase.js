const mongoose = require("mongoose");
const Users = require("./schemas/userSchema");
const Reviews = require("./schemas/reviewSchema");
const Guilds = require("./schemas/guildSchema");
const ShortLinks = require("./schemas/shortLinkSchema");
require("colors");
require("dotenv").config();

/**
 * Purges a mongoose model
 * @param {String} model
 * @returns String
 */
const purgeModel = (model) => {
  model = model.toLowerCase();
  if (!["users", "reviews", "guilds", "shortlinks"].includes(model))
    throw new Error("That's not a valid model available to purge!");
  var returnValue = "";
  mongoose
    .connect(process.env.MONGO_CS, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(async () => {
      switch (model) {
        case "users":
          var BotUsers = await Users.find({});
          var UsersPurged = 0;
          BotUsers.forEach((user) => {
            Users.findOneAndDelete({
              id: user.id,
            }).then(() => UsersPurged++);
          });
          returnValue =
            `Purged ${`${UsersPurged}`.cyan}`.green +
            ` users from the database!`.green;
          console.log(returnValue);
          break;
        case "reviews":
          var BotReviews = await Reviews.find({});
          var DeletedReviews = 0;
          BotReviews.forEach((review) => {
            Reviews.findOneAndDelete({
              user: review.user,
            }).then(() => DeletedReviews++);
          });
          returnValue =
            `Purged ${`${DeletedReviews}`.cyan}`.green +
            " reviews from the database!".green;
          console.log(returnValue);
          break;
        case "guilds":
          var BotGuilds = await Guilds.find({});
          var DeletedGuilds = 0;
          BotGuilds.forEach((guild) => {
            Guilds.findOneAndDelete({
              id: guild.id,
            }).then(() => DeletedGuilds++);
          });
          returnValue =
            `Purged ${`${DeletedGuilds}`.cyan}`.green +
            " guilds from the database!".green;
          console.log(returnValue);
          break;
        case "shortlinks":
          var BotShortLinks = await ShortLinks.find({});
          var DeletedShortLinks = 0;
          BotShortLinks.forEach((ShortLink) => {
            ShortLinks.findOneAndDelete({
              id: ShortLink.id,
            }).then(() => {
              console.log(
                `Short link ${`#${DeletedShortLinks + 1}`.blue}`.green +
                  " deleted from the database!".green
              );
              DeletedShortLinks++;
            });
          });
          break;
      }
    });
  return returnValue;
};

module.exports = {
  purgeModel,
};
