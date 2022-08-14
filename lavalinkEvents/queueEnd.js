const { Client } = require("discord.js");
const { Player } = require("erela.js");
const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "queueEnd",
  once: false,
  /**
   * @param {Client} client
   * @param {Player} player
   */
  execute: async (client, Logger, player) => {
    var channel = client.channels.cache.get(player.textChannel);
    Logger.log(
      `The queue for ${channel.name} is empty, destroying the player in 30 seconds...`
    );
    await channel.send({
      content: "The queue is empty, I will be leaving in 30 seconds.",
    });

    await wait(30000);

    player.destroy();
  },
};
