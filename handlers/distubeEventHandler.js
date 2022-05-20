module.exports = (client, Discord) => {
  const eventFiles = fs
    .readdirSync("./distubeEvents/")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../distubeEvents/${file}`);

    if (!event.name) throw new Error("All events need a name!");

    distube.on(event.name, (...args) =>
      event.execute(...args, client, Discord)
    );
  }
};
