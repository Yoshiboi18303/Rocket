module.exports = {
  name: "skip",
  description: "Skip the current song!",
  aliases: [],
  usage: "{prefix}skip",
  type: "Music",
  cooldown: ms("5s"),
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  ownerOnly: false,
  execute: async (message) => {
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
    if (queue.songs.length == 1) {
      const no_next_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ There is no song up next in the queue! ❌");
      return await message.reply({
        embeds: [no_next_embed],
      });
    }
    distube.skip(message);
    const done_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription("✅ Current song skipped! ✅");
    await message.reply({
      embeds: [done_embed],
    });
  },
};
