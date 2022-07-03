const { Message, MessageEmbed, MessageAttachment } = require("discord.js");
const ms = require("ms");
const puppeteer = require("puppeteer");

module.exports = {
  name: "capture",
  description: "Captures a webpage and returns the screenshot",
  usage: "{prefix}capture <url>",
  aliases: ["screenshot"],
  type: "Utility",
  cooldown: ms("5s"),
  userPermissions: [],
  clientPermissions: [],
  testing: true,
  ownerOnly: false,
  voteOnly: false,
  nsfw: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var url = args[0];
    // console.log(url)
    if (!url) {
      const noUrlEmbed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("Please enter a URL to go to!");
      return await message.reply({
        embeds: [noUrlEmbed],
      });
    }
    const screenshottingEmbed = new MessageEmbed()
      .setColor(colors.yellow)
      .setTitle("Please Wait...")
      .setDescription(`Taking a screenshot of [this page](${url})...`)
      .setTimestamp();
    var msg = await message.reply({
      embeds: [screenshottingEmbed],
    });
    const browser = await puppeteer.launch();
    var page = await browser.newPage();
    page
      .goto(url, {
        timeout: 0,
      })
      .then(async () => {
        var buffer = await page.screenshot();
        if (buffer instanceof String || typeof buffer == "string")
          buffer = Buffer.from(buffer);
        var attachment = new MessageAttachment(buffer, "screenshot.png");
        await browser.close();
        const screenshotEmbed = new MessageEmbed()
          .setColor(colors.black)
          .setTitle("Screenshot")
          .setDescription("Here is your screenshot!")
          .setImage("attachment://screenshot.png");
        await msg.edit({
          embeds: [screenshotEmbed],
          files: [attachment],
        });
      })
      .catch(async (e) => {
        await browser.close();
        return await msg.edit({
          content: `An error occurred: \`${`${e}`.slice(0, 2000)}\``,
          embeds: [],
        });
      });
  },
};
