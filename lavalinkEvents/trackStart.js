const { Client, MessageEmbed } = require("discord.js");
const { Player } = require("erela.js");
const colors = require("../colors.json");

module.exports = {
  name: "trackStart",
  /**
   * @param {Client} client
   * @param {Player} player
   */
  execute: async (client, Logger, player, track) => {
    var channel = client.channels.cache.get(player.textChannel);
    if (!track || !channel) return;
    Logger.log(`Now Playing ${track.name} in ${channel?.guild?.name}!`);
    const now_playing_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Now Playing")
      .setAuthor({
        name: `${track.author}`,
      })
      .setDescription("Next track is now playing!")
      .addFields([
        {
          name: "Track",
          value: `${track.name}`,
          inline: true,
        },
        {
          name: "Requested By",
          value: `${track.requester.username}`,
          inline: true,
        },
        {
          name: "Duration",
          value: `${track.duration}`,
          inline: true,
        },
      ]);

    var thumbnail = track.displayThumbnail();

    if (thumbnail != null) now_playing_embed.setThumbnail(thumbnail);

    await channel?.send({
      embeds: [now_playing_embed],
    });
  },
};
