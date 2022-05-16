module.exports = (client, Discord) => {
  const eventFiles = fs
    .readdirSync("./events/")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);

    if (!event.name) throw new Error("All events need a name!");

    client.on(event.name, (...args) => event.execute(...args, client, Discord));
  }
};
