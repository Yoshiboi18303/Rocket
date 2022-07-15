const Guilds = require("../schemas/guildSchema");
const Users = require("../schemas/userSchema");
const Warnings = require("../schemas/warningSchema");
const { Permissions, MessageEmbed, Message } = require("discord.js");
const fs = require("fs/promises");
const wait = require("util").promisify(setTimeout);
var cooldowns = [];
const colors = require("../colors.json");
const LoggerClass = require("../classes/Logger");
const Logger = new LoggerClass();
const config = require("../config.json");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   */
  async execute(message) {
    const parser = await import("parse-ms");
    if (!message.guild) return;
    if (message.channel.name.includes(`ticket-${message.guild.id}-`)) {
      if (message.author.id == client.user.id) return;
      fs.appendFile(
        `tickets/${message.guild.id}/${message.channel.id}.txt`,
        `${message.author.username}: ${
          message.content != "" ? message.content : "Empty Message"
        }\n`
      );
    }
    if (message.author.bot) return;
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var User = await Users.findOne({ id: message.author.id });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
    }
    var currentDate = new Date(Date.now());
    // console.log(message.guild.id == config.thirdTestServer + "\n" + message.content == "@someone")
    if (currentDate.getMonth() == 3 && currentDate.getDate() == 1) {
      if (message.content == "@someone") {
        var members = [];
        message.guild.members.cache.forEach((member) => {
          if (member.user.id != message.author.id) members.push(member);
        });
        var member = members[Math.floor(Math.random() * members.length)];
        await message.channel.send({
          content: `<@${member.user.id}> ||(blame ${message.member.displayName}, not me)||`,
        });
        return await message.delete();
      }
    }
    if (
      (message.content.startsWith("http") ||
        message.content.startsWith("https") ||
        message.content.includes("http") ||
        message.content.includes("https")) &&
      Guild.filters.links.on &&
      !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])
    ) {
      switch (Guild.filters.links.action) {
        case 1:
          message.delete().catch(async () => {
            const deleteFailedEmbed = new MessageEmbed()
              .setColor(colors.red)
              .setDescription(
                "❌ I couldn't delete the message, do I have the Manage Messages permission in this channel? ❌"
              );
            await message.channel
              .send({
                embeds: [deleteFailedEmbed],
              })
              .catch(() => {});
          });
          break;
        case 2:
          message
            .delete()
            .then(async (msg) => {
              var Data = await Warnings.findOne({
                user: msg.author.id,
                guild: msg.guild.id,
              });
              if (!Data) {
                Data = new Warnings({
                  user: msg.author.id,
                  guild: msg.guild.id,
                  context: [
                    {
                      moderator: client.user.id,
                      reason: "Posted a link",
                      severity: "LOW",
                    },
                  ],
                });
              } else {
                Data.context.push({
                  moderator: client.user.id,
                  reason: "Posted a link",
                  severity: "LOW",
                });
              }
              Data.save();
            })
            .catch(async () => {
              const deleteFailedEmbed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ I couldn't delete the message, do I have the Manage Messages permission in this channel? ❌"
                );
              await message.channel
                .send({
                  embeds: [deleteFailedEmbed],
                })
                .catch(() => {});
            });
          break;
      }
      await message.channel.send({
        content: `<@${message.author.id}> Don't send links!`,
      });
    } else if (message.mentions && Guild.filters.mentions.on) {
      switch (Guild.filters.mentions.action) {
        case 1:
          message.delete().catch(async () => {
            const deleteFailedEmbed = new MessageEmbed()
              .setColor(colors.red)
              .setDescription(
                "❌ I couldn't delete the message, do I have the Manage Messages permission in this channel? ❌"
              );
            await message.channel
              .send({
                embeds: [deleteFailedEmbed],
              })
              .catch(() => {});
          });
          break;
        case 2:
          message
            .delete()
            .then(async (msg) => {})
            .catch(async () => {
              const deleteFailedEmbed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ I couldn't delete the message, do I have the Manage Messages permission in this channel? ❌"
                );
              await message.channel
                .send({
                  embeds: [deleteFailedEmbed],
                })
                .catch(() => {});
            });
          break;
      }
    }
    var prefix = Guild.prefix;
    if (message.content == `<@${client.user.id}>`) {
      const pinged_embed = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription(
          `Hello <@${message.author.id}>, thanks for pinging me! Here's some helpful info!\n\n**My prefix in this guild:** \`${prefix}\`\n**See all commands:** \`${prefix}help\`\n**Invite the bot:** [Click me!](https://discord.com/oauth2/authorize?client_id=971841942998638603&permissions=412421053440&scope=bot)`
        )
        .setTimestamp();
      return await message.reply({
        embeds: [pinged_embed],
      });
    }
    var content = message.content;
    if (!content.startsWith(prefix)) return;
    const args = content.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    if (
      !message.guild.me.permissions.has([
        Permissions.FLAGS.VIEW_CHANNEL,
        Permissions.FLAGS.SEND_MESSAGES,
      ])
    ) {
      try {
        return await message.author.send({
          content:
            "My permissions are too low for me to be able to send messages!",
        });
      } catch (e) {
        return;
      }
    }

    const cmd = client.commands.get(command) || client.aliases.get(command);
    if (!cmd && Guild.unknownCommandMessage) {
      const unknown_command_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(`❌ Command **\`${command}\`** not found! ❌`)
        .setTimestamp();
      return await message.reply({
        embeds: [unknown_command_embed],
      });
    } else if (!cmd && !Guild.unknownCommandMessage) return;
    var cooldown = command.cooldown;
    var supportServer = client.guilds.cache.get("977632347862216764");
    if (cooldowns.some((cd) => cd.user == message.author.id)) {
      var timedOut = cooldowns.find((cd) => cd.user == message.author.id);
      var formula = cooldown - (new Date().getTime() - timedOut.startedAt);
      var parsed = parser.default(formula);
      const cooldownMessages = [
        "Out Of Fuel",
        "Low Fuel",
        "Calm It",
        "Way Too Salty",
      ];
      const cooldownMessage =
        cooldownMessages[Math.floor(Math.random() * cooldownMessages.length)];
      const onCooldownEmbed = new MessageEmbed()
        .setColor(colors.orange)
        .setTitle(`${cooldownMessage}`)
        .setDescription(
          `You're still on cooldown, you can run this command in \`${parsed.minutes}\` minutes and \`${parsed.seconds}\` seconds`
        )
        .setTimestamp(Date.now() + cooldown);
      return await message.reply({
        embeds: [onCooldownEmbed],
      });
    }
    var Testing = cmd.testing;
    if (!Testing) Testing = false;
    if (Testing) {
      if (
        message.guild.id != config.testServerId &&
        message.guild.id != config.secondTestServer &&
        message.guild.id != config.thirdTestServer
      )
        return await message.reply({
          content: `This command is restricted to the testing server(s) (**\`${
            client.guilds.cache.get(config.testServerId)?.name
          }\`, \`${
            client.guilds.cache.get(config.secondTestServer)?.name
          }\` & \`${
            client.guilds.cache.get(config.thirdTestServer)?.name
          }\`**) for the moment!`,
        });
    }
    var OwnerOnly = cmd.ownerOnly;
    if (OwnerOnly == undefined || OwnerOnly == null) OwnerOnly = false;
    if (OwnerOnly) {
      if (message.author.id != config.owner)
        return await message.reply({
          content: "You aren't the owner of the bot!",
        });
    }
    if (cmd.nsfw == true) {
      if (!message.channel.nsfw)
        return await message.reply({
          content: "This channel isn't an NSFW channel!",
        });
    }
    if (cmd.userPermissions?.length > 0) {
      if (!message.member.permissions.has(cmd.userPermissions)) {
        var userPermissions = new Permissions();
        for (var bigint of cmd.userPermissions) {
          userPermissions.add(bigint);
        }
        return await message.reply({
          content: `You don't have the required permissions to use this command!\n\n**Required Permissions:**\n\`\`\`\n${userPermissions
            .toArray()
            .join(", ")}\n\`\`\``,
        });
      }
    }
    if (cmd.clientPermissions?.length > 0) {
      if (!message.guild.me.permissions.has(cmd.clientPermissions)) {
        var clientPermissions = new Permissions();
        for (var bigint of cmd.clientPermissions) {
          clientPermissions.add(bigint);
        }
        return await message.reply({
          content: `I don't have the required permissions to be able to run this command!\n\n**Required Permissions:**\n\`\`\`\n${clientPermissions
            .toArray()
            .join(", ")}\n\`\`\``,
        });
      }
    }
    if (User.blacklisted == true) {
      const blacklisted_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ You are blacklisted from the bot! ❌");
      return await message.reply({
        embeds: [blacklisted_embed],
      });
    }
    if (cmd.voteOnly) {
      if (!User.voted) {
        const voteBotEmbed = new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `❌ You haven't voted for the bot yet! Try running \`${prefix}vote\` to get some links! ❌`
          );
        return await message.reply({
          embeds: [voteBotEmbed],
        });
      }
    }
    await Users.findOneAndUpdate(
      {
        id: message.author.id,
      },
      {
        $inc: {
          commandsUsed: 1,
        },
      }
    ).then((data) => data.save());
    statcord.postCommand(cmd.name, message.author.id);
    try {
      await cmd.execute(message, args);
      Logger.success(
        `Command ${cmd.name.replace(
          cmd.name[0],
          cmd.name[0].toUpperCase()
        )} executed!`
      );
    } catch (e) {
      Logger.error(e, false);
      var logChannel = supportServer.channels.cache.get("981617877092298853");
      const errorEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setTitle("An Error Occurred")
        .setDescription(
          `An error occurred in **${message.guild.name}** with the \`${cmd.name}\` command.`
        )
        .addField(`Error`, `\`\`\`\n${`${e}`.slice(0, 1024)}\n\`\`\``);
      logChannel.send({
        content: `<@${config.owner}>`,
        embeds: [errorEmbed],
      });
      return await message.reply({
        content: `Sorry, this command ran into an error. This has been sent to the developers.\n\n**Error:** ||${`${e}`.slice(
          0,
          2000
        )}||`,
      });
    }
    const cooldownObject = {
      user: message.author.id,
      startedAt: new Date().getTime(),
    };
    cooldowns.push(cooldownObject);
    wait(cooldown).then(() =>
      cooldowns.splice(
        cooldowns.findIndex((c) => c.user == message.author.id),
        1
      )
    );
  },
};
