const {
  Guild,
  Permissions,
  MessageActionRow,
  MessageButton,
  Interaction,
} = require("discord.js");
const Guilds = require("../schemas/guildSchema");
const Users = require("../schemas/userSchema");

module.exports = {
  name: "guildCreate",
  once: false,
  /**
   * @param {Guild} guild
   */
  execute: async (guild) => {
    var supportServer = client.guilds.cache.get("977632347862216764");

    // console.log(supportServer)

    const new_guild_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("New Guild!")
      .setDescription("The bot was added to a new guild!")
      .addFields([
        {
          name: "Guild",
          value: `${guild.name}`,
          inline: true,
        },
        {
          name: "Member Count",
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: "New Guild Count",
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
      ]);

    var userCountVc = supportServer.channels.cache.get("982503658468044841");
    var serverCountVc = supportServer.channels.cache.get("982503467392327720");

    userCountVc.setName(
      `Users: ${client.users.cache.size}`,
      "New Guild, inserting the new data."
    );
    serverCountVc.setName(
      `Servers: ${client.guilds.cache.size}`,
      "New Guild, inserting the new data."
    );

    await supportServer.channels.cache.get("981617877092298853").send({
      embeds: [new_guild_embed],
    });

    var channels = await guild.channels.fetch();
    var hellChannel = channels.find(
      (channel) => channel.name == "bot-hell" || channel.name.includes("hell")
    );
    if (!hellChannel) return;
    if (
      !guild.me
        .permissionsIn(hellChannel)
        ?.has([Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES])
    )
      return;

    const helpful_info_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Hello!")
      .setDescription(
        `Hello and thank you for adding **${client.user.username}**, I'm very happy to have been invited to your guild **${guild.name}**! Here's some helpful info to get your started using me!\n\nMy default prefix is: \`rlc!\`\nHow to see all my commands: \`rlc!help\`\n\nAre you ready to make your server a great place for all your members? Because I am!`
      )
      .setFooter({
        text: `Guild #${client.guilds.cache.size}`,
        iconURL: `${client.user.displayAvatarURL({ format: "png" })}`,
      })
      .setTimestamp();

    if (guild.iconURL({ format: "png" }) != null) {
      helpful_info_embed.setAuthor({
        name: `${guild.name}`,
        iconURL: `${guild.iconURL({ format: "png" })}`,
      });
    } else {
      helpful_info_embed.setAuthor({
        name: `${guild.name}`,
      });
    }

    const actionsRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("View Features")
        .setCustomId("features"),
      new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("View Website")
        .setCustomId("website"),
      new MessageButton()
        .setStyle("DANGER")
        .setLabel("Remove Message")
        .setCustomId("msg-remove")
    );

    const msg = await hellChannel
      .send({
        embeds: [helpful_info_embed],
        components: [actionsRow],
      })
      .catch((e) => {
        return console.error(e);
      });

    var Guild = await Guilds.findOne({ id: guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: guild.id,
      });
      Guild.save();
    }

    const cachedVc = supportServer.channels.cache.get("982508373595553823");

    const cachedGuilds = await Guilds.countDocuments();
    const cachedUsers = await Users.countDocuments();

    cachedVc.setName(
      `Cached: ${cachedGuilds + cachedUsers}`,
      "New guild, ensuring the database cache count is up-to-date."
    );

    /**
     * @param {Interaction} btnInt
     */
    const filter = async (btnInt) => {
      if (!btnInt.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
        return await btnInt.reply({
          content: "Seriously man? You can't do this!",
          ephemeral: true,
        });
      return true;
    };

    const collector = await msg.createMessageComponentCollector({
      filter,
    });

    collector.on("collect", async (collected) => {
      if (!collected.isButton()) return;
      var followUp = collected.replied || collected.deferred;
      if (collected.customId == "features") {
        const features_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle("My Features!")
          .setDescription(
            `Hello, here are my features!\n\n**\`Economy System\`** - \`Have some fun with my unoriginal Economy system!\`\n**\`Welcome System\`** - \`All newer members can be welcomed in warmly!\`\n**\`Music System\`** - \`Listen to some of your favorite music from YouTube, SoundCloud, Spotify, and your files!\`\n**\`Warning Roles\`** - \`A member will have low social credit with your customizable warning roles!\``
          )
          .setFooter({
            text: 'You can also view these features from my website (by clicking the "View Website" button)!',
          });
        if (followUp) {
          await collected.followUp({
            embeds: [features_embed],
            ephemeral: true,
          });
        } else {
          await collected.reply({
            embeds: [features_embed],
            ephemeral: true,
          });
        }
      } else if (collected.customId == "website") {
        const view_website_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle("My Website!")
          .setDescription(
            `You can view my website **[here](https://${config.origin})**!`
          );
        if (followUp) {
          await collected.followUp({
            embeds: [view_website_embed],
            ephemeral: true,
          });
        } else {
          await collected.reply({
            embeds: [view_website_embed],
            ephemeral: true,
          });
        }
      } else if (collected.customId == "msg-remove") {
        return await msg.delete();
      }
    });
  },
};
