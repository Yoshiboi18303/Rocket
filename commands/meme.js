const { Message, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "meme",
  description: "Get a funny meme from Reddit",
  usage: "{prefix}meme",
  aliases: [],
  userPermissions: [],
  clientPermissions: [],
  cooldown: ms("2s"),
  type: "Fun",
  testing: true,
  ownerOnly: false,
  voteOnly: false,
  nsfw: false,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var memeTypes = ["meme", "memes", "wholesomememes", "dankmemes"];
    var memeType = memeTypes[Math.floor(Math.random() * memeTypes.length)];
    var req = await fetch.default(
      `https://weebyapi.xyz/json/meme?category=${memeType}&token=${process.env.WEEBY_KEY}`,
      {
        method: "GET",
      }
    );
    var data = await req.json();
    const memeEmbed = new MessageEmbed()
      .setAuthor({
        name: `${data.author}`,
        url: `https://reddit.com/user/${data.author}`,
      })
      .setTitle(data.title)
      .setImage(data.url)
      .setURL(data.permaURL)
      .setFooter({
        text: `From r/${data.subreddit}`,
      })
      .setTimestamp(data.date);
    await message.reply({
      embeds: [memeEmbed],
    });
  },
};
