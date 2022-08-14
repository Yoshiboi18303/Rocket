const Users = require("../schemas/userSchema");
const ShopItems = require("../shopItems");
const { Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "shop",
  description: "View or buy something from the shop!",
  usage: "{prefix}shop <action> [item] [amount]",
  type: "Economy",
  cooldown: ms("5s"),
  testing: true,
  ownerOnly: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var action = args[0]?.toLowerCase() || "view";
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
            `**ID:** \`${item.id}\`,\n**Description:** **\`${item.desc}\`**,\n**Price:** \`${item.price} Tokens\``,
            true
          );
        }

        await message.reply({
          embeds: [shop_embed],
        });
        break;
      case "buy":
        var item = ShopItems.find(
          (item) => item.name == args[1] || item.id == args[1]
        );
        if (!item)
          return await message.reply({
            content: "Invalid item name/id entered.",
          });
        var User = await Users.findOne({
          id: message.author.id,
        });
        if (!User) {
          User = new Users({
            id: message.author.id,
          });
          User.save();
        }
        var amount = parseInt(args[2]);
        if (isNaN(amount)) amount = 1;
        var price = item.price * amount;
        var itms = User.items;
        if (User.tokens < price)
          return await message.reply({
            content: `You don't have enough money for ${amount} \`${
              item.name
            }'s\`, you are \`${
              User.tokens - price
            }\` tokens short of \`${price}\`.`,
          });
        var data = await Users.findOneAndUpdate(
          {
            id: message.author.id,
          },
          {
            $set: {
              tokens: User.tokens - price,
            },
          }
        );
        data.save();
        switch (item.id) {
          case "padlock":
            data = await Users.findOneAndUpdate(
              {
                id: message.author.id,
              },
              {
                $inc: {
                  "items.padlocks": amount,
                },
              }
            );
            data.save();
            break;
          case "boosters":
            data = await Users.findOneAndUpdate(
              {
                id: message.author.id,
              },
              {
                $inc: {
                  "items.boosters": amount,
                },
              }
            );
            data.save();
            break;
          case "machete":
            data = await Users.findOneAndUpdate(
              {
                id: message.author.id,
              },
              {
                $inc: {
                  "items.machetes": amount,
                },
              }
            );
            data.save();
            break;
          case "gloves":
            data = await Users.findOneAndUpdate(
              {
                id: message.author.id,
              },
              {
                $inc: {
                  "items.gloves": itms.gloves + amount,
                },
              }
            );
            data.save();
            break;
        }
        const purchased_embed = new MessageEmbed()
          .setColor(colors.green)
          .setTitle("Item Purchased!")
          .setDescription(
            `You have successfully bought ${amount} \`${
              item.name
            }'s\` from the store\n\n**You now have ${
              User.tokens - price
            } tokens left.**`
          );
        await message.reply({
          embeds: [purchased_embed],
        });
        break;
    }
  },
};
