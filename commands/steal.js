const {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  User,
} = require("discord.js");
const Users = require("../schemas/userSchema");
const ms = require("ms");
const colors = require("../colors.json");

module.exports = {
  name: "steal",
  description: "Steal money from another user of the bot!",
  usage: "{prefix}steal <user mention | user id>",
  aliases: "rob",
  type: "Economy",
  cooldown: ms("2m") + ms("30s"),
  testing: false,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var user =
      message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      const no_user_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ That's not a valid user of the bot! ❌");
      return await message.reply({
        embeds: [no_user_embed],
      });
    }
    var User1 = await Users.findOne({ id: message.author.id });
    var User2 = await Users.findOne({ id: user.id });
    if (!User1) {
      User1 = new Users({
        id: message.author.id,
      });
      User1.save();
    }
    if (!User2) {
      User2 = new Users({
        id: message.author.id,
      });
      User2.save();
    }
    if (User2.tokens < 1000) {
      const bad_stolen_tokens_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          `❌ **${user.username}** doesn't have at least 1000 tokens in their wallet, it's not worth it until then! ❌`
        );
      return await message.reply({
        embeds: [bad_stolen_tokens_embed],
      });
    }
    if (User1.tokens < 1000) {
      const bad_stealing_tokens_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          `❌ You don't have at least 1000 tokens in your wallet, it's not worth it until then! ❌`
        );
      return await message.reply({
        embeds: [bad_stealing_tokens_embed],
      });
    }
    var chance = config.owner ? Math.random() > 0.41 : Math.random() > 0.59;
    const agreement_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setTitle("Agreement")
      .setDescription(
        "You have executed the `steal` command, which will either success or fail at a 1 in 6 chance.\n\n**If you fail to steal from your target, you'll lose cash!**\n\nAre you sure?"
      );
    const agreement_row = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Yes")
        .setCustomId("agree")
        .setEmoji("✅"),
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("No")
        .setCustomId("deny")
        .setEmoji("❌")
    );
    var msg = await message.reply({
      embeds: [agreement_embed],
      components: [agreement_row],
    });

    /**
     * @param {ButtonInteraction} interaction
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
      componentType: "BUTTON",
      filter,
      max: 1,
    });

    collector.on("end", async (collection) => {
      var interaction = collection.first();

      if (interaction.customId == "agree") {
        var dividers = [3, 4, 5];
        var divider = dividers[Math.floor(Math.random() * dividers.length)];
        var random_amount = Math.ceil(Math.random() * (User2.tokens / divider));
        if (chance) {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $inc: {
                tokens: random_amount,
                "stolen.fromOthers": random_amount,
              },
            }
          ).then((data) => data.save());
          Users.findOneAndUpdate(
            {
              id: user.id,
            },
            {
              $set: {
                tokens: User2.tokens - random_amount,
                "stolen.fromSelf": User2.stolen.fromSelf + random_amount,
              },
            }
          ).then((data) => data.save());
          const steal_successful_embed = new MessageEmbed()
            .setColor(colors.green)
            .setTitle("Steal Successful!")
            .setDescription(
              `You have successfully made a fool out of **${user.username}** and stole **${random_amount}** tokens from them!`
            );
          const stolen_from_embed = new MessageEmbed()
            .setColor(colors.orange)
            .setTitle("Attention")
            .setDescription(
              `You were stolen from in **${message.guild.name}** from **${message.author.username}** and lost **${random_amount}** tokens! Maybe watch your back next time!`
            );
          await interaction.update({
            embeds: [steal_successful_embed],
            components: [],
          });
          await user
            .send({
              embeds: [stolen_from_embed],
            })
            .catch(() => {
              return;
            });
        } else {
          Users.findOneAndUpdate(
            {
              id: message.author.id,
            },
            {
              $set: {
                tokens: User1.tokens - random_amount,
                "stolen.fromSelf": User1.stolen.fromSelf + random_amount,
              },
            }
          ).then((data) => data.save());
          Users.findOneAndUpdate(
            {
              id: user.id,
            },
            {
              $inc: {
                tokens: random_amount,
                "stolen.fromOthers": random_amount,
              },
            }
          ).then((data) => data.save());
          const steal_failed_embed = new MessageEmbed()
            .setColor(colors.dred)
            .setTitle("Steal Failed...")
            .setDescription(
              `You weren't able to steal from **${user.username}** and had to pay them ${random_amount} tokens as an apology.`
            );
          const almost_stolen_from_embed = new MessageEmbed()
            .setColor(colors.dgreen)
            .setTitle("Close One!")
            .setDescription(
              `You were almost stolen from by **${
                message.author.username
              }**, but they failed.\n\n**They then had to give you \`${random_amount}\` tokens as an apology, which now increases your wallet balance to \`${
                User2.tokens + random_amount
              }\` tokens.**`
            );
          await interaction.update({
            embeds: [steal_failed_embed],
            components: [],
          });
          await user
            .send({
              embeds: [almost_stolen_from_embed],
            })
            .catch(() => {
              return;
            });
        }
      } else {
        await interaction.update({
          content: `You have cancelled stealing from **${user.username}**.`,
          components: [],
        });
      }
    });
  },
};
