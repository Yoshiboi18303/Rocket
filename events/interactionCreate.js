const Guilds = require("../schemas/guildSchema");
const {
  Interaction,
  Permissions,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const moment = require("moment");
const fs = require("fs/promises");
const shell = require("shelljs");

module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {Interaction} interaction
   */
  execute: async (interaction) => {
    var guild = interaction.guild;
    var followUp = interaction.replied || interaction.deferred;
    var ticketChannel;
    if (interaction.isButton()) {
      var Guild = await Guilds.findOne({ id: guild.id });
      if (!Guild) {
        Guild = new Guilds({
          id: guild.id,
        });
        Guild.save();
      }
      var settings = Guild.ticketSettings;
      if (interaction.customId == "ticket-open") {
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
        ticketChannel = await guild.channels.create(
          `ticket-${guild.id}-${Guild.ticketsOpened + 1}`,
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
              },
              {
                id: guild.me,
                allow: [
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.SEND_MESSAGES,
                  Permissions.FLAGS.READ_MESSAGE_HISTORY,
                ],
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
        const openedEmbed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle("New Ticket")
          .setDescription(
            `Your ticket has been opened, please wait until a staff member claims your ticket!`
          )
          .setTimestamp();

        const ticketActionsRow = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Claim")
            .setCustomId("claim-ticket"),
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("View Transcript")
            .setCustomId("ticket-transcript"),
          new MessageButton()
            .setStyle("DANGER")
            .setLabel("Close Ticket")
            .setCustomId("close-ticket")
        );

        openedMsg = await ticketChannel.send({
          content: `<@&${modRole.id}>`,
          embeds: [openedEmbed],
          components: [ticketActionsRow],
        });
        fs.appendFile(
          `tickets/${guild.id}/${ticketChannel.id}.txt`,
          `The ticket was opened at ${moment(openedMsg.createdTimestamp).format(
            "HH:MM:SS"
          )} on ${moment(openedMsg.createdTimestamp).format("MM/DD/YYYY")}\n`
        )
          .then(() => console.log("File created.".green))
          .catch(async () => {
            shell.exec(`cd tickets && mkdir ${guild.id}`);
            await fs.appendFile(
              `tickets/${guild.id}/${ticketChannel.id}.txt`,
              `The ticket was opened at ${moment(
                openedMsg.createdTimestamp
              ).format("HH:MM:SS")} on ${moment(
                openedMsg.createdTimestamp
              ).format("MM/DD/YYYY")}\n`
            );
            console.log("Directory and file created.".green);
          });
        await interaction.reply({
          content: `Your ticket was opened in <#${ticketChannel.id}>!`,
          ephemeral: true,
        });
      } else if (interaction.customId == "claim-ticket") {
        if (
          !(typeof interaction.member.roles == "array"
            ? interaction.member.roles.includes(settings.modRole)
            : interaction.member.roles.cache.has(settings.modRole))
        )
          return await interaction.reply({
            content: "You can't use this button!",
            ephemeral: true,
          });
        var claimedTimestamp = Date.now();
        fs.appendFile(
          `tickets/${guild.id}/${interaction.channel.id}.txt`,
          `The ticket was claimed by ${interaction.user.username} at ${moment(
            claimedTimestamp
          ).format("HH:MM:SS")} on ${moment(claimedTimestamp).format(
            "MM/DD/YYYY"
          )}\n`
        );
        const claimedEmbed = new MessageEmbed()
          .setColor(colors.cyan)
          .setDescription(
            `Your ticket was claimed by **${interaction.user.username}** and they will assist you from here-on.`
          )
          .setTimestamp();
        await interaction.channel.send({
          embeds: [claimedEmbed],
        });
        await interaction.reply({
          content: "You have sucessfully claimed this ticket!",
          ephemeral: true,
        });
      } else if (interaction.customId == "ticket-transcript") {
        const transcript_link_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setDescription(
            `You can view the partially done transcript **[here](https://${config.origin}/tickets/${guild.id}/${interaction.channel.id})**!`
          );
        await interaction.reply({
          embeds: [transcript_link_embed],
        });
      } else if (interaction.customId == "close-ticket") {
        var closedTimestamp = Date.now();
        const closedEmbed = new MessageEmbed()
          .setColor(colors.dred)
          .setTitle("Ticket Closed")
          .setDescription(
            `This ticket has been closed and this channel will be deleted in 30 seconds to conserve channel space in this server.\n\nYou can view the full transcript of this ticket **[here](https://${config.origin}/tickets/${guild.id}/${interaction.channel.id})**!`
          );
        await interaction.channel.send({
          embeds: [closedEmbed],
        });
        await interaction.reply({
          content: "Ticket successfully closed.",
          ephemeral: true,
        });
        var id = interaction.channel.id;
        fs.appendFile(
          `tickets/${guild.id}/${id}.txt`,
          `The ticket was closed at ${moment(closedTimestamp).format(
            "HH:MM:SS"
          )} on ${moment(closedTimestamp).format("MM/DD/YYYY")}\n`
        );
        setTimeout(async () => {
          await interaction.channel.delete("Ticket Closed.");
          fs.unlink(`tickets/${guild.id}/${id}.txt`)
            .then(() => console.log("Transcript file deleted!".green))
            .catch(() =>
              console.log("Failed to delete the transcript file.".red)
            );
        }, 30000);
      }
    }
  },
};
