const Log = require("../utils/logger");
const { Message } = require("discord.js");
const Guilds = require("../schemas/guildSchema");

module.exports = {
  name: "message",
  description: "Send some info to every server with a logging channel!",
  aliases: ["log", "devnote"],
  usage: "{prefix}message <message>",
  type: "Owner",
  cooldown: ms("20s"),
  testing: false,
  ownerOnly: true,
  nsfw: false,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    if (message.author.id == "381710555096023061") {
      return await message.reply({
        content: "You aren't authorized to run this command (yet)!"
      })
    }
    var msg = args.join(" ");
    if (!msg) {
      const no_message_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a message! ❌");
      return await message.reply({
        embeds: [no_message_embed],
      });
    }
    Log(client, message.guild, Enum.Log.Info, {
      message: msg,
    });
    var guilds = await Guilds.find({});
    guilds = guilds.filter((guild) => guild.logChannel != "");
    var count = guilds.length;
    const doneEmbed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `✅ Successfully logged your message to **\`${count}\`** ${count == 1 ? "guild" : "guilds"
        }! ✅`
      );
    await message.reply({
      embeds: [doneEmbed],
    });
  },
};
