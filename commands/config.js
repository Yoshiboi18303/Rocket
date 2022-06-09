const Guilds = require("../schemas/guildSchema");
const { Permissions, MessageAttachment, Message } = require("discord.js");

module.exports = {
  name: "config",
  description: "View or change some data!",
  usage:
    "{prefix}config <action> <setting> [value (required for changing an option)]",
  type: "Utility",
  testing: false,
  ownerOnly: false,
  userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var Guild = await Guilds.findOne({
      id: message.guild.id,
    });
    // console.log(Guild)
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var action = args[0];
    var setting = args[1];
    var value = args.slice(2).join(" ") || undefined;
    if (!["view", "set"].includes(action)) {
      const invalid_action_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Please provide a valid action! ❌\n\nℹ️ **Valid actions are:** `view` or `set` ℹ️"
        );
      return await message.reply({
        embeds: [invalid_action_embed],
      });
    }
    if (
      ![
        "welcome",
        "member",
        "memberJoinDms",
        "wmessage",
        "warn1",
        "warn2",
        "warn3",
        "logs",
        "lmessage",
      ].includes(setting)
    ) {
      const invalid_setting_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Please provide a valid setting! ❌\n\nℹ️ **Valid settings are:** `welcome`, `member`, `memberJoinDms`, `wmessage`, `warn1`, `warn2`, `warn3`, `logs` and `lmessage` ℹ️"
        );
      return await message.reply({
        embeds: [invalid_setting_embed],
      });
    }
    if (action == "set" && !value) {
      const no_value_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please provide a value for this setting! ❌");
      return await message.reply({
        embeds: [no_value_embed],
      });
    }
    /*
    if((setting == "warn1" || setting == "warn2" || setting == "warn3") && action != "view" && message.guild.id != "977632347862216764") {
      var infoAttachment = new MessageAttachment("https://cdn.discordapp.com/attachments/978301144977772596/981319817975955518/Info.png", "Info.png")
      return await message.reply({
        content: `The warning role settings are being tested, please view this to know why (view attachment below).\n\n**Want to be notified when the testing is done?** \`Join the support server!\` => ${config.supportServerURL}`,
        files: [infoAttachment]
      })
    }
    */
    switch (action) {
      case "view":
        const current_value_embed = new MessageEmbed()
          .setColor(colors.orange)
          .setTitle(`ℹ️ Current value for **\`${setting}\`** ℹ️`)
          .setTimestamp();
        switch (setting) {
          case "welcome":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${
                Guild.welcomeChannel != ""
                  ? client.channels.cache.get(Guild.welcomeChannel).name
                  : "None"
              }\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "member":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${
                message.guild.roles.cache.get(Guild.memberRole)?.name ||
                "None/Unknown"
              }\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "memberJoinDms":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${Guild.dmUsersOnJoin ? "On" : "Off"}\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "wmessage":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${Guild.welcomeMessage || "Unknown"}\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "warn1":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${
                message.guild.roles.cache.get(Guild.warnRoles.warn1)?.name ||
                "None/Unknown"
              }\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "warn2":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${
                message.guild.roles.cache.get(Guild.warnRoles.warn2)?.name ||
                "None/Unknown"
              }\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "warn3":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${
                message.guild.roles.cache.get(Guild.warnRoles.warn3)?.name ||
                "None/Unknown"
              }\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "logs":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${
                message.guild.channels.cache.get(Guild.logChannel)?.name ||
                "None/Unknown"
              }\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
          case "lmessage":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${Guild.leaveMessage}\n\`\`\``
            );
            await message.reply({
              embeds: [current_value_embed],
            });
            break;
        }
        break;
      case "set":
        const new_value_embed = new MessageEmbed()
          .setColor(colors.orange)
          .setTitle(`New value for **\`${setting}\`**`)
          .setTimestamp();
        switch (setting) {
          case "welcome":
            if (!message.guild.channels.cache.get(value)) {
              const unknown_channel_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ That's an unknown channel! ❌\n\n**❓ Is it in this guild? ❓**"
                );
              return await message.reply({
                embeds: [unknown_channel_embed],
              });
            }
            var channel = client.channels.cache.get(value);
            if (
              !message.guild.me
                .permissionsIn(channel)
                .has([
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.SEND_MESSAGES,
                  Permissions.FLAGS.ATTACH_FILES,
                ])
            ) {
              const bad_permissions_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  `❌ My welcome function won't work unless I have the \`VIEW_CHANNEL\`, \`SEND_MESSAGES\`, and \`ATTACH_FILES\` permissions in the provided channel (<#${channel.id}>)! ❌`
                );
              return await message.reply({
                embeds: [bad_permissions_embed],
              });
            }
            var data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  welcomeChannel: value,
                },
              }
            );
            data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${
                  client.channels.cache.get(Guild.welcomeChannel)?.name ||
                  "None/Unknown"
                }\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${channel.name}\n\`\`\``,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "member":
            var role = message.guild.roles.cache.get(value);
            if (!role) {
              const unknown_role_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ That's an unknown role! ❌\n\nℹ️ **Please make sure you copied the [ID](https://yoshiboi18303-has.bot.style/recording_2.mp4) of the role!** ℹ️"
                );
              return await message.reply({
                embeds: [unknown_role_embed],
              });
            }
            if (
              !message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
            ) {
              const cant_manage_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Please make sure I have the `MANAGE_ROLES` permissions! ❌"
                );
              return await message.reply({
                embeds: [cant_manage_embed],
              });
            }
            if (
              message.guild.roles.comparePositions(
                message.guild.roles.botRoleFor(client.user),
                role
              ) <= 0
            ) {
              var attachment = new MessageAttachment(
                "https://cdn.discordapp.com/attachments/978301144977772596/981247511576588429/hierarchy-update.gif",
                "hierarchy-update.gif"
              );
              const bad_position_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ My position on the role hierachy is too low for me to manage that role! Please put me a bit higher on the role hierarchy! ❌"
                )
                .setImage("attachment://hierarchy-update.gif");
              return await message.reply({
                embeds: [bad_position_embed],
                files: [attachment],
              });
            }
            var new_role_data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  memberRole: role.id,
                },
              }
            );
            new_role_data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${
                  message.guild.roles.cache.get(Guild.memberRole)?.name ||
                  "None/Unknown"
                }\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${
                  message.guild.roles.cache.get(value).name
                }\n\`\`\``,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "memberJoinDms":
            if (!["true", "false", "on", "off"].includes(value)) {
              const invalid_value_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ That's an invalid value! ❌\n\nℹ️ **Valid values are:** `true`, `false`, `on` and `off` ℹ️"
                );
              return await message.reply({
                embeds: [invalid_value_embed],
              });
            }
            value =
              value.toLowerCase() == "true" || value.toLowerCase() == "on"
                ? true
                : false;
            var new_dm_data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  dmUsersOnJoin: value,
                },
              }
            );
            new_dm_data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `${Guild.dmUsersOnJoin ? "On" : "Off"}`,
                inline: true,
              },
              {
                name: "New Value",
                value: `${value ? "On" : "Off"}`,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "wmessage":
            var new_message_data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  welcomeMessage: value,
                },
              }
            );
            new_message_data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${Guild.welcomeMessage}\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${value}\n\`\`\``,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "warn1":
            if (
              !message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
            ) {
              const cant_manage_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Please make sure I have the `MANAGE_ROLES` permissions! ❌"
                );
              return await message.reply({
                embeds: [cant_manage_embed],
              });
            }
            var providedWarnRole = message.guild.roles.cache.get(value);
            if (!providedWarnRole) {
              const bad_role_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Couldn't find that role, please make sure you gave me a valid role in this server! ❌"
                );
              return await message.reply({
                embeds: [bad_role_embed],
              });
            }
            if (
              message.guild.roles.comparePositions(
                message.guild.roles.botRoleFor(client.user),
                providedWarnRole
              ) <= 0
            ) {
              var coolAttachment = new MessageAttachment(
                "https://cdn.discordapp.com/attachments/978301144977772596/981323250242035782/help.gif",
                "help.gif"
              );
              const fix_hierarchy_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ My position on the role hierachy is too low for me to manage that role! Please put me a bit higher on the role hierarchy! ❌"
                )
                .setImage("attachment://help.gif");
              return await message.reply({
                embeds: [fix_hierarchy_embed],
                files: [coolAttachment],
              });
            }
            var new_warn1_data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  warnRoles: {
                    warn1: providedWarnRole.id,
                    warn2: Guild.warnRoles.warn2,
                    warn3: Guild.warnRoles.warn3,
                  },
                },
              }
            );
            new_warn1_data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${
                  message.guild.roles.cache.get(Guild.warnRoles.warn1)?.name ||
                  "None/Unknown"
                }\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${providedWarnRole.name}\n\`\`\``,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "warn2":
            if (
              !message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
            ) {
              const cant_manage_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Please make sure I have the `MANAGE_ROLES` permissions! ❌"
                );
              return await message.reply({
                embeds: [cant_manage_embed],
              });
            }
            var providedWarnRole = message.guild.roles.cache.get(value);
            if (!providedWarnRole) {
              const bad_role_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Couldn't find that role, please make sure you gave me a valid role in this server! ❌"
                );
              return await message.reply({
                embeds: [bad_role_embed],
              });
            }
            if (
              message.guild.roles.comparePositions(
                message.guild.roles.botRoleFor(client.user),
                providedWarnRole
              ) <= 0
            ) {
              var coolAttachment = new MessageAttachment(
                "https://cdn.discordapp.com/attachments/978301144977772596/981323250242035782/help.gif",
                "help.gif"
              );
              const fix_hierarchy_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ My position on the role hierachy is too low for me to manage that role! Please put me a bit higher on the role hierarchy! ❌"
                )
                .setImage("attachment://help.gif");
              return await message.reply({
                embeds: [fix_hierarchy_embed],
                files: [coolAttachment],
              });
            }
            var new_warn2_data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  warnRoles: {
                    warn1: Guild.warnRoles.warn1,
                    warn2: providedWarnRole.id,
                    warn3: Guild.warnRoles.warn3,
                  },
                },
              }
            );
            new_warn2_data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${
                  message.guild.roles.cache.get(Guild.warnRoles.warn1)?.name ||
                  "None/Unknown"
                }\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${providedWarnRole.name}\n\`\`\``,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "warn3":
            if (
              !message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
            ) {
              const cant_manage_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Please make sure I have the `MANAGE_ROLES` permissions! ❌"
                );
              return await message.reply({
                embeds: [cant_manage_embed],
              });
            }
            var providedWarnRole = message.guild.roles.cache.get(value);
            if (!providedWarnRole) {
              const bad_role_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Couldn't find that role, please make sure you gave me a valid role in this server! ❌"
                );
              return await message.reply({
                embeds: [bad_role_embed],
              });
            }
            if (
              message.guild.roles.comparePositions(
                message.guild.roles.botRoleFor(client.user),
                providedWarnRole
              ) <= 0
            ) {
              var coolAttachment = new MessageAttachment(
                "https://cdn.discordapp.com/attachments/978301144977772596/981323250242035782/help.gif",
                "help.gif"
              );
              const fix_hierarchy_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ My position on the role hierachy is too low for me to manage that role! Please put me a bit higher on the role hierarchy! ❌"
                )
                .setImage("attachment://help.gif");
              return await message.reply({
                embeds: [fix_hierarchy_embed],
                files: [coolAttachment],
              });
            }
            var new_warn3_data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  warnRoles: {
                    warn1: Guild.warnRoles.warn1,
                    warn2: Guild.warnRoles.warn2,
                    warn3: providedWarnRole.id,
                  },
                },
              }
            );
            new_warn3_data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${
                  message.guild.roles.cache.get(Guild.warnRoles.warn1)?.name ||
                  "None/Unknown"
                }\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${providedWarnRole.name}\n\`\`\``,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "logs":
            var channel = message.guild.channels.cache.get(value);
            if (!channel) {
              const invalid_channel_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ Couldn't find that channel, did you specify a channel outside this guild? ❌"
                );
              return await message.reply({
                embeds: [invalid_channel_embed],
              });
            }
            if (
              !message.guild.me
                .permissionsIn(channel)
                .has([
                  Permissions.FLAGS.VIEW_CHANNEL,
                  Permissions.FLAGS.SEND_MESSAGES,
                ])
            ) {
              const bad_permissions_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ I can't send messages in/view that channel! Please review my permissions in that channel! ❌"
                );
              return await message.reply({
                embeds: [bad_permissions_embed],
              });
            }
            var newLogChannelData = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  logChannel: value,
                },
              }
            );
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${
                  message.guild.channels.cache.get(Guild.logChannel)?.name ||
                  "None/Unknown"
                }\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${channel.name}\n\`\`\``,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
          case "lmessage":
            var newLeaveMessageData = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  leaveMessage: value,
                },
              }
            );
            newLeaveMessageData.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${Guild.leaveMessage}\n\`\`\``,
                inline: true,
              },
              {
                name: "New Value",
                value: `\`\`\`\n${value}\n\`\`\``,
                inline: true,
              },
            ]);
            await message.reply({
              embeds: [new_value_embed],
            });
            break;
        }
        break;
    }
  },
};
