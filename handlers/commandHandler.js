const fs = require("fs");

module.exports = (client) => {
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);

    if (!command.name)
      throw new Error(
        `Command ${
          file.replace(".js", "").replace(file[0], file[0].toUpperCase()).blue
        } `.red + "doesn't have a name!".red
      );
    if (!command.description)
      throw new Error(
        `Command ${
          command.name.replace(command.name[0], command.name[0].toUpperCase())
            .blue
        } `.red + "doesn't have a description!".red
      );
    if (!command.type)
      throw new Error(
        `Command ${
          command.name.replace(command.name[0], command.name[0].toUpperCase())
            .blue
        } `.red + "doesn't have a type!".red
      );
    if (!command.cooldown)
      throw new Error(
        `Command ${
          command.name.replace(command.name[0], command.name[0].toUpperCase())
            .blue
        } `.red + "doesn't have a cooldown!".red
      );
    if (!command.execute || !(command.execute instanceof Function))
      throw new Error(
        `Command ${
          command.name.replace(command.name[0], command.name[0].toUpperCase())
            .blue
        }`.red +
          `${
            !command.execute
              ? " doesn't have an execute function!"
              : "'s execute property isn't a function!"
          }`.red
      );

    client.commands.set(command.name, command);
    if (command.aliases) {
      if (typeof command.aliases == "string" && command.aliases.includes(",")) {
        command.aliases = command.aliases.split(",");
        command.aliases.forEach((alias) => {
          var oldAlias = alias;
          alias = alias.replace(" ", "");
          command.aliases.splice(
            command.aliases.findIndex((a) => a == oldAlias),
            1,
            alias
          );
        });
      }
      if (!Array.isArray(command.aliases))
        command.aliases = [`${command.aliases}`];
      for (var alias of command.aliases) {
        client.aliases.set(alias, command);
      }
    }
  }
};
