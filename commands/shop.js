const Users = require("../schemas/userSchema");
const ShopItems = require("../shopItems");

module.exports = {
  name: "shop",
  description: "View or buy something from the shop!",
  usage: "{prefix}shop <action> [item]",
  type: "Economy",
  cooldown: ms("5s"),
  testing: true,
  ownerOnly: false,
  execute: async (message, args) => {
    var action = args[0]?.toLowerCase();
    if (!["view", "buy"].includes(action)) {
      const invalid_action_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's an invalid action! ❌\n\n**ℹ️ Valid actions are `view` or `buy`! ℹ️**"
        );
      return await message.reply({
        embeds: [invalid_action_embed],
      });
    }
    switch (action) {
      case "view":
        const shop_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle("Shop")
          .setDescription("Welcome to the shop! Have a look around!");

        for (const item of ShopItems) {
          shop_embed.addField(
            `${item.emoji} ${item.name}`,
            `**ID:** \`${item.id}\`,\n**Description:** **\`${item.desc}\`**,\n**Price:** \`${item.price} Tokens\``
          );
        }

        await message.reply({
          embeds: [shop_embed],
        });
        break;
      case "buy":
        return await message.reply({
          content: "Coming soon!",
        });
        break;
    }
  },
};
