const Guilds = require("../schemas/guildSchema");
const { Interaction, Permissions } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {Interaction} interaction
   */
  execute: async (interaction) => {
    var guild = interaction.guild;
    var followUp = interaction.replied || interaction.deferred;
    if (interaction.isButton()) {
      if (interaction.customId == "ticket-open") {
        var Guild = await Guilds.findOne({ id: guild.id });
        if (!Guild) {
          Guild = new Guilds({
            id: guild.id,
          });
          Guild.save();
        }
        var settings = Guild.ticketSettings;
        if (!guild.available) {
          if (followUp) {
            return await interaction.followUp({
              content:
                "The guild isn't available to me so I can't open a ticket for you! Try again later!",
              ephemeral: true,
            });
          } else {
            return await interaction.reply({
              content:
                "The guild isn't available to me so I can't open a ticket for you! Try again later!",
              ephemeral: true,
            });
          }
        }
        var modRole = guild.roles.cache.get(settings.modRole);
        var ticketChannel = await guild.channels.create(
          `ticket-${Guild.ticketsOpened + 1}`,
          {
            topic: `Opened by **${interaction.user.username}**. Powered by ${client.user.username}!`,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.SEND_MESSAGES,
                  Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ],
              },
              {
                id: modRole,
                allow: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.SEND_MESSAGES,
                  Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ],
              },
              {
                id: interaction.user,
                allow: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.SEND_MESSAGES,
                  Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ],
                deny: [Permissions.FLAGS.MANAGE_CHANNEL],
              },
            ],
            reason: "Opening a ticket for a user.",
          }
        );
        Guilds.findOneAndUpdate(
          {
            id: guild.id,
          },
          {
            $inc: {
              ticketsOpened: 1,
            },
          }
        ).then((data) => data.save());
      }
    }
  },
};
