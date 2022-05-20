module.exports = {
  name: "finish",
  execute: (queue) => {
    queue.textChannel?.send({
      content: "Queue finished!",
    });
  },
};
