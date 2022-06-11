module.exports = {
  name: "stop",
  description: "Stop the music!",
  aliases: ["end"],
  usage: "{prefix}stop",
  type: "Music",
  cooldown: ms("5s"),
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
    distube.stop(message);
    const done_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(`✅ Music stopped! ✅`);
    await message.reply({
      embeds: [done_embed],
    });
  },
};
