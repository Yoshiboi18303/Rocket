module.exports = {
  name: "volume",
  description: "Adjust the volume of the queue!",
  aliases: [],
  usage: "{prefix}volume <percent>",
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  ownerOnly: false,
  execute: async (message, args) => {
    const vc = message.member.voice.channel;
    if (!vc) {
      const no_vc_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You need to join a Voice Channel first! ❌");
      return await message.reply({
        embeds: [no_vc_embed],
      });
    }
    const queue = distube.getQueue(message);
    if (!queue) {
      const no_music_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Nothing is playing right now! ❌");
      return await message.reply({
        embeds: [no_music_embed],
      });
    }
    var volume = parseInt(args[0]);
    if (isNaN(volume)) {
      const nan_volume_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a valid number! ❌");
      return await message.reply({
        embeds: [nan_volume_embed],
      });
    }
    if (volume < 0 || volume > 100) {
      const invalid_volume_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a volume between 0 and 100! ❌");
      return await message.reply({
        embeds: [invalid_volume_embed],
      });
    }
    distube.setVolume(message, volume);
    const done_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(`✅ Queue volume set to **\`${volume}%\`**! ✅`);
    await message.reply({
      embeds: [done_embed],
    });
  },
};
