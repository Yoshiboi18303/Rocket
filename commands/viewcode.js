const { Message, MessageAttachment } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "viewcode",
  description: "View the code of a file (owner only)",
  usage: "{prefix}viewcode <path>",
  aliases: "code",
  type: "Owner",
  cooldown: ms("8s"),
  testing: false,
  ownerOnly: true,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var path = args[0];
    if (!path) {
      const no_path_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please define a path! ❌");
      return await message.reply({
        embeds: [no_path_embed],
      });
    }
    if (path.includes(".env"))
      return await message.reply({
        content:
          "This file is unviewable due to the large amount of private info that shouldn't be shared.",
      });
    try {
      var dirfile = fs.readFileSync(path);
      // console.log(dirfile);
      var code = dirfile.toString();
      if (code.length > 4096) {
        var buffer = Buffer.from(code);
        const cmdfile = new MessageAttachment(
          buffer,
          `${
            path.endsWith(".js") || path.endsWith(".json")
              ? "code.js"
              : path.endsWith(".md")
              ? "code.md"
              : path.endsWith(".ejs") || path.endsWith(".html")
              ? "code.html"
              : "code.txt"
          }`
        );
        var array = path.split(".");
        return await message.reply({
          content: `The code in that ${array[
            array.length - 1
          ].toUpperCase()} file is too long for an embed, so here's a file with the **EXACT SAME** code.`,
          files: [cmdfile],
        });
      }
      const code_embed = new MessageEmbed()
        .setColor(colors.cyan)
        .setTitle("File code")
        .setDescription(
          `\`\`\`${
            path.endsWith(".js") || path.endsWith(".json")
              ? "js"
              : path.endsWith(".md")
              ? "md"
              : "html"
          }\n${code}\n\`\`\``
        )
        .setTimestamp();
      await message.reply({
        embeds: [code_embed],
      });
    } catch (e) {
      return await message.reply({
        content: `\`${e}\``,
      });
    }
  },
};
