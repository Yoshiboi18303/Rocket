module.exports = {
  name: "ready",
  async execute(client) {
    console.log("The client is ready!".green);
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
