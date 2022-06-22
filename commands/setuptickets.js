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
    "{prefix}setuptickets <channel mention | channel id> <modrole> [message]",
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
    var msg =
      args.slice(2).join(" ") || "Click the button below to open a ticket!";
    if (!channel) {
      const invalid_channel_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's not a valid channel in this server (please make sure it's in this server)! ❌"
        );
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
            parent: "",
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
