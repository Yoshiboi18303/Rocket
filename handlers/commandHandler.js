module.exports = (client, Discord) => {
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);

    if (!command.name)
      throw new Error(
        `Command "${file
          .replace(".js", "")
          .replace(file[0], file[0].toUpperCase())}" doesn't have a name!`
      );
    if (!command.description)
      throw new Error(
        `Command "${command.name.replace(
          command.name[0],
          command.name[0].toUpperCase()
        )}" doesn't have a description!`
      );

    client.commands.set(command.name, command);
    if (command.aliases) {
      if (!Array.isArray(command.aliases))
        command.aliases = [`${command.aliases}`];
      for (var alias of command.aliases) {
        client.aliases.set(alias, command);
      }
    }
  }
};
