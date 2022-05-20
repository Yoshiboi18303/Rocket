module.exports = {
  name: "leave",
  description: "Tell the client to leave the VC!",
  aliases: ["bye"],
  usage: "{prefix}leave",
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
    var voice = distube.voices.get(message);
    if (!voice) {
      const no_voice_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ I'm not connected to a Voice Channel! ❌");
      return await message.reply({
        embeds: [no_voice_embed],
      });
    }
    if (vc.id != voice.voiceState.channel.id) {
      const not_same_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You are not in the same VC that I am in! ❌");
      return await message.reply({
        embeds: [not_same_embed],
      });
    }
    voice.leave();
    const done_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription("✅ Left the Voice Channel! ✅");
    await message.reply({
      embeds: [done_embed],
    });
  },
};
