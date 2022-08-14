module.exports = {
  name: "nodeConnect",
  execute: (client, Logger) => {
    Logger.success(`${client.user.username} connected to Lavalink node!`);
  },
};
