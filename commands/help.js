const Guilds = require("../schemas/guildSchema");
const {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  Interaction,
  Message,
  MessageEmbed,
  Permissions,
} = require("discord.js");
const config = require("../config.json");
const colors = require("../colors.json");

module.exports = {
  name: "help",
  description: "Get info on all the commands of the bot!",
  usage: "{prefix}help [command]",
  type: "Information",
  cooldown: ms("5s"),
  aliases: "h",
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var argument = args[0] || null;
    if (argument != null) {
      var cmd = client.commands.find(
        (cmd) => cmd.name == argument || cmd.aliases?.includes(argument)
      );
      if (!cmd) {
        const invalidCommandEmbed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription("❌ That's not a valid command of the bot! ❌");
        return await message.reply({
          embeds: [invalidCommandEmbed],
        });
      }
      const commandHelpEmbed = new MessageEmbed()
        .setColor(colors.cyan)
        .setTitle(
          `\`${cmd.name.replace(cmd.name[0], cmd.name[0].toUpperCase())}\` Help`
        )
        .setDescription(`${cmd.description}`)
        .addFields([
          {
            name: "Usage",
            value: `\`\`\`\n${
              cmd.usage?.replace("{prefix}", Guild.prefix) || "None"
            }\n\`\`\``,
            inline: true,
          },
          {
            name: "Aliases",
            value: `\`\`\`\n${cmd.aliases?.join(", ") || "None"}\n\`\`\``,
            inline: true,
          },
          {
            name: "In Testing?",
            value: `\`\`\`\n${cmd.testing ? "Yes" : "No"}\n\`\`\``,
            inline: true,
          },
          {
            name: "Required To Vote?",
            value: `\`\`\`\n${cmd.voteOnly ? "Yes" : "No"}\n\`\`\``,
            inline: true,
          },
          {
            name: "Owner Only?",
            value: `\`\`\`\n${cmd.ownerOnly ? "Yes" : "No"}\n\`\`\``,
            inline: true,
          },
        ]);
      var bigIntArray = [];
      if (cmd.userPermissions) {
        for (var permission of cmd.userPermissions) {
          bigIntArray.push(permission);
        }
        var cmdUserPermissions = new Permissions();
        for (var bigInt of bigIntArray) {
          cmdUserPermissions.add(bigInt);
        }
        cmdUserPermissions = cmdUserPermissions.toArray();
      }
      bigIntArray = [];
      if (cmd.clientPermissions) {
        for (var permission of cmd.clientPermissions) {
          bigIntArray.push(permission);
        }
        var cmdClientPermissions = new Permissions();
        for (var bigInt of bigIntArray) {
          cmdClientPermissions.add(bigInt);
        }
        cmdClientPermissions = cmdClientPermissions.toArray();
      }

      if (cmdUserPermissions) {
        commandHelpEmbed.addField(
          "User Requires",
          `${
            cmdUserPermissions?.length > 0
              ? `\`\`\`\n${cmdUserPermissions.join(", ")}\n\`\`\``
              : "No required permissions"
          }`,
          true
        );
      }
      if (cmdClientPermissions) {
        commandHelpEmbed.addField(
          "Client Requires",
          `${
            cmdClientPermissions?.length > 0
              ? `\`\`\`\n${cmdClientPermissions.join(", ")}\n\`\`\``
              : "No required permissions"
          }`,
          true
        );
      }
      return await message.reply({
        embeds: [commandHelpEmbed],
      });
    }
    var help_embed = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle("Help Command")
      .setDescription(
        `Hello and welcome to \`${client.user.username}\`, you have executed the help command which has been made to filter command types.\n\n**Please use the context menu below to select a type.**`
      )
      .setURL(`https://${config.origin}`);

    const linkRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setLabel("GitHub")
        .setURL("https://github.com/Yoshiboi18303/Rocket"),
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Website")
        .setURL(`https://${config.origin}`),
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Support")
        .setURL(`${config.supportServerURL}`)
    );

    const typesRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setDisabled(false)
        .setCustomId("type-selection")
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Please choose a type")
        .addOptions([
          {
            label: "Economy",
            value: "economy",
            description: "Make some cash while having fun!",
            emoji: "💵",
          },
          {
            label: "Fun",
            value: "fun",
            description: "Have some laughs with your friends!",
            emoji: "😂",
          },
          {
            label: "Games",
            value: "games",
            description: "Have some fun with your friends!",
            emoji: "🎮",
          },
          {
            label: "Information",
            value: "information",
            description: "Get all the information you'll need!",
            emoji: "ℹ️",
          },
          {
            label: "Moderation",
            value: "moderation",
            description: "Keep your server safe with these commands!",
            emoji: "🔨",
          },
          {
            label: "Other",
            value: "other",
            description: "View all the other various commands.",
            emoji: "🕰️",
          },
          {
            label: "Owner",
            value: "owner",
            description: "The commands that only the captain can access.",
            emoji: "👑",
          },
          {
            label: "Utility",
            value: "utility",
            description: "Make your server much cooler with these commands!",
            emoji: "🔧",
          },
        ])
    );

    var msg = await message.reply({
      embeds: [help_embed],
      components: [linkRow, typesRow],
    });

    /**
     * @param {Interaction} interaction
     */
    const filter = async (interaction) => {
      if (interaction.user.id != message.author.id)
        return await interaction.reply({
          content: "This isn't yours!",
          ephemeral: true,
        });
      return true;
    };

    var collector = msg.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      filter,
      idle: 60 * 1000,
    });

    collector.on("collect", async (collected) => {
      var type = collected.values[0];
      if (type == "owner" && message.author.id != config.owner)
        return await collected.reply({
          content: "You can't access these commands!",
          ephemeral: true,
        });
      var commands = client.commands.filter(
        (command) => command.type.toLowerCase() == type
      );
      if (commands.size <= 0)
        return await collected.reply({
          content: "There's no commands of this type (yet)!",
          ephemeral: true,
        });
      help_embed = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setTitle("Help Command")
        .setDescription(
          `Here are all the commands for the \`${type.replace(
            type[0],
            type[0].toUpperCase()
          )}\` category.`
        )
        .setURL(`https://${config.origin}`)
        .setFooter({
          text: "Syntax: <> = required, [] = optional",
        });
      commands.each((command) =>
        help_embed.addField(
          `${command.name}`,
          `Description: ${command.description}, Usage: \`${
            command.usage?.replace("{prefix}", `${Guild.prefix}`) ||
            "None Provided"
          }\`, Aliases: ${command.aliases?.join(", ") || "None"}`,
          true
        )
      );
      await collected.update({
        embeds: [help_embed],
      });
    });

    collector.on("end", async () => {
      typesRow.components.forEach((component) => component.setDisabled(true));
      await msg
        .edit({
          content: "This help command has now expired.",
          components: [linkRow, typesRow],
        })
        .catch(() => {
          return;
        });
    });
  },
};
