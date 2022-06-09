const Guilds = require("../schemas/guildSchema");
const { Permissions } = require("discord.js");

module.exports = {
  name: "prefix",
  description: "View or change the prefix of the bot!",
  usage: "{prefix}prefix [new prefix]",
  type: "Utility",
  execute: async (message, args) => {
    var Guild = await Guilds.findOne({
      id: message.guild.id,
    });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var npre = args[0];
    if (!npre) {
      const current_prefix_embed = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription(
          `ℹ️ My current prefix for this guild is **\`${Guild.prefix}\`** ℹ️`
        );
      return await message.reply({
        embeds: [current_prefix_embed],
      });
    }
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      const bad_permissions_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You don't have the `MANAGE_SERVER` permission! ❌");
      return await message.reply({
        embeds: [bad_permissions_embed],
      });
    }
    var data = await Guilds.findOneAndUpdate(
      {
        id: message.guild.id,
      },
      {
        $set: {
          prefix: npre,
        },
      }
    );
    data.save();
    const done_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `✅ The prefix of the bot has been updated from **\`${Guild.prefix}\`** to **\`${npre}\`** ✅`
      );
    await message.reply({
      embeds: [done_embed],
    });
  },
};
