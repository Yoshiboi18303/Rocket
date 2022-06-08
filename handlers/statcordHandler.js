module.exports = (client, Discord) => {
  const eventFiles = fs
    .readdirSync("./statcordEvents/")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../statcordEvents/${file}`);

    if (!event.name) throw new Error("All events need a name!");

    if (event.once) {
      statcord.once(event.name, (...args) =>
        event.execute(...args, client, Discord)
      );
    } else {
      statcord.on(event.name, (...args) =>
        event.execute(...args, client, Discord)
      );
    }
  }
};
