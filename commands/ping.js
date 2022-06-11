const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "ping",
  description: "Returns the ping of the client and the API",
  aliases: [],
  usage: "{prefix}ping",
  type: "Information",
  cooldown: ms("10s"),
  testing: false,
  ownerOnly: false,
  userPermissions: [],
  clientPermissions: [],
  execute: (message) => {
    message
      .reply({
        content: "Pinging API...",
      })
      .then(async (msg) => {
        var clientPing = msg.createdTimestamp - message.createdTimestamp;
        var apiPing = client.ws.ping;
        await wait(5000);
        const ping_embed = new MessageEmbed()
          .setColor(colors.cyan)
          .setTitle(`${client.user.username} Ping`)
          .addFields([
            {
              name: "Client Ping",
              value: `\`${clientPing}ms\``,
              inline: true,
            },
            {
              name: "API Ping",
              value: `\`${apiPing}ms\``,
              inline: true,
            },
          ]);
        await msg.edit({
          embeds: [ping_embed],
          content: "Ping recieved! Check the embed!",
        });
      });
  },
};
