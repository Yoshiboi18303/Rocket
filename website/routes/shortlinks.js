const express = require("express");
const app = express.Router();
const ShortLinks = require("../../schemas/shortLinkSchema");
const key = process.env.GOOGLE_ANALYTICS_KEY;
const { MessageEmbed, MessageAttachment } = require("discord.js");
const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

app.get("/", async (req, res) => {
  /*
  var auth = req.query.auth;
  if (auth != process.env.SHORT_LINK_CREATION_AUTH)
    return res
      .status(403)
      .send({ code: 403, message: "You are unauthorized to see this page!" });
  */
  var msg = req.query.message || "";
  var error = req.query.error == "true" ? true : false;
  var id = req.query.id;
  if (
    (req.headers["x-forwarded-for"] || req.socket.remoteAddress) in
    process.env.BANNED_IPS
  ) {
    // I did this for readability
    var message = "Creating Short Links!".toLowerCase();
    return res.render("blacklisted", {
      req,
      key,
      message,
    });
  }
  res.render("createshortlink", {
    req,
    key,
    // auth: process.env.SHORT_LINK_CREATION_AUTH,
    msg,
    error,
    ShortLinks,
    id,
  });
});

app.post("/", async (req, res) => {
  var id = req.body.id;
  var link = req.body.link;
  var userIP = req.body.ip;
  var request = await fetch.default(
    `https://spoopy.oceanlord.me/api/check_website?website=${link}`,
    {
      method: "GET",
    }
  );
  var data = await request.json();
  data = data.processed.urls[link];
  console.log(data);
  if (!data?.safe || data.not_safe_reasons?.length > 0)
    return res.status(400).json({ code: 400, message: "Unsafe Link" });
  var data = new ShortLinks({
    id,
    link,
    userIP,
  });
  data.save();
  const newShortLinkEmbed = new MessageEmbed()
    .setColor(colors.green)
    .setTitle("Short Link Created")
    .setDescription(
      "A new short link was created ||(preview below if `puppeteer` can handle going to the link)||."
    )
    .addFields([
      {
        name: "Short Link ID",
        value: `\`\`\`\n${id}\n\`\`\``,
        inline: true,
      },
      {
        name: "Link",
        value: `\`\`\`\n${link}\n\`\`\``,
        inline: true,
      },
    ]);
  const browser = await puppeteer.launch();
  var page = await browser.newPage();
  var showAttachment = true;
  await page
    .goto(link, {
      timeout: 0,
    })
    .catch(() => (showAttachment = false));
  if (showAttachment) {
    var buffer = await page.screenshot();
    if (buffer instanceof String || typeof buffer == "string")
      buffer = Buffer.from(buffer);
    var attachment = new MessageAttachment(buffer, "preview.png");
    newShortLinkEmbed.setImage("attachment://preview.png");
  }
  client.channels.cache.get("981617877092298853").send({
    embeds: [newShortLinkEmbed],
    files: showAttachment ? [attachment] : [],
  });
  await browser.close();
  return res.status(200).json({ code: 200, message: "Short Link Created" });
});

app.get("/:id", async (req, res) => {
  var id = req.params.id;
  var ShortLink = await ShortLinks.findOne({
    id,
  });
  if (!ShortLink)
    return res
      .status(404)
      .send({ code: 404, message: "Couldn't find that short link" });
  ShortLinks.findOneAndUpdate(
    {
      id,
    },
    {
      $inc: {
        visits: 1,
      },
    }
  ).then((data) => data.save());
  return res.redirect(ShortLink.link, 308);
});

module.exports = app;
