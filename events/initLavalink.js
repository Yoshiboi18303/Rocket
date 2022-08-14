module.exports = {
  name: "initLavalink",
  once: true,
  execute: (client) => {
    lavalink.init(client.user.id);
  },
};
