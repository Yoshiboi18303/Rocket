const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "ping",
  description: "Returns the ping of the client and the API",
  aliases: [],
  usage: "{prefix}ping",
  testing: true,
  ownerOnly: false,
  userPermissions: [],
  clientPermissions: [],
  execute: (message) => {
    message.reply({
      content: "Pinging API..."
    }).then(async (msg) => {
      var clientPing = msg.createdTimestamp - message.createdTimestamp;
      var apiPing = client.ws.ping;
      await wait(5000);
      await msg.edit({
        content: `Pong!\n\n**Client Ping:** \`${clientPing}ms\`\n**API Ping:** \`${apiPing}ms\``
      })
    })
  }
}