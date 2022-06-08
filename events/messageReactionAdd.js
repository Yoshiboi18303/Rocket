const Guilds = require("../schemas/guildSchema");
const { MessageReaction, MessageEmbed, User } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",
  once: false,
  /**
   * @param {MessageReaction} reaction
   * @param {User} reactor
   */
  execute: async (reaction, reactor) => {
    if (reaction.message.author.bot) return;
    if (reactor.bot) return;
    if (reaction.emoji.name == "⭐") {
      if (reaction.count >= 2) {
        const starboardEmbed = new MessageEmbed()
          .setColor(colors.cyan)
          .setAuthor({
            name: `${reaction.message.author.tag}`,
            iconURL: `${reaction.message.author.displayAvatarURL({
              format: "png",
            })}`,
          })
          .addField(
            "Original Message",
            `[Jump To Message](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`,
            true
          )
          .setTimestamp(reaction.message.createdTimestamp);

        if (reaction.message.content?.length) {
          starboardEmbed.setDescription(`${reaction.message.content}`);
        }

        if (reaction.message.attachments?.size) {
          starboardEmbed.setImage(reaction.message.attachments.first().url);
        }

        var Guild = await Guilds.findOne({
          id: reaction.message.guild.id,
        });
        if (!Guild) {
          Guild = new Guilds({
            id: reaction.message.guild.id,
          });
          Guild.save();
        }

        var channel = client.channels.cache.get(Guild.starboard);
        // console.log(channel)
        if (!channel) return;

        var emoji = reaction.count >= 10 ? "💫" : "🌟";

        var msg;

        if (msg != undefined && msg != null) {
          await msg.edit({
            embeds: [starboardEmbed],
            content: `${emoji} **${reaction.count}** <#${reaction.message.channel.id}>, Message ID: ${reaction.message.id}`,
          });
        } else {
          msg = await channel.send({
            embeds: [starboardEmbed],
            content: `${emoji} **${reaction.count}** <#${reaction.message.channel.id}>, Message ID: ${reaction.message.id}`,
          });
        }
      }
    }
  },
};
