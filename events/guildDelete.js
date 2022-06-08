const { Guild } = require("discord.js");

module.exports = {
  name: "guildDelete",
  once: false,
  /**
   * @param {Guild} guild
   */
  execute: async (guild) => {
    var supportServer = client.guilds.cache.get("977632347862216764");
    const lost_guild_embed = new MessageEmbed()
      .setColor(colors.red)
      .setTitle("Lost A Guild...")
      .setDescription(`I was removed from **${guild.name}**...`);

    var serversVc = supportServer.channels.cache.get("982503467392327720");
    var usersVc = supportServer.channels.cache.get("982503658468044841");

    serversVc.setName(
      `Servers: ${client.guilds.cache.size}`,
      "Removed from a guild, inserting the new data."
    );
    usersVc.setName(
      `Users: ${client.users.cache.size}`,
      "Removed from a guild, inserting the new data."
    );

    await supportServer.channels.cache.get("981617877092298853").send({
      embeds: [lost_guild_embed],
    });
  },
};
