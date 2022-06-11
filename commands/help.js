const Guilds = require("../schemas/guildSchema");
const {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  Interaction,
  Message,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Get info on all the commands of the bot!",
  usage: "{prefix}help",
  type: "Information",
  cooldown: ms("5s"),
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var help_embed = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle("Help Command")
      .setDescription(
        `Hello and welcome to \`${client.user.username}\`, you have executed the help command which has been reworked to filter types.\n\n**Please use the newly implemented context menu below to select a type.**`
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
            label: "Music",
            value: "music",
            description: "Make your speakers blast with these commands!",
            emoji: "🎶",
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
      await msg.edit({
        content: "This help command has now expired.",
        components: [linkRow, typesRow],
      });
    });
  },
};
