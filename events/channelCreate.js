const Log = require("../utils/logger");
const { GuildChannel } = require("discord.js");

module.exports = {
  name: "channelCreate",
  once: false,
  /**
   * @param {GuildChannel} channel
   */
  execute: (channel) => {
    Log(client, channel.guild, Enum.Log.ChannelCreate, {
      channel,
    });
  },
};
