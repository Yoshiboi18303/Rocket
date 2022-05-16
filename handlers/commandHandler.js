module.exports = (client, Discord) => {
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);

    if (!command.name) throw new Error("All commands need a name!");
    if (!command.description)
      throw new Error("All commands need a description!");

    client.commands.set(command.name, command);
  }
};
