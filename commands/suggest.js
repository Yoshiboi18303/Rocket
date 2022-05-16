module.exports = {
  name: "suggest",
  description: "Gives you info on how to suggest a feature for the bot!",
  usage: "{prefix}suggest",
  execute: async (message) => {
    const embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setDescription(
        "You can suggest a feature for the bot [here](https://yoshiboi18303.tk/suggest)!"
      );
    await message.reply({
      embeds: [embed],
    });
  },
};
