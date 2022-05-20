module.exports = {
  name: "empty",
  execute: (queue) => {
    const leavingEmbed = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription("⚠️ Leaving the Voice Channel due to inactivity. ⚠️");
    queue.textChannel?.send({
      embeds: [leavingEmbed],
    });
  },
};
