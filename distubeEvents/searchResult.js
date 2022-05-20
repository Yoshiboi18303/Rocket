module.exports = {
  name: "searchResult",
  execute: async (message, result) => {
    let i = 0;
    const search_results_embed = new MessageEmbed()
      .setColor(colors.yellow)
      .setDescription(
        `**Choose an option from below**\n${result
          .map(
            (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
          )
          .join("\n")}\n*Enter anything else or wait 30 seconds to cancel*`
      );
    await message.reply({
      embeds: [search_results_embed],
    });
  },
};
