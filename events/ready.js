const fetch = require("node-fetch");
const { Client } = require("discord.js");
const Guilds = require("../schemas/guildSchema");
const Users = require("../schemas/userSchema");
const { radar } = require("../client");
const Table = require("ascii-table");

module.exports = {
  name: "ready",
  /**
   * @param {Client} client
   */
  execute: async (client) => {
    var i = 1;
    global.ready = true;
    const table = new Table("Commands").setHeading("", "Name", "Description");
    console.log("The client is ready!".green);
    client.commands.each((cmd) => {
      table.addRow(i, cmd.name, cmd.description);
      i++;
    });
    var body = {
      servers: client.guilds.cache.size,
      shards: 1,
    };
    var req = await fetch.default(
      "https://api.infinitybotlist.com/bots/stats",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.INFINITY_TOKEN,
        },
        body: JSON.stringify(body),
      }
    );
    var data = await req.json().catch(() => {});
    console.log(data);
    body = {
      server_count: client.guilds.cache.size,
      shard_count: 1,
    };
    req = await fetch.default(
      `https://api.voidbots.net/bot/stats/${client.user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.VOID_KEY,
        },
        body: JSON.stringify(body),
      }
    );
    data = await req.json().catch(() => {});
    console.log(data);

    body = {
      servers: client.guilds.cache.size,
      shards: 1,
    };
    req = await fetch.default(
      `https://api.discordservices.net/bot/${client.user.id}/stats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.SERVICES_KEY,
        },
        body: JSON.stringify(body),
      }
    );
    data = await req.json().catch(() => {});
    console.log(data);

    var cmds = [];
    client.commands.each((cmd) => {
      var object = {
        command: cmd.name,
        desc: cmd.description,
      };
      cmds.push(object);
    });

    req = await fetch.default(
      `https://api.discordservices.net/bot/${client.user.id}/commands`,
      {
        method: "POST",
        headers: {
          Authorization: process.env.SERVICES_KEY,
        },
        body: JSON.stringify(cmds),
      }
    );
    data = await req.json().catch(() => {});
    console.log(data);

    var data = await radar.stats(client.guilds.cache.size, 1, true);
    console.log(data);

    statcord.autopost();

    /*
    client.radar
      .lastVoted(config.owner)
      .then((data) => console.log(data))
      .catch((e) => console.error(e));
    */

    console.log(table.toString());

    var originVc = client.channels.cache.get("982507708634763294");

    originVc.setName(
      `https://${config.origin}`,
      "Ensuring the origin is up-to-date."
    );

    const cachedGuilds = await Guilds.countDocuments();
    const cachedUsers = await Users.countDocuments();

    var cachedVc = client.channels.cache.get("982508373595553823");

    cachedVc.setName(
      `Cached: ${cachedGuilds + cachedUsers}`,
      "Ensuring the cached count is up-to-date."
    );

    statcord.registerCustomFieldHandler(1, async () => {
      var count = 0;
      client.channels.cache.each((channel) => {
        if (
          channel.type == "GUILD_TEXT" &&
          channel.name.includes(`ticket-${channel.guild.id}-`)
        )
          count++;
      });
      return `${count}`;
    });

    const activities = [
      "The Galaxy",
      "In Servers",
      "With Food",
      `${client.users.cache.size} users`,
      `${client.guilds.cache.size} ${
        client.guilds.cache.size > 1 ? "servers" : "server"
      }`,
    ];
    const types = ["PLAYING", "WATCHING", "LISTENING"];
    setInterval(() => {
      var activity = activities[Math.floor(Math.random() * activities.length)];
      var type = types[Math.floor(Math.random() * types.length)];
      if (type == "LISTENING" && activity == activities[1])
        activity = "Servers";
      if (type == "LISTENING" && activity == activities[2]) activity = "Food";
      activity += " - r!help";
      client.user.setActivity({
        name: activity,
        type,
      });
    }, 15000);
  },
};
