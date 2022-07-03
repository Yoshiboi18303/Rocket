const LoggerClass = require("../classes/Logger");
const Guilds = require("../schemas/guildSchema");
const Logger = new LoggerClass();
const {
  Client,
  Guild,
  MessageEmbed,
  GuildMember,
  DMChannel,
  GuildChannel,
} = require("discord.js");

/**
 * The logger used for the bot.
 * @param {Client} client - The DiscordJS Client to use.
 * @param {Guild} guild - The Guild to use.
 * @param {Number} action - The action that was taken.
 * @param {Object} data - The extra data.
 * @param {GuildMember} data.member - Guild member.
 * @param {String} data.reason - The reason for this action.
 * @param {GuildMember} data.moderator - The moderator for the action.
 * @param {String} data.message - A message.
 * @param {String} data.oldMessage - The old message from the author
 * @param {String} data.newMessage - The new message from the author
 * @param {DMChannel | GuildChannel} data.channel
 * @param {Number} data.messages
 */
module.exports = async (client, guild, action, data) => {
  const em = new MessageEmbed()
    .setTitle(`${client.user.username} Logger`)
    .setAuthor({
      name: `${client.user.username}`,
      iconURL: `${client.user.displayAvatarURL({ format: "png" })}`,
    })
    .setTimestamp();

  switch (action) {
    case Enum.Log.Info:
      em.setDescription(`A message from the developer has been recieved!`)
        .addField(`Message`, `**${data.message}**`)
        .setColor(colors.blue);
      break;

    case Enum.Log.Error:
      em.setDescription(
        `An error has occurred while using ${
          client.user.username != undefined && client.user.username != null
            ? client.user.username
            : "Rocket"
        } in **${guild.name}**.`
      )
        .addField(`Error`, `**${data.message}**`)
        .setColor(colors.dred);
      break;

    case Enum.Log.Kick:
      em.setDescription(`A member has been kicked from **${guild.name}**.`)
        .addField(`Member Kicked`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.yellow);
      break;

    case Enum.Log.Ban:
      em.setDescription(`A member has been banned from **${guild.name}**.`)
        .addField(`Member Banned`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.red);
      break;

    case Enum.Log.Mute:
      em.setDescription(`A member has been muted in **${guild.name}**.`)
        .addField(`Member Muted`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.navy);
      break;

    case Enum.Log.Softban:
      em.setDescription(`A member has been softbanned from **${guild.name}**.`)
        .addField(`Member Softbanned`, `**<@${data.member.id}>**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `**${data.reason}**`, true)
        .setColor(colors.red);
      break;

    case Enum.Log.Tempban:
      em.setDescription(`A member has been tempbanned from **${guild.name}**.`)
        .addField(`Member Tempbanned`, `**${data.member.user.tag}**`, true)
        .addField(`Acting Moderator`, `**<@${data.moderator.id}>**`, true)
        .addField(`Reason`, `\`${data.reason}\``, true)
        .setColor(colors.red);
      break;

    case Enum.Log.Warn:
      em.setDescription(`A member was warned here in **${guild.name}**.`)
        .addFields([
          {
            name: "Member Warned",
            value: `**${data.member.user.tag}** (<@${data.member.user.id}>)`,
            inline: true,
          },
          {
            name: "Acting Moderator",
            value: `**${data.moderator.user.tag}** (<@${data.moderator.user.id}>)`,
            inline: true,
          },
          {
            name: "Reason",
            value: `\`${data.reason}\``,
            inline: true,
          },
        ])
        .setColor(colors.yellow);
      break;
    case Enum.Log.MessageEdit:
      em.setDescription(
        `A message from ${data?.member?.user || "Unknown User"} was edited.`
      )
        .addFields([
          {
            name: "Old Message",
            value: `${
              data.oldMessage?.length > 1024
                ? data.oldMessage.slice(0, 1021) + "..."
                : data.oldMessage || "*Undefined/Unknown Message*"
            }`,
            inline: true,
          },
          {
            name: "New Message",
            value: `${data.newMessage}`,
            inline: true,
          },
        ])
        .setColor(colors.yellow);
      break;
    case Enum.Log.MessageDelete:
      em.setDescription(`A message from <@${data.member.user.id}> was deleted`)
        .addField(
          "Message",
          `${data.message.length > 0 ? data.message : "*Unknown Message*"}`,
          true
        )
        .setColor(colors.red);
      break;
    case Enum.Log.ChannelCreate:
      if (!(data.channel instanceof GuildChannel))
        throw new TypeError(
          `Expected data.channel to be a type of GuildChannel, got ${typeof data.channel} instead.`.red
        );
      em.setDescription(`A channel here in **${guild.name}** was created.`)
        .addField("Channel", `<#${data.channel.id}>`, true)
        .setColor(colors.cyan);
      break;
    case Enum.Log.ChannelDelete:
      em.setDescription(`A channel here in **${guild.name}** was deleted.`)
        .addField("Channel", `${data.channel.name}`, true)
        .setColor(colors.red);
      break;
    case Enum.Log.Purge:
      em.setDescription(`<#${data.channel.id}> had some messages purged.`)
        .addFields([
          {
            name: "Purger",
            value: `${data.moderator.user.tag} (<@${data.moderator.user.id}>)`,
            inline: true,
          },
          {
            name: "Amount Purged",
            value: `\`${data.messages}\` messages`,
            inline: true,
          },
        ])
        .setColor(colors.dred);
      break;
  }

  var queue = [];

  if (action == Enum.Log.Error) {
    var supportServer = client.guilds.cache.get("977632347862216764");
    supportServer.channels.cache.get("981617877092298853").send({
      embeds: [em],
    });
  }
  if (action != Enum.Log.Info) {
    var Guild = await Guilds.findOne({ id: guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: guild.id,
      });
      Guild.save();
    }
    var logChannel = client.channels.cache.get(Guild.logChannel);
    if (!logChannel) return;
    await logChannel.send({
      embeds: [em],
    });
    return console.log("Guild-specific log sent!".green);
  }
  var guilds = await Guilds.find({});
  guilds = guilds.filter((guild) => guild.logChannel != "");
  for (var g of guilds) {
    var newLength = queue.push(client.channels.cache.get(g.logChannel));
    Logger.success(`Item number ${newLength} added to the array.`);
  }
  Logger.log("Sending first message...");
  await queue[0].send({
    embeds: [em],
  });
  queue.shift();
  setInterval(async () => {
    if (queue.length <= 0) return;
    console.log("Sending next message...".yellow);
    await queue[0].send({
      embeds: [em],
    });
    queue.shift();
  }, 5000);
};
