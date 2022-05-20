module.exports = {
  name: "error",
  execute: (textChannel, e) => {
    console.error(e);
    textChannel.send({
      content: `An error encountered: ${e.message.slice(0, 2000)}`,
    });
  },
};
