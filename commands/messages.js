const Guilds = require("../schemas/guildSchema");
const {
  Permissions,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  Interaction,
} = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "messages",
  description: "Edit your guilds messages!",
  usage: "{prefix}messages",
  aliases: ["wm", "lm", "bm", "messagedit", "editmsgs"],
  type: "Utility",
  cooldown: ms("10s"),
  userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
  clientPermissions: [],
  testOnly: false,
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
    var welcomeMessage = Guild.welcomeMessage;
    var leaveMessage = Guild.leaveMessage;
    var dmMessage = Guild.dmMessage;
    var banMessage = Guild.banMessage;

    var formattedWelcomeMessage = welcomeMessage
      .replace("{usermention}", `<@697414293712273408>`)
      .replace("{guild}", `${message.guild.name}`)
      .replace("{usertag}", `Yoshiboi18303#6732`)
      .replace("{membercount}", `${message.guild.members.cache.size}`)
      .replace("{username}", `Yoshiboi18303`)
      .replace("{userid}", `697414293712273408`)
      .replace("{userdisc}", `6732`);

    var formattedLeaveMessage = leaveMessage
      .replace("{usertag}", `Yoshiboi18303#6732`)
      .replace("{userid}", `697414293712273408`)
      .replace("{guild}", `${message.guild.name}`)
      .replace("{username}", `Yoshiboi18303`)
      .replace("{userdisc}", `6732`);

    var formattedDmMessage = dmMessage.replace(
      "{guild}",
      `${message.guild.name}`
    );

    var banReasons = [
      "Being a poop head",
      "Spamming",
      "Saying the N word",
      "Being disrespectful",
      "Scamming Members",
    ];
    var formattedBanMessage = banMessage
      .replace("{username}", `Yoshiboi18303`)
      .replace("{usertag}", `Yoshiboi18303#6732`)
      .replace("{guild}", `${message.guild.name}`)
      .replace("{userdisc}", `6732`)
      .replace("{membercount}", `${message.guild.members.cache.size}`)
      .replace(
        "{reason}",
        `${banReasons[Math.floor(Math.random() * banReasons.length)]}`
      );

    const currentMessagesEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle(`Current Messages for \`${message.guild.name}\``)
      .setDescription(
        `Here are all the current messages for **${message.guild.name}**`
      )
      .addFields([
        {
          name: "Unformatted Welcome Message",
          value: `\`\`\`\n${
            welcomeMessage.length > 1010
              ? welcomeMessage.slice(0, 1007) + "..."
              : welcomeMessage
          }\n\`\`\``,
          inline: true,
        },
        {
          name: "Welcome Message Example",
          value: `\`\`\`\n${
            formattedWelcomeMessage.length > 1010
              ? formattedWelcomeMessage.slice(0, 1007) + "..."
              : formattedWelcomeMessage
          }\n\`\`\``,
          inline: true,
        },
        {
          name: "Unformatted Leave Message",
          value: `\`\`\`\n${
            leaveMessage.length > 1010
              ? leaveMessage.slice(0, 1007) + "..."
              : leaveMessage
          }\n\`\`\``,
          inline: true,
        },
        {
          name: "Leave Message Example",
          value: `\`\`\`\n${
            formattedLeaveMessage.length > 1010
              ? formattedLeaveMessage.slice(0, 1007) + "..."
              : formattedLeaveMessage
          }\n\`\`\``,
          inline: true,
        },
        {
          name: "Unformatted DM Message",
          value: `\`\`\`\n${
            dmMessage.length > 1010
              ? dmMessage.slice(0, 1007) + "..."
              : dmMessage
          }\n\`\`\``,
          inline: true,
        },
        {
          name: "DM Message Example",
          value: `\`\`\`\n${
            formattedDmMessage.length > 1010
              ? formattedDmMessage.slice(0, 1007) + "..."
              : formattedDmMessage
          }\n\`\`\``,
          inline: true,
        },
        {
          name: "Unformatted Ban Message",
          value: `\`\`\`\n${
            banMessage.length > 1010
              ? banMessage.slice(0, 1007) + "..."
              : banMessage
          }\n\`\`\``,
          inline: true,
        },
        {
          name: "Ban Message Example",
          value: `\`\`\`\n${
            formattedBanMessage.length > 1010
              ? formattedBanMessage.slice(0, 1007) + "..."
              : formattedBanMessage
          }\n\`\`\``,
          inline: true,
        },
      ]);
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setDisabled(false)
        .setCustomId("message-options")
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder("Choose a message to change")
        .addOptions([
          {
            label: "Welcome Message",
            value: "welcome",
            description: `Change the welcome message for ${message.guild.name}`,
          },
          {
            label: "Leave Message",
            value: "leave",
            description: `Change the leave message for ${message.guild.name}`,
          },
          {
            label: "DM Message",
            value: "dm",
            description: `Change the message sent to new members' DMs in ${message.guild.name}`,
          },
          {
            label: "Ban Message",
            value: "ban",
            description: `Change the ban message for ${message.guild.name}`,
          },
        ])
    );
    var msg = await message.reply({
      embeds: [currentMessagesEmbed],
      components: [row],
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

    var collector = msg.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      filter,
      idle: 1000 * 60,
    });

    const pleaseFinishEmbed = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription(
        "Please finish the prompt(s) before selecting another option."
      );

    collector.on("collect", async (collected) => {
      var value = collected.values[0];

      if (value == "welcome") {
        row.components.forEach((component) => component.setDisabled(true));

        await msg.edit({
          embeds: [pleaseFinishEmbed],
          components: [row],
        });
        await collected.reply({
          content:
            "Please enter your new welcome message.\n\n**Fun fact: You can use placeholders such as `{usermention}`, `{userid}`, `{membercount}`, `{usertag}`, etc. to spice up the message!**",
        });
        /**
         * @param {Message} m
         */
        var messageFilter = async (m) => {
          if (m.author.id != message.author.id)
            return await m.reply({ content: "This isn't yours!" });
          return true;
        };

        var messageCollector = message.channel.createMessageCollector({
          filter: messageFilter,
          max: 1,
        });

        messageCollector.on("end", async (collection) => {
          var first = collection.first();
          Guilds.findOneAndUpdate(
            {
              id: message.guild.id,
            },
            {
              $set: {
                welcomeMessage: first.content,
              },
            }
          ).then((data) => {
            data.save();
            currentMessagesEmbed.fields[0].value = `\`\`\`\n${
              first.content.length > 1010
                ? first.content.slice(0, 1007) + "..."
                : first.content
            }\n\`\`\``;
            var newFormattedWelcomeMessage = first.content
              .replace("{usermention}", `<@697414293712273408>`)
              .replace("{guild}", `${message.guild.name}`)
              .replace("{usertag}", `Yoshiboi18303#6732`)
              .replace("{membercount}", `${message.guild.members.cache.size}`)
              .replace("{username}", `Yoshiboi18303`)
              .replace("{userid}", `697414293712273408`)
              .replace("{userdisc}", `6732`);
            currentMessagesEmbed.fields[1].value = `\`\`\`\n${
              newFormattedWelcomeMessage.length > 1010
                ? newFormattedWelcomeMessage.slice(0, 1007) + "..."
                : newFormattedWelcomeMessage
            }\n\`\`\``;
          });
          await first.reply({
            content: "Welcome Message set!",
          });
          row.components.forEach((component) => component.setDisabled(false));
          await msg.edit({
            embeds: [currentMessagesEmbed],
            components: [row],
          });
          collector.resetTimer();
        });
      } else if (value == "leave") {
        row.components.forEach((component) => component.setDisabled(true));

        await msg.edit({
          embeds: [pleaseFinishEmbed],
          components: [row],
        });

        await collected.reply({
          content: "Please enter your new leaving message.\n\n**Fun fact: You can use placeholders such as `{usertag}`, `{username}`, `{userid}`, `{guild}`, etc. to spice up your leaving message!**",
        });
        /**
         * @param {Message} m
         */
        var messageFilter = async (m) => {
          if (m.author.id != message.author.id)
            return await m.reply({ content: "This isn't yours!" });
          return true;
        };

        var messageCollector = message.channel.createMessageCollector({
          filter: messageFilter,
          max: 1,
        });

        messageCollector.on("end", async (collection) => {
          var first = collection.first();
          Guilds.findOneAndUpdate(
            {
              id: message.guild.id,
            },
            {
              $set: {
                leaveMessage: first.content,
              },
            }
          ).then((data) => {
            data.save();
            currentMessagesEmbed.fields[2].value = `\`\`\`\n${
              first.content.length > 1010
                ? first.content.slice(0, 1007) + "..."
                : first.content
            }\n\`\`\``;
            var newFormattedLeaveMessage = first.content
              .replace("{usertag}", `Yoshiboi18303#6732`)
              .replace("{userid}", `697414293712273408`)
              .replace("{guild}", `${message.guild.name}`)
              .replace("{username}", `Yoshiboi18303`)
              .replace("{userdisc}", `6732`);
            currentMessagesEmbed.fields[3].value = `\`\`\`\n${
              newFormattedLeaveMessage.length > 1010
                ? newFormattedLeaveMessage.slice(0, 1007) + "..."
                : newFormattedLeaveMessage
            }\n\`\`\``;
          });
          await first.reply({
            content: "Leaving Message set!",
          });
          row.components.forEach((component) => component.setDisabled(false));
          await msg.edit({
            embeds: [currentMessagesEmbed],
            components: [row],
          });
          collector.resetTimer();
        });
      } else if (value == "dm") {
        row.components.forEach((component) => component.setDisabled(true));

        await msg.edit({
          embeds: [pleaseFinishEmbed],
          components: [row],
        });

        await collected.reply({
          content: "Please enter your new DM message.\n\nThe only placeholder on this is `{guild}` for the moment.",
        });
        /**
         * @param {Message} m
         */
        var messageFilter = async (m) => {
          if (m.author.id != message.author.id)
            return await m.reply({ content: "This isn't yours!" });
          return true;
        };

        var messageCollector = message.channel.createMessageCollector({
          filter: messageFilter,
          max: 1,
        });

        messageCollector.on("end", async (collection) => {
          var first = collection.first();
          Guilds.findOneAndUpdate(
            {
              id: message.guild.id,
            },
            {
              $set: {
                dmMessage: first.content,
              },
            }
          ).then((data) => {
            data.save();
            currentMessagesEmbed.fields[4].value = `\`\`\`\n${
              first.content.length > 1010
                ? first.content.slice(0, 1007) + "..."
                : first.content
            }\n\`\`\``;
            var newFormattedDmMessage = first.content.replace(
              "{guild}",
              `${message.guild.name}`
            );
            currentMessagesEmbed.fields[5].value = `\`\`\`\n${
              newFormattedDmMessage.length > 1010
                ? newFormattedDmMessage.slice(0, 1007) + "..."
                : newFormattedDmMessage
            }\n\`\`\``;
          });
          await first.reply({
            content: "DM Message set!",
          });
          row.components.forEach((component) => component.setDisabled(false));
          await msg.edit({
            embeds: [currentMessagesEmbed],
            components: [row],
          });
          collector.resetTimer();
        });
      } else {
        row.components.forEach((component) => component.setDisabled(true));

        await msg.edit({
          embeds: [pleaseFinishEmbed],
          components: [row],
        });

        await collected.reply({
          content: "Please enter your new ban message.\n\n**Fun fact: You can use placeholders such as `{usertag}`, `{username}`, `{userid}`, `{guild}`, `{reason}`, etc. to spice up your ban message!**",
        });
        /**
         * @param {Message} m
         */
        var messageFilter = async (m) => {
          if (m.author.id != message.author.id)
            return await m.reply({ content: "This isn't yours!" });
          return true;
        };

        var messageCollector = message.channel.createMessageCollector({
          filter: messageFilter,
          max: 1,
        });

        messageCollector.on("end", async (collection) => {
          var first = collection.first();
          Guilds.findOneAndUpdate(
            {
              id: message.guild.id,
            },
            {
              $set: {
                banMessage: first.content,
              },
            }
          ).then((data) => {
            data.save();
            currentMessagesEmbed.fields[6].value = `\`\`\`\n${
              first.content.length > 1010
                ? first.content.slice(0, 1007) + "..."
                : first.content
            }\n\`\`\``;
            var newFormattedBanMessage = first.content
              .replace("{username}", `Yoshiboi18303`)
              .replace("{usertag}", `Yoshiboi18303#6732`)
              .replace("{guild}", `${message.guild.name}`)
              .replace("{userdisc}", `6732`)
              .replace("{membercount}", `${message.guild.members.cache.size}`)
              .replace(
                "{reason}",
                `${banReasons[Math.floor(Math.random() * banReasons.length)]}`
              );
            currentMessagesEmbed.fields[7].value = `\`\`\`\n${
              newFormattedBanMessage.length > 1010
                ? newFormattedBanMessage.slice(0, 1007) + "..."
                : newFormattedBanMessage
            }\n\`\`\``;
          });
          await first.reply({
            content: "Ban Message set!",
          });
          row.components.forEach((component) => component.setDisabled(false));
          await msg.edit({
            embeds: [currentMessagesEmbed],
            components: [row],
          });
          collector.resetTimer();
        });
      }
    });

    collector.on("end", async () => {
      row.components.forEach((component) => component.setDisabled(true));
      await msg.edit({
        content: "Sorry, this has now expired.",
        components: [row],
      });
    });
  },
};
