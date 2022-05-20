module.exports = {
  name: "playSong",
  execute: (queue, song) => {
    queue.textChannel?.send({
      content: `Playing \`${song.name}\` - \`${
        song.formattedDuration
      }\`\nRequested by: ${song.user.username}\n${status(queue)}`,
    });
  },
};
