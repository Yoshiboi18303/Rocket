const Guilds = require("../schemas/guildSchema");
const { MessageActionRow, MessageButton, Permissions } = require("discord.js");

module.exports = {
  name: "help",
  description: "Get info on all the commands of the bot!",
  usage: "{prefix}help",
  userPermissions: [],
  clientPermissions: [
    Permissions.FLAGS.VIEW_CHANNEL,
    Permissions.FLAGS.SEND_MESSAGES,
  ],
  execute: async (message) => {
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    const help_embed = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setTitle("Help Command")
      .setDescription("Here are all my commands!")
      .setURL(`https://${config.origin}`)
      .setFooter({
        text: "Syntax: <> = required, [] = optional",
      });

    client.commands.each((command) =>
      help_embed.addField(
        command.name.replace(command.name[0], command.name[0].toUpperCase()),
        `**Description:** ${command.description}\n**Usage:** ${
          command.usage?.replace("{prefix}", Guild.prefix) || "Not Provided"
        }\n**Aliases:** ${command.aliases?.join(", ") || "None"}
        `,
        true
      )
    );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setLabel("GitHub")
        .setURL("https://github.com/Yoshiboi18303/Rocket-Conomy"),
      new MessageButton()
        .setStyle("LINK")
        .setLabel("Website")
        .setURL(`https://${config.origin}`)
    );

    await message.reply({
      embeds: [help_embed],
      components: [row],
    });
  },
};
