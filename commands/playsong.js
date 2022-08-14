const { Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");
const LoggerClass = require("../classes/Logger");
const Logger = new LoggerClass();
const colors = require("../colors.json");

module.exports = {
  name: "playsong",
  description: "Start playing music in your server!",
  usage: "{prefix}playsong <query | link>",
  cooldown: ms("2s"),
  type: "Music",
  testing: true,
  clientPermissions: [Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    /*
        return await message.reply({
            content: "This command is broken and will be fixed soon."
        })
        */
    if (!message.member.voice.channel) {
      const no_voice_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("Please join a voice channel!");
      return await message.reply({
        embeds: [no_voice_embed],
      });
    }
    var query = args.join(" ");
    if (!query) {
      const no_query_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("Please provide a query/link!");
      return await message.reply({
        embeds: [no_query_embed],
      });
    }
    let res;
    try {
      res = await lavalink.search(query, message.author);

      if (res.loadType == "LOAD_FAILED") {
        await message.reply({
          content: `Failed to load due to the following reason: \`${res.exception}\``,
        });
        return await Logger.error(res.exception, false);
      } else if (res.loadType == "PLAYLIST_LOADED") {
        return await message.reply({
          content:
            "Playlists will be supported soon, but for now, they are unsupported.",
        });
      }
    } catch (e) {
      console.error(e);
      return await message.reply({
        content: `An error occurred: ||\`${e.message}\`||`,
      });
    }

    if (res.loadType == "NO_MATCHES")
      return await message.reply({
        content: "No matches were found for your query.",
      });

    const player = lavalink.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
    });

    player.connect();
    player.queue.add(res.tracks[0]);

    if (!player.playing && !player.paused && !player.queue.size) player.play();

    return await message.reply({
      content: `**${res.tracks[0].name}** by **${res.tracks[0].author}** added to the queue!`,
    });
  },
};
