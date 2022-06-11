const { Permissions } = require("discord.js");

module.exports = {
  name: "playsong",
  description: "Start playing a song!",
  aliases: [],
  usage: "{prefix}playsong <song/query/file>",
  type: "Music",
  cooldown: ms("5s"),
  userPermissions: [],
  clientPermissions: [Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK],
  testing: false,
  ownerOnly: false,
  execute: async (message, args) => {
    var vc = message.member.voice.channel;
    if (!vc) {
      const no_vc_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You need to join a Voice Channel first! ❌");
      return await message.reply({
        embeds: [no_vc_embed],
      });
    }
    var song = args.join(" ");
    if (!song && message.attachments.size <= 0) {
      const no_song_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a song/url/file! ❌");
      return await message.reply({
        embeds: [no_song_embed],
      });
    } else {
      if (message.attachments.size > 0 && !song) {
        var file = message.attachments.first();
        // console.log(file.contentType)
        if (
          !file.contentType.includes("audio") &&
          !file.contentType.includes("video")
        ) {
          const invalid_file_embed = new MessageEmbed()
            .setColor(colors.red)
            .setDescription("❌ Please provide an audio file to read! ❌");
          return await message.reply({
            embeds: [invalid_file_embed],
          });
        }
        song = file.url;
      }
      await distube.play(vc, song, {
        message,
        textChannel: message.channel,
        member: message.member,
      });
    }
  },
};
