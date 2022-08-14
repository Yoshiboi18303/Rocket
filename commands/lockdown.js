const { Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "lockdown",
  description: "Change the lockdown status of your server!",
  usage: "{prefix}lockdown <status> [--disable-message-history]",
  type: "Moderation",
  cooldown: ms("3s"),
  aliases: "ld, lock",
  testing: false,
  userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
  clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var status = args[0];
    var disableMessageHistory = args.includes("--disable-message-history");
    if (!["true", "false", "on", "off"].includes(status)) {
      const invalid_status_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "That's an invalid status! Valid statuses are `on`, `off`, `true` and `false`!"
        );
      return await message.reply({
        embeds: [invalid_status_embed],
      });
    }

    status = status == "on" || status == "true" ? true : false;

    switch (status) {
      case true:
        message.guild.channels.cache.each((channel) => {
          if (channel.type == "GUILD_TEXT") {
            if (disableMessageHistory) {
              channel.edit(
                {
                  permissionOverwrites: [
                    {
                      id: message.guild.roles.everyone,
                      deny: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                        Permissions.FLAGS.READ_MESSAGE_HISTORY,
                      ],
                    },
                  ],
                },
                "Lockdown initiated"
              );
            } else {
              channel.edit(
                {
                  permissionOverwrites: [
                    {
                      id: message.guild.roles.everyone,
                      deny: [
                        Permissions.FLAGS.VIEW_CHANNEL,
                        Permissions.FLAGS.SEND_MESSAGES,
                      ],
                    },
                  ],
                },
                "Lockdown initiated"
              );
            }
          }
        });
        await message.reply({
          content: "Lockdown enabled!",
        });
        break;
      case false:
        message.guild.channels.cache.each((channel) => {
          channel.edit(
            {
              permissionOverwrites: [
                {
                  id: message.guild.roles.everyone,
                  allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                  ],
                },
              ],
            },
            "Lockdown lifted."
          );
        });
        await message.reply({
          content: "Lockdown lifted.",
        });
        break;
    }
  },
};
