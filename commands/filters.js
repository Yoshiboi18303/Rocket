const {
  Message,
  Permissions,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  Interaction,
  MessageEmbed,
} = require("discord.js");
const Guilds = require("../schemas/guildSchema");

module.exports = {
  name: "filters",
  description: "View or set your moderation filters!",
  usage: "{prefix}filters",
  aliases: ["modfilters"],
  type: "Moderation",
  cooldown: ms("5s"),
  userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
  clientPermissions: [],
  testing: false,
  ownerOnly: false,
  nsfw: false,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var filters = Guild.filters;
    const choosingEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Moderation Filters")
      .setDescription(
        `Here are the moderation filters for **${
          message.guild.name
        }**!\n\n**Language Filter:** ${
          filters.language.on ? "✅" : "❌"
        }\n**Link Filter:** ${
          filters.links.on ? "✅" : "❌"
        }\n**Excessive Mention Filter:** ${
          filters.mentions.on ? "✅" : "❌"
        }\n**Ghost Ping Filter:** ${filters.ghostPings.on ? "✅" : "❌"}`
      )
      .setFooter({
        text: "Use the context menu below to change these values!",
      })
      .setTimestamp();
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setMinValues(1)
        .setMaxValues(1)
        .setDisabled(false)
        .setCustomId("filters")
        .addOptions([
          {
            label: "Language",
            value: "language",
            description: "Change the status of the language filter",
          },
          {
            label: "Links",
            value: "links",
            description: "Change the status of the link filter",
          },
          {
            label: "Mentions",
            value: "mentions",
            description: "Change the status of the excessive mentions filter",
          },
          {
            label: "Ghost Pings",
            value: "ghostpings",
            description: "Change the status of the ghost pings filter",
          },
        ])
        .setPlaceholder("Please choose a filter to change")
    );
    const disableRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("I'm Done")
        .setCustomId("done")
    );
    var msg = await message.reply({
      embeds: [choosingEmbed],
      components: [disableRow, row],
    });

    /**
     * @param {Interaction} interaction
     */
    const filter = async (interaction) => {
      if (interaction.user.id != message.author.id)
        return await interaction.reply({
          content: "This isn't yours!",
          ephemeral: true,
        });
      return true;
    };

    const collector = msg.createMessageComponentCollector({
      filter,
    });

    collector.on("collect", async (collected) => {
      var followUp = collected.replied || collected.deferred;
      if (collected.isButton()) {
        collector.stop();
        disableRow.components.forEach((component) => {
          component.setDisabled(true);
        });
        row.components.forEach((component) => {
          component.setDisabled(true);
        });
        await msg.edit({
          components: [disableRow, row],
        });
        if (followUp) {
          await collected.followUp({
            content: "All right! Thanks for running the command!",
            ephemeral: true,
          });
        } else {
          await collected.reply({
            content: "All right! Thanks for running the command!",
            ephemeral: true,
          });
        }
      } else {
        // console.log(collected)
        var object = {
          language: "Language",
          mentions: "Excessive Mentions",
          links: "Links",
          ghostpings: "Ghost Pings",
        };
        const chooseSettingEmbed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`Statuses for the ${object[collected.values[0]]} filter`)
          .setDescription("Here are your statuses!");

        const settingsRow = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setDisabled(false)
            .setCustomId("settings")
            .addOptions([
              {
                label: "Status",
                value: "status",
                description: "Change whether the filter is on or not.",
              },
              {
                label: "Action",
                value: "action",
                description:
                  "Change what the bot does when a person violates the filter.",
              },
            ])
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder("Please choose a setting")
        );

        switch (collected.values[0]) {
          case "language":
            chooseSettingEmbed.description += `\n\n**On:** ${
              filters.language.on ? "Yes" : "No"
            }\n**Action:** ${Enum.Actions[filters.language.action]}`;
            break;
          case "links":
            chooseSettingEmbed.description += `\n\n**On:** ${
              filters.links.on ? "Yes" : "No"
            }\n**Action:** ${Enum.Actions[filters.links.action]}`;
            break;
          case "mentions":
            chooseSettingEmbed.description += `\n\n**On:** ${
              filters.mentions.on ? "Yes" : "No"
            }\n**Action:** ${Enum.Actions[filters.mentions.action]}`;
            break;
          case "ghostpings":
            chooseSettingEmbed.description += `\n\n**On:** ${
              filters.ghostPings.on ? "Yes" : "No"
            }\n**Action:** ${Enum.Actions[filters.ghostPings.action]}`;
            break;
        }

        var filter = collected.values[0];

        if (followUp) {
          var int = await collected.followUp({
            embeds: [chooseSettingEmbed],
            components: [settingsRow],
            ephemeral: true,
            fetchReply: true,
          });
        } else {
          var int = await collected.reply({
            embeds: [chooseSettingEmbed],
            components: [settingsRow],
            ephemeral: true,
            fetchReply: true,
          });
        }

        var settingCollector = int.createMessageComponentCollector();

        // console.log(settingCollector)

        settingCollector.on("collect", async (collected) => {
          followUp = collected.replied || collected.deferred;
          switch (collected.values[0]) {
            case "status":
              const statusEmbed = new MessageEmbed()
                .setColor(colors.cyan)
                .setTitle(`Status Change for the ${object[filter]} filter`)
                .setDescription(
                  "Please use this final select menu to change the status of the filter."
                );
              var statusRow = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setDisabled(false)
                  .setCustomId("statuses")
                  .setMinValues(1)
                  .setMaxValues(1)
                  .addOptions([
                    {
                      label: "On",
                      value: "on",
                    },
                    {
                      label: "Off",
                      value: "off",
                    },
                  ])
                  .setPlaceholder("Please choose a status")
              );
              if (followUp) {
                int = await collected.followUp({
                  embeds: [statusEmbed],
                  components: [statusRow],
                  ephemeral: true,
                  fetchReply: true,
                });
              } else {
                int = await collected.reply({
                  embeds: [statusEmbed],
                  components: [statusRow],
                  ephemeral: true,
                  fetchReply: true,
                });
              }

              var statusCollector = int.createMessageComponentCollector();

              statusCollector.on("collect", async (collected) => {
                followUp = collected.replied || collected.deferred;
                switch (collected.values[0]) {
                  case "on":
                    switch (filter) {
                      case "language":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: {
                                on: true,
                                action: filters.language.action,
                              },
                              links: filters.links,
                              mentions: filters.mentions,
                              ghostPings: filters.ghostPings,
                            },
                          }
                        ).then((data) => data.save());
                        break;
                      case "links":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: filters.language,
                              links: {
                                on: true,
                                action: filters.links.action,
                              },
                              mentions: filters.mentions,
                              ghostPings: filters.ghostPings,
                            },
                          }
                        ).then((data) => data.save());
                        break;
                      case "mentions":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: filters.language,
                              links: filters.links,
                              mentions: {
                                on: true,
                                action: filters.mentions.action,
                              },
                              ghostPings: filters.ghostPings,
                            },
                          }
                        ).then((data) => data.save());
                        break;
                      case "ghostpings":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: filters.language,
                              links: filters.links,
                              mentions: filters.mentions,
                              ghostPings: {
                                on: true,
                                action: filters.ghostPings.action,
                              },
                            },
                          }
                        ).then((data) => data.save());
                        break;
                    }
                    var extraObject = {
                      language: "language",
                      links: "links",
                      mentions: "mentions",
                      ghostpings: "ghostPings",
                    };
                    if (followUp) {
                      await collected.followUp({
                        content: `Status of the **${
                          object[filter]
                        }** filter has been changed from \`${
                          filters[extraObject[filter]].on ? "On" : "Off"
                        }\` to \`On\`!`,
                        ephemeral: true,
                      });
                    } else {
                      await collected.reply({
                        content: `Status of the **${
                          object[filter]
                        }** filter has been changed from \`${
                          filters[extraObject[filter]].on ? "On" : "Off"
                        }\` to \`On\`!`,
                        ephemeral: true,
                      });
                    }
                    break;
                  case "off":
                    switch (filter) {
                      case "language":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: {
                                on: false,
                                action: filters.language.action,
                              },
                              links: filters.links,
                              mentions: filters.mentions,
                              ghostPings: filters.ghostPings,
                            },
                          }
                        ).then((data) => data.save());
                        break;
                      case "links":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: filters.language,
                              links: {
                                on: false,
                                action: filters.links.action,
                              },
                              mentions: filters.mentions,
                              ghostPings: filters.ghostPings,
                            },
                          }
                        ).then((data) => data.save());
                        break;
                      case "mentions":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: filters.language,
                              links: filters.links,
                              mentions: {
                                on: false,
                                action: filters.mentions.action,
                              },
                              ghostPings: filters.ghostPings,
                            },
                          }
                        ).then((data) => data.save());
                        break;
                      case "ghostpings":
                        Guilds.findOneAndUpdate(
                          {
                            id: message.guild.id,
                          },
                          {
                            $set: {
                              language: filters.language,
                              links: filters.links,
                              mentions: filters.mentions,
                              ghostPings: {
                                on: false,
                                action: filters.ghostPings.action,
                              },
                            },
                          }
                        ).then((data) => data.save());
                        break;
                    }
                    var extraObject = {
                      language: "language",
                      links: "links",
                      mentions: "mentions",
                      ghostpings: "ghostPings",
                    };
                    if (followUp) {
                      await collected.followUp({
                        content: `Status of the **${
                          object[filter]
                        }** filter has been changed from \`${
                          filters[extraObject[filter]].on ? "On" : "Off"
                        }\` to \`Off\`!`,
                        ephemeral: true,
                      });
                    } else {
                      await collected.reply({
                        content: `Status of the **${
                          object[filter]
                        }** filter has been changed from \`${
                          filters[extraObject[filter]].on ? "On" : "Off"
                        }\` to \`Off\`!`,
                        ephemeral: true,
                      });
                    }
                    break;
                }
              });
              break;
            case "action":
              const changeActionEmbed = new MessageEmbed()
                .setColor(colors.cyan)
                .setTitle(`Action Change for the ${object[filter]} filter`)
                .setDescription(
                  "Please use this final select menu to change the action of this filter."
                );
              const actionsRow = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                  .setDisabled(false)
                  .setCustomId("actions")
                  .setMinValues(1)
                  .setMaxValues(1)
                  .addOptions([
                    {
                      label: "None",
                      value: "0",
                      description: "Don't do anything",
                    },
                    {
                      label: "Delete Message",
                      value: "1",
                      description: "Delete the message from the member",
                    },
                    {
                      label: "Delete Message and Warn Member",
                      value: "2",
                      description:
                        "Delete the message and then warn the member.",
                    },
                  ])
                  .setPlaceholder("Please choose an action")
              );
              if (followUp) {
                int = await collected.followUp({
                  embeds: [changeActionEmbed],
                  components: [actionsRow],
                  ephemeral: true,
                  fetchReply: true,
                });
              } else {
                int = await collected.reply({
                  embeds: [changeActionEmbed],
                  components: [actionsRow],
                  ephemeral: true,
                  fetchReply: true,
                });
              }

              var actionCollector = int.createMessageComponentCollector();

              actionCollector.on("collect", async (collected) => {
                followUp = collected.replied || collected.deferred;
                // console.log(collected.values[0])
                var value = parseInt(collected.values[0]);
                switch (filter) {
                  case "language":
                    Guilds.findOneAndUpdate(
                      {
                        id: message.guild.id,
                      },
                      {
                        $set: {
                          filters: {
                            language: {
                              on: filters.language.on,
                              action: value,
                            },
                            links: filters.links,
                            mentions: filters.mentions,
                            ghostPings: filters.ghostPings,
                          },
                        },
                      }
                    ).then((data) => data.save());
                    break;
                  case "links":
                    Guilds.findOneAndUpdate(
                      {
                        id: message.guild.id,
                      },
                      {
                        $set: {
                          filters: {
                            language: filters.language,
                            links: {
                              on: filters.links.on,
                              action: value,
                            },
                            mentions: filters.mentions,
                            ghostPings: filters.ghostPings,
                          },
                        },
                      }
                    ).then((data) => data.save());
                    break;
                  case "mentions":
                    Guilds.findOneAndUpdate(
                      {
                        id: message.guild.id,
                      },
                      {
                        $set: {
                          filters: {
                            language: filters.language,
                            links: filters.links,
                            mentions: {
                              on: filters.mentions.on,
                              action: value,
                            },
                            ghostPings: filters.ghostPings,
                          },
                        },
                      }
                    ).then((data) => data.save());
                    break;
                  case "ghostpings":
                    Guilds.findOneAndUpdate(
                      {
                        id: message.guild.id,
                      },
                      {
                        $set: {
                          filters: {
                            language: filters.language,
                            links: filters.links,
                            mentions: filters.mentions,
                            ghostPings: {
                              on: filters.ghostPings.on,
                              action: value,
                            },
                          },
                        },
                      }
                    ).then((data) => data.save());
                    break;
                }
                var extraObject = {
                  language: "language",
                  links: "links",
                  mentions: "mentions",
                  ghostpings: "ghostPings",
                };
                if (followUp) {
                  await collected.followUp({
                    content: `The action of the **${
                      object[filter]
                    }** filter has been changed from \`${
                      Enum.Actions[filters[extraObject[filter]].action]
                    }\` to \`${Enum.Actions[value]}\`!`,
                    ephemeral: true,
                  });
                } else {
                  await collected.reply({
                    content: `The action of the **${
                      object[filter]
                    }** filter has been changed from \`${
                      Enum.Actions[filters[extraObject[filter]].action]
                    }\` to \`${Enum.Actions[value]}\`!`,
                    ephemeral: true,
                  });
                }
              });
              break;
          }
        });
      }
    });
  },
};
