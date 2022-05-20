const {
  MessageActionRow,
  MessageSelectMenu,
  Permissions,
} = require("discord.js");

module.exports = {
  name: "setreactions",
  description: "Set up Reaction Roles!",
  aliases: ["rr"],
  usage: "{prefix}setreactions <emoji> <role mention/role id>",
  userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
  clientPermissions: [],
  testing: true,
  ownerOnly: false,
  execute: async (message, args) => {
    var emoji = message.guild.emojis.cache.get(args[0]) || args[0];
    var role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    console.log(emoji, role);
    await message.reply({
      content: "Check the console!",
    });
  },
};
