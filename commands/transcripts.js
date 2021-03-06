const fs = require("fs/promises");
const ms = require("ms");
const { Message, MessageEmbed } = require("discord.js");
const path = require("path");
const config = require("../config.json");

module.exports = {
  name: "transcripts",
  description: "View all the current ticket transcripts!",
  usage: "{prefix}transcripts",
  aliases: ["openedtickets", "transcript"],
  type: "Utility",
  cooldown: ms("5s"),
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  ownerOnly: false,
  nsfw: false,
  voteOnly: false,
  /**
   * @param {Message} message
   */
  execute: (message) => {
    fs.readdir(path.join(__dirname, "..", "tickets", message.guild.id))
      .then(async (dir) => {
        var transcriptCharacters = [];
        var transcriptLines = [];
        var channelIds = [];
        for (var file of dir) {
          var buffer = await fs.readFile(
            path.join(__dirname, "..", "tickets", message.guild.id, file)
          );
          var length = buffer.toString().length;
          var lines = buffer.toString().split("\n").length;
          transcriptCharacters.push(length);
          channelIds.push(file.replace(".txt", ""));
          transcriptLines.push(lines);
        }
        var transcripts = dir.map(
          (transcript, i) =>
            `\`${i + 1}\` - **Entire File Length:** \`${
              transcriptCharacters[i]
            }\` characters & \`${
              transcriptLines[i]
            }\` lines, Link to transcript: [Click here!](https://${
              config.origin
            }/tickets/${message.guild.id}/${channelIds[i]})`
        );
        const embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`Transcripts in ${message.guild.name}`)
          .setDescription(`${transcripts.join("\n")}`);
        await message.reply({
          embeds: [embed],
        });
      })
      .catch(async () => {
        return await message.reply({
          content:
            "This guild doesn't have any saved transcripts at this time!",
        });
      });
  },
};
