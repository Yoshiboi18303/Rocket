const Guilds = require("../schemas/guildSchema");
const {
  Permissions,
  Message,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "setuptickets",
  description: "Setup the ticket system!",
  usage:
    '{prefix}setuptickets <channel mention | channel id> <modrole> [category id ("none" if you don\'t want this)] [message]',
  aliases: ["tickets", "setupticket", "ticketsetup"],
  type: "Utility",
  cooldown: ms("5s"),
  userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
  clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
  testing: false,
  ownerOnly: false,
  nsfw: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    var modrole =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    var parent = args[2];
    if (!parent || parent.toLowerCase() == "none") parent = "";
    var msg =
      args.slice(3).join(" ") || "Click the button below to open a ticket!";
    if (!channel) {
      const invalid_channel_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ That's not a valid channel in this server! ❌");
      return await message.reply({
        embeds: [invalid_channel_embed],
      });
    }
    if (!modrole) {
      const invalid_role_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ That's not a valid role in this server! ❌");
      return await message.reply({
        embeds: [invalid_role_embed],
      });
    }
    if (channel.type != "GUILD_TEXT") {
      const bad_type_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Sorry, that's not a text channel! ❌");
      return await message.reply({
        embeds: [bad_type_embed],
      });
    }
    var parentExists = false;
    if (parent == "") parentExists = true;
    if (parent != "") {
      message.guild.channels.cache
        .filter((channel) => channel.type == "GUILD_TEXT")
        .each((channel) => {
          if (channel.parentId == parent) return (parentExists = true);
        });
    }
    if (!parentExists) {
      const invalidParentEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's not a valid category! ❌\n\n**ℹ️ Pro tip: This argument works by checking every text channel and reading its parent, if you haven't already, please create a text channel in that category then try again (also make sure you gave me the ID of that category). ℹ️**"
        );
      return await message.reply({
        embeds: [invalidParentEmbed],
      });
    }
    if (
      !message.guild.me
        .permissionsIn(channel)
        .has([Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES])
    ) {
      const bad_permissions_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Sorry! I can't view and/or send messages in that channel! ❌"
        );
      return await message.reply({
        embeds: [bad_permissions_embed],
      });
    }
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    const openTicketEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Ticket System")
      .setDescription(`${msg}`)
      .setFooter({
        text: `System Provided by ${client.user.username}`,
        iconURL: `${client.user.displayAvatarURL({ format: "png" })}`,
      })
      .setTimestamp();
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Open Ticket")
        .setCustomId("ticket-open")
    );
    var ticketMessage = await channel.send({
      embeds: [openTicketEmbed],
      components: [row],
    });
    Guilds.findOneAndUpdate(
      {
        id: message.guild.id,
      },
      {
        $set: {
          ticketSettings: {
            modRole: modrole.id,
            msgChannel: channel.id,
            parent,
            message: ticketMessage.id,
          },
        },
      }
    ).then((data) => data.save());
    const sentEmbed = new MessageEmbed()
      .setColor(colors.green)
      .setDescription(
        `✅ Your ticket system has been set up in <#${channel.id}>! ✅`
      );
    await message.reply({
      embeds: [sentEmbed],
    });
  },
};
