const puppeteer = require("puppeteer");
const { Message, MessageAttachment } = require("discord.js");

module.exports = {
  name: "capture",
  description: "Capture a webpage!",
  aliases: [],
  usage: "{prefix}capture <url>",
  nsfw: true,
  testing: true,
  ownerOnly: false,
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var url = args[0];
    if (!url) {
      const no_url_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription("❌ Please define a URL! ❌");
      return await message.reply({
        embeds: [no_url_embed],
      });
    }
    const screenshotting_embed = new MessageEmbed()
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL()}`,
      })
      .setColor(colors.yellow)
      .setTitle("Please Wait")
      .setDescription(`Taking a screenshot of [this page](${url})...`);
    var msg = await message.reply({
      embeds: [screenshotting_embed],
    });
    var browser = await puppeteer.launch();
    var page = await browser.newPage();
    await page.goTo(url);
    var screenshot = await page.screenshot();
    if (!(screenshot instanceof Buffer)) screenshot = Buffer.from(screenshot);
    var attachment = new MessageAttachment(screenshot, "capture.png");
    const screenshot_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Screenshot Taken")
      .setDescription("Here's your screenshot!")
      .setImage("attachment://capture.png");
    await msg.edit({
      embeds: [screenshot_embed],
      files: [attachment],
    });
  },
};
