module.exports = {
  name: "addSong",
  execute: (queue, song) => {
    queue.textChannel?.send({
      content: `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`,
    });
  },
};
