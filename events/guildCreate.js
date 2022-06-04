const { Guild, Permissions } = require("discord.js");

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

    await client.channels.cache.get("981617877092298853").send({
      embeds: [new_guild_embed],
    });

    var hellChannel = guild.channels.cache.find(
      (channel) => channel.name == "bot-hell" || channel.name.includes("hell")
    );
    if (!hellChannel) return;
    if (
      !guild.me
        .permissionsIn(hellChannel)
        .includes([
          Permissions.FLAGS.VIEW_CHANNEL,
          Permissions.FLAGS.SEND_MESSAGES,
        ])
    )
      return;

    const helpful_info_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Hello!")
      .setDescription(
        `Hello and thank you for adding **${client.user.username}**, I'm very happy to have been invited to your guild **${guild.name}**! Here's some helpful info to get your started using me!\n\nMy default prefix is: \`rlc!\`\nHow to see all my commands: \`rlc!help\`\n\nAre you ready to make your server a great place for all your members? Because I am!`
      )
      .setFooter({
        text: `Thanks for adding ${client.user.username}!`,
        iconURL: `${client.user.displayAvatarURL({ format: "png" })}`,
      });
    await hellChannel
      .send({
        embeds: [helpful_info_embed],
      })
      .catch((e) => {
        return console.error(e);
      });
  },
};
