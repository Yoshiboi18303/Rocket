const Users = require("../schemas/userSchema");

module.exports = {
  name: "profile",
  description: "View your profile (or one of another user)!",
  usage: "{prefix}profile [@user/user id]",
  execute: async (message, args) => {
    var user =
      message.mentions.users.first() ||
      client.users.cache.get(args[0]) ||
      message.author;
    var User = await Users.findOne({ id: user.id });
    if (!User) {
      User = new Users({
        id: user.id,
      });
      User.save();
    }
    const profile_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle(`Profile of ${user.username}!`)
      .addFields([
        {
          name: "Tokens",
          value: `${User.tokens}`,
          inline: true,
        },
        {
          name: "Wins",
          value: `${User.wins}`,
          inline: true,
        },
        {
          name: "Rank",
          value: `${emojis[User.rank]} ${User.rank}`,
          inline: true,
        },
      ]);
    await message.reply({
      embeds: [profile_embed],
    });
  },
};
