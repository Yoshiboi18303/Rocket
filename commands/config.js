const Guilds = require("../schemas/guildSchema");
const { Permissions, MessageAttachment } = require("discord.js");

module.exports = {
  name: "config",
  description: "View or change some data!",
  usage:
    "{prefix}config <action> <setting> [value (required for changing an option)]",
  testing: false,
  ownerOnly: false,
  userPermissions: [Permissions.FLAGS.MANAGE_SERVER],
  clientPermissions: [],
  execute: async (message, args) => {
    var Guild = await Guilds.findOne({
      id: message.guild.id,
    });
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
    if (!["welcome", "member"].includes(setting)) {
      const invalid_setting_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Please provide a valid setting! ❌\n\nℹ️ **Valid settings are:** `welcome` and `member` ℹ️"
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
                "https://cdn.discordapp.com/attachments/978301144977772596/978308007354048542/hierarchy-update.gif",
                "hierarchy-update.gif"
              );
              const bad_position_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                  "❌ My position on the role hierachy is too low for me to manage the role! Please put me a bit higher on the role hierarchy! ❌"
                )
                .setImage("attachment://hierarchy-update.gif");
              return await message.reply({
                embeds: [bad_position_embed],
                files: [attachment],
              });
            }
            var data = await Guilds.findOneAndUpdate(
              {
                id: message.guild.id,
              },
              {
                $set: {
                  memberRole: role.id,
                },
              }
            );
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
        }
        break;
    }
  },
};
