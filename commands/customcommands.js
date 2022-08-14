const { Message, MessageEmbed, Permissions } = require("discord.js");
const colors = require("../colors.json");
const config = require("../config.json");
const Guilds = require("../schemas/guildSchema");
const allowedActions = ["add", "list", "remove"];
const ms = require("ms");

module.exports = {
  name: "customcommands",
  description: "View, add and remove your custom commands!",
  usage: "{prefix}customcommands [action]",
  aliases: ["cc", "customcmds"],
  type: "Utility",
  cooldown: ms("5s"),
  userPermissions: [],
  clientPermissions: [],
  testing: true,
  voteOnly: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var action = args[0];
    if (!allowedActions.includes(action))
      return await message.reply({
        content:
          "That's an invalid action, the valid actions are `add`, `list` and `remove`!",
      });
    var Guild = await Guilds.findOne({
      id: message.guild.id,
    });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    switch (action) {
      case "add":
        await message.reply({
          content: "Coming soon!",
        });
        break;
      case "list":
        if (Guild.customCommands.length <= 0)
          return await message.reply({
            content: "There are no custom commands for this guild ||(yet)||!",
          });
        const commands_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`Custom Commands for \`${message.guild.name}\``)
          .setDescription(
            `Here are all the commands for Custom Commands for \`${message.guild.name}\``
          )
          .setFooter({
            text: "<> = required, [] = optional",
          });
        for (var command of Guild.customCommands) {
          var usage = `${Guild.prefix}${command.name}`;
          for (var arg of command.args) {
            usage += ` ${arg.required ? `<${arg.name}>` : `[${arg.name}]`}`;
          }
          commands_embed.addField(`${command.name}`, `**Usage:** \`${usage}\``);
        }
        await message.reply({
          embeds: [commands_embed],
        });
        break;
      case "remove":
        await message.reply({
          content: "Coming soon!",
        });
        break;
    }
  },
};
