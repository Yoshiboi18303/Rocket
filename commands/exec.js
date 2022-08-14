const { Message, MessageAttachment, MessageEmbed } = require("discord.js");
const shell = require("shelljs");
const colors = require("../colors.json");
const Guilds = require("../schemas/guildSchema");

module.exports = {
  name: "exec",
  description: "Execute a shell command (owner only)",
  aliases: ["execute"],
  usage: "{prefix}exec <command>",
  type: "Owner",
  cooldown: ms("12s"),
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  ownerOnly: true,
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
    const cmd = args.join(" ");
    if (!cmd) {
      const no_cmd_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a shell command to execute! ❌");
      return await message.reply({
        embeds: [no_cmd_embed],
      });
    }
    if (cmd == "speedtest") {
      var Guild = await Guilds.findOne({
        id: message.guild.id,
      });
      if (!Guild) {
        Guild = new Guilds({
          id: message.guild.id,
        });
        Guild.save();
      }
      const cmd_already_made_embed = new MessageEmbed()
        .setColor(colors.yellow)
        .setTitle("Attention")
        .setDescription(
          `There's already a command for this, please run \`${Guild.prefix}speedtest\` instead of this command for this!`
        );
      return await message.reply({
        embeds: [cmd_already_made_embed],
      });
    }
    const executing_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setTitle("Please Wait")
      .setDescription("Executing your command...");
    var msg = await message.reply({
      embeds: [executing_embed],
    });
    var secrets = [
      process.env.TOKEN,
      process.env.BACKUP_DLS_API_KEY,
      process.env.BOATS_KEY,
      process.env.CLIENT_SECRET,
      process.env.DEL_API_KEY,
      process.env.DISCORDBOTLIST,
      process.env.DISCORDLISTOLOGY,
      process.env.FP_KEY,
      process.env.INFINITY_API_TOKEN,
      process.env.KEY,
      process.env.KEY_TO_MOTION,
      process.env.MAIN_DLS_API_KEY,
      process.env.MONGO_CS,
      process.env.RADAR_KEY,
      process.env.SECRET,
      process.env.SERVICES_API_KEY,
      process.env.STATCORD_KEY,
      process.env.TEST_VOTE_WEBHOOK_TOKEN,
      process.env.TOPGG_API_KEY,
      process.env.VOTE_WEBHOOK_TOKEN,
      process.env.WEBHOOK_AUTH,
      process.env.PAT,
    ];
    let output = shell.exec(cmd);
    if (output == "" && output.stderr != "") {
      output = `${output.stderr}`;
    } else if ((output == "" && output.stderr == "") || output == "\n") {
      output = "Command Completed (no output)";
    } else if (output.length > 4096 || output.stderr.length > 4096) {
      var buffer = Buffer.from(output);
      var attachment = new MessageAttachment(buffer, "output.txt");
      return await msg.edit({
        content: `The output wanting to be shown for \`${cmd}\` is too long to be shown on Discord, so here's a file.`,
        embeds: [],
        files: [attachment],
      });
    }
    for (const secret of secrets) {
      if (output.includes(secret)) {
        output = "[HIDDEN SECRET (Console Cleared!)]";
        console.clear();
      }
    }
    const executed_embed = new MessageEmbed()
      .setColor(colors.orange)
      .setTitle("Executed Callback")
      .setDescription(
        `This is what came back from your command...\n\nCommand: \`\`\`bash\n${cmd}\n\`\`\`\n\nOutput: \`\`\`\n${output}\n\`\`\``
      )
      .setTimestamp();
    await msg.edit({
      embeds: [executed_embed],
    });
  },
};
