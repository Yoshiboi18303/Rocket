module.exports = {
  name: "resume",
  description: "Resume the music!",
  aliases: [],
  usage: "{prefix}resume",
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
    if (!queue.paused) {
      const not_paused_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ The queue is not paused! ❌");
      return await message.reply({
        embeds: [not_paused_embed],
      });
    }
    distube.resume(message);
    const done_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription("✅ Music resumed! ✅");
    await message.reply({
      embeds: [done_embed],
    });
  },
};
