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
      guilds: client.guilds.cache.size,
      shards: 1,
    };
    req = await fetch.default(
      `https://radarbotdirectory.xyz/api/bot/${client.user.id}/stats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.RADAR_KEY,
        },
        body: JSON.stringify(body),
      }
    );
    data = await req.json();
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
