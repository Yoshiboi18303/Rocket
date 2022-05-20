const Guilds = require("../schemas/guildSchema");
const Users = require("../schemas/userSchema");
const { MessageAttachment } = require("discord.js");
const util = require("util");

module.exports = {
  name: "eval",
  description: "Evaluates JavaScript code (dangerous)",
  usage: "{prefix}eval <code>",
  testing: false,
  ownerOnly: true,
  execute: async (message, args) => {
    const code = args.join(" ");
    if (!code)
      return await message.reply({ content: "Define some code to evaluate!" });
    var result = new Promise((resolve, reject) => {
      resolve(eval(code));
    });
    var secrets = [
      process.env.TOKEN,
      process.env.KEY,
      process.env.MONGO_CS,
      process.env.FP_KEY,
      client.token,
      process.env.RADAR_KEY,
      process.env.STATCORD_KEY,
      process.env.BACKUP_DLS_API_KEY,
      process.env.BOATS_KEY,
      process.env.CLIENT_SECRET,
      process.env.DEL_API_KEY,
      process.env.DISCORDBOTLIST,
      process.env.DISCORDLISTOLOGY,
      process.env.INFINITY_API_TOKEN,
      process.env.KEY_TO_MOTION,
      process.env.MAIN_DLS_API_KEY,
      process.env.SECRET,
      process.env.SERVICES_API_KEY,
      process.env.TEST_VOTE_WEBHOOK_TOKEN,
      process.env.TOPGG_API_KEY,
      process.env.VOTE_WEBHOOK_TOKEN,
      process.env.WEBHOOK_AUTH,
      process.env.PAT,
    ];

    result
      .then(async (result) => {
        if (typeof result !== "string")
          result = util.inspect(result, { depth: 0 });

        for (const term of secrets) {
          if (
            (result.includes(term) && term != undefined) ||
            (result.includes(term) && term != null)
          )
            result = result.replace(term, "[SECRET]");
        }
        if (result.length > 2000) {
          const buffer = Buffer.from(result);
          var attachment = new MessageAttachment(buffer, "evaluated.js");
          return await message.reply({
            content:
              "The result is too long to show on Discord, so here's a file.",
            files: [attachment],
          });
        }
        const evaluated_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Evaluation")
          .setDescription(
            `Successful Evaluation.\n\nOutput:\n\`\`\`js\n${result}\n\`\`\``
          )
          .setTimestamp();
        try {
          await message.reply({ embeds: [evaluated_embed] });
        } catch (e) {
          return;
        }
      })
      .catch(async (result) => {
        if (typeof result !== "string")
          result = util.inspect(result, { depth: 0 });

        for (const term of secrets) {
          if (
            (result.includes(term) && term != undefined) ||
            (result.includes(term) && term != null)
          )
            result = result.replace(term, "[SECRET]");
        }

        const error_embed = new MessageEmbed()
          .setColor(colors.red)
          .setTitle("Error Evaluating")
          .setDescription(
            `An error occurred.\n\nError:\n\`\`\`js\n${result}\n\`\`\``
          )
          .setTimestamp();
        try {
          await message.reply({ embeds: [error_embed] });
        } catch (e) {
          return;
        }
      });
  },
};
