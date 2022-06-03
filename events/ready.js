const fetch = require("node-fetch");
const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  /**
   * @param {Client} client
   */
  execute: async (client) => {
    console.log("The client is ready!".green);
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
    var data = await req.json();
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
    data = await req.json();
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
    data = await req.json();
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
        body: cmds,
      }
    );
    data = await req.json();
    console.log(data);

    setInterval(() => {
      client.radar
        .stats(client.guilds.cache.size, 1)
        .then((data) => console.log(data))
        .catch((e) => console.error(e));
    }, ms("2m"));

    client.radar
      .lastVoted(config.owner)
      .then((data) => console.log(data))
      .catch((e) => console.error(e));

    const activities = [
      "Rocket League",
      `${client.users.cache.size} users`,
      `${client.guilds.cache.size} ${
        client.guilds.cache.size > 1 ? "servers" : "server"
      }`,
    ];
    const types = ["PLAYING", "WATCHING", "LISTENING"];
    setInterval(() => {
      var activity = activities[Math.floor(Math.random() * activities.length)];
      var type = types[Math.floor(Math.random() * types.length)];
      activity += " - rlc!help";
      client.user.setActivity({
        name: activity,
        type,
      });
    }, 15000);
  },
};
