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
      .setFooter({
        text: "Syntax: <> = required, [] = optional",
      });

    client.commands.each((command) =>
      help_embed.addField(
        command.name,
        `**Description:** ${command.description}\n**Usage:** ${
          command.usage?.replace("{prefix}", Guild.prefix) || "Not Provided"
        }`,
        true
      )
    );

    await message.reply({
      embeds: [help_embed],
    });
  },
};
