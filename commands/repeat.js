module.exports = {
  name: "repeat",
  description: "Change the repeat mode!",
  aliases: ["loop"],
  usage: "{prefix}repeat [repeat mode]",
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
    var rmode = args[0] != undefined ? parseInt(args[0]) : undefined;
    // console.log(rmode)
    if (rmode != undefined && isNaN(rmode)) {
      const nan_repeatMode_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a valid number! ❌");
      return await message.reply({
        embeds: [nan_repeatMode_embed],
      });
    }
    if (rmode != undefined && (rmode < 0 || rmode > 2)) {
      const invalid_repeatMode_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a number between 0 and 2! ❌");
      return await message.reply({
        embeds: [invalid_repeatMode_embed],
      });
    }
    const mode = distube.setRepeatMode(message, rmode);
    const done_embed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `✅ Set repeat mode to \`${
          mode ? (mode === 2 ? "Queue" : "Current Song") : "Off"
        }\` ✅`
      );
    await message.reply({
      embeds: [done_embed],
    });
  },
};
