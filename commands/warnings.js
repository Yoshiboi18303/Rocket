const Warnings = require("../schemas/warningSchema");
const { Message } = require("discord.js");

module.exports = {
  name: "warnings",
  description: "View your warnings (or of someone else)",
  aliases: ["warns"],
  usage: "{prefix}warnings [@user | userid]",
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
    var user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    var Data = await Warnings.findOne({
      user: user.id,
      guild: message.guild.id
    })
    if(!Data || Data.context?.length == 0) {
      const no_data_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ This user doesn't have any warning data (or possibly, no warnings at all)! ❌")
      return await message.reply({
        embeds: [no_data_embed]
      })
    }
    var map = Data.context.map((w, i) => `\`${i + 1}\` - Moderator: **${client.users.cache.get(w.moderator)?.tag || "None/Unknown"}** - Reason: \`${w.reason}\` - Severity: \`${w.severity}\``)
    const warnings_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setTitle(`Warning Count for \`${user.username}\``)
      .setThumbnail(`${user.displayAvatarURL({ dynamic: false, format: "png", size: 512 })}`)
      .setDescription(`${map.join(",\n")}`)
    await message.reply({
      embeds: [warnings_embed]
    })
  }
}