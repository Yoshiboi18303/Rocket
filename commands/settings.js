const Users = require("../schemas/userSchema");
const { isHex, isHexColor } = require("ishex");
const { Message } = require("discord.js");

module.exports = {
  name: "settings",
  description: "Change your profile settings!",
  usage:
    "{prefix}settings <action> <setting> [value (required for changing a setting)]",
  aliases: [],
  userPermissions: [],
  clientPermissions: [],
  testing: true,
  ownerOnly: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var User = await Users.findOne({ id: message.author.id });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
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
    if (!["color"].includes(setting)) {
      const invalid_setting_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ Please provide a valid setting! ❌\n\nℹ️ **Valid settings are:** `color` ℹ️"
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
          case "color":
            current_value_embed.addField(
              "Value",
              `\`\`\`\n${User.carColor}\n\`\`\``,
              true
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
          case "color":
            if (!isHex(value) && !isHexColor(value)) {
              const invalid_value_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription("❌ That is not a hex or hex code! ❌");
              return await message.reply({
                embeds: [invalid_value_embed],
              });
            }
            if (isHex(value)) value = `#${value}`;
            var data = await Users.findOneAndUpdate(
              {
                id: message.author.id,
              },
              {
                $set: {
                  carColor: value,
                },
              }
            );
            data.save();
            new_value_embed.addFields([
              {
                name: "Old Value",
                value: `\`\`\`\n${User.carColor}\n\`\`\``,
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
