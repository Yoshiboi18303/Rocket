const { Message } = require("discord.js");
const ms = require("ms");
const wait = require("util").promisify(setTimeout);

module.exports = {
  name: "eightball",
  description: "Ask the magic eight ball something!",
  usage: "{prefix}eightball <question>",
  aliases: "8ball",
  type: "Fun",
  cooldown: ms("5s"),
  testing: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var question = args.join(" ");
    if (!question)
      return await message.reply({
        content: "Please provide a question for the magic eight ball!",
      });
    var answers = [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes, definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",
      "Reply hazy try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
    ];
    var answer = answers[Math.floor(Math.random() * answers.length)];
    var msg = await message.reply({
      content: `You asked the magic eight ball **\`${question}\`** and shook it...`,
    });
    await wait(5000);
    msg = await msg.edit({
      content: "And the magic eight ball says...",
    });
    await wait(5000);
    await msg.edit({
      content: `"${answer}"`,
    });
  },
};
