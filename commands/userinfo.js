const Users = require("../schemas/userSchema");
const { returnUserStatusText } = require("../utils/");
const { utc } = require("moment");

module.exports = {
  name: "userinfo",
  description: "View info on a user (or yourself)!",
  aliases: ["ui"],
  usage: "{prefix}userinfo [@user/user id]",
  testing: true,
  ownerOnly: false,
  userPermissions: [],
  clientPermissions: [],
  execute: async (message, args) => {
    var user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    return await message.reply({
      content: "Coming soon!"
    })
  }
}