const fs = require("fs");
const LoggerClass = require("../classes/Logger");
const Logger = new LoggerClass();

module.exports = (client) => {
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);

    if (!command.name)
      Logger.error(`Command ${
        file.replace(".js", "").replace(file[0], file[0].toUpperCase())
      } ` + "doesn't have a name!", true)
    if (!command.description)
      Logger.error(`Command ${
        command.name.replace(command.name[0], command.name[0].toUpperCase())
      } ` + "doesn't have a description!", true)
    if (!command.type)
      Logger.error(`Command ${
        command.name.replace(command.name[0], command.name[0].toUpperCase())
      } ` + "doesn't have a type!", true)
    if (!command.cooldown)
      Logger.error(`Command ${
        command.name.replace(command.name[0], command.name[0].toUpperCase())
      } ` + "doesn't have a cooldown!", true)
    if (!command.execute || !(command.execute instanceof Function))
      Logger.error(`Command ${
        command.name.replace(command.name[0], command.name[0].toUpperCase())
      }` +
        `${
          !command.execute
            ? " doesn't have an execute function!"
            : "'s execute property isn't a function!"
        }`, true)

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
    Logger.success(`Command ${file.replace(".js", "")} loaded!`)
  }
};
