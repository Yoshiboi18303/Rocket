const Log = require("../utils/logger");
const { DMChannel, GuildChannel } = require("discord.js");

module.exports = {
  name: "channelDelete",
  once: false,
  /**
   * @param {DMChannel | GuildChannel} channel
   */
  execute: (channel) => {
    Log(client, channel.guild, Enum.Log.ChannelDelete, {
      channel,
    });
  },
};
