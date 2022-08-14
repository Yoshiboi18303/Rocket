const { Client } = require("discord.js");
const fs = require("fs");
const path = require("path");
const LoggerClass = require("../classes/Logger");
const Logger = new LoggerClass();

/**
 * @param {Client} client
 */
module.exports = (client) => {
  var eventFiles = fs
    .readdirSync(path.join(__dirname, "..", "lavalinkEvents"))
    .filter((file) => file.endsWith(".js"));

  for (var file of eventFiles) {
    var event = require(`../lavalinkEvents/${file}`);

    if (!event.name) Logger.error("All events need a name!", true);

    if (event.once) {
      lavalink.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      lavalink.on(event.name, (...args) =>
        event.execute(client, Logger, ...args)
      );
    }
  }
};
