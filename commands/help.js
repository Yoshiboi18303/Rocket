const Guilds = require("../schemas/guildSchema");

module.exports = {
  name: "help",
  description: "Get info on all the commands of the bot!",
  usage: "{prefix}help",
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

    await message.reply({
      embeds: [help_embed],
    });
  },
};
