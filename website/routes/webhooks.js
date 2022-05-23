const express = require("express");
const app = express.Router();
const { WebhookClient } = require("discord.js");
const testWebhook = new WebhookClient({
  id: "977637903784116234",
  token: process.env.TEST_WEBHOOK_TOKEN,
});
const mainWebhook = new WebhookClient({
  id: "977637785626361906",
  token: process.env.MAIN_WEBHOOK_TOKEN,
});
const { utc } = require("moment");

app.get("/", async (req, res) => {
  return res
    .status(400)
    .send({ code: 400, message: "No webhook provider given" });
});

app.post("/motion", async (req, res) => {
  var secret = req.headers.auth;
  if (secret != process.env.MOTION_SECRET)
    return res.status(400).send({ code: 400, message: "Incorrect Secret" });
  console.log(req.body);
});

app.post("/infinity", async (req, res) => {
  var secret = req.headers.authorization;
  if (secret != process.env.INFINITY_SECRET)
    return res.status(400).send({ code: 400, message: "Incorrect Secret" });
  var body = req.body;
  // console.log(body.type)
  switch (body.type.toLowerCase()) {
    case "test":
      const test_webhook_embed = new MessageEmbed()
        .setColor(colors.cyan)
        .setTitle("New Test Vote!")
        .setDescription(
          "A new test vote was recieved from IBL!\n\n**Vote for the bot [here](https://infinitybots.gg/bots/975450018360229908/vote)!**"
        )
        .addField(
          "Recieved At",
          `\`${utc(body.timeStamp).format("HH:MM:SS - MM/DD/YYYY")}\``
        );
      await testWebhook.send({
        embeds: [test_webhook_embed],
      });
      break;
    case "vote":
      const vote_embed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("New Vote!")
        .setDescription(
          "A new vote was recieved from IBL!\n\n**Vote for the bot [here](https://infinitybots.gg/bots/975450018360229908/vote)!**"
        )
        .addFields([
          {
            name: "Voted By",
            value: `\`${
              client.users.cache.get(body.userID).tag || body.userName
            }\``,
            inline: true,
          },
          {
            name: "Recieved At",
            value: `\`${utc(body.timeStamp).format("HH:MM:SS - MM/DD/YYYY")}\``,
            inline: true,
          },
          {
            name: "New Vote Count",
            value: `**\`${body.count}\`**`,
            inline: true,
          },
        ]);
      await mainWebhook.send({
        embeds: [vote_embed],
      });
      break;
  }
  return res
    .status(200)
    .send({ code: 200, message: "Vote Successfully Recieved" });
});

app.post("/void", async (req, res) => {
  var secret = req.headers.authorization;
  if (secret != process.env.VOID_SECRET)
    return res.status(400).send({ code: 400, message: "Incorrect Secret" });
  var body = req.body;
  switch (body.type.toLowerCase()) {
    case "test":
      const test_webhook_embed = new MessageEmbed()
        .setColor(colors.cyan)
        .setTitle("New Test Vote!")
        .setDescription(
          "A new test vote was recieved from Void Bots!\n\n**Vote for the bot [here](https://infinitybots.gg/bots/975450018360229908/vote)!**"
        )
        .addField(
          "Recieved At",
          `\`${utc(Date.now()).format("HH:MM:SS - MM/DD/YYYY")}\``
        );
      await testWebhook.send({
        embeds: [test_webhook_embed],
      });
      break;
    case "vote":
      const vote_embed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("New Vote!")
        .setDescription(
          "A new vote was recieved from Void Bots!\n\n**Vote for the bot [here](https://infinitybots.gg/bots/975450018360229908/vote)!**"
        )
        .addFields([
          {
            name: "Voted By",
            value: `\`${
              client.users.cache.get(body.user).tag || "Unknown User"
            }\``,
            inline: true,
          },
          {
            name: "Recieved At",
            value: `\`${utc(Date.now()).format("HH:MM:SS - MM/DD/YYYY")}\``,
            inline: true,
          },
        ]);
      await mainWebhook.send({
        embeds: [vote_embed],
      });
      break;
      return res
        .status(200)
        .send({ code: 200, message: "Vote Recieved Successfully" });
  }
});

app.post("/fates", async (req, res) => {
  var secret = req.headers.authorization;
  if (secret != process.env.FATES_SECRET)
    return res.status(400).send({ code: 400, message: "Incorrect Secret" });
  var body = req.body;
  // console.log(body)
  if (body.test == true) {
    const test_webhook_embed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("New Test Vote!")
      .setDescription(
        "A new test vote was recieved from Fates List!\n\n**Vote for the bot [here](https://fateslist.xyz/bot/975450018360229908)!**"
      )
      .addField(
        "Recieved At",
        `\`${utc(body.ts).format("HH:MM:SS - MM/DD/YYYY")}\``
      );
    await testWebhook.send({
      embeds: [test_webhook_embed],
    });
  } else {
    const vote_embed = new MessageEmbed()
      .setColor(colors.green)
      .setTitle("New Vote!")
      .setDescription(
        "A new vote was recieved from Fates List!\n\n**Vote for the bot [here](https://fateslist.xyz/bot/975450018360229908)!**"
      )
      .addFields([
        {
          name: "Voted By",
          value: `\`${client.users.cache.get(body.id).tag || "Unknown User"}\``,
          inline: true,
        },
        {
          name: "New Vote Count",
          value: `\`${body.votes}\``,
          inline: true,
        },
        {
          name: "Recieved At",
          value: `\`${utc(body.ts).format("HH:MM:SS - MM/DD/YYYY")}\``,
          inline: true,
        },
      ]);
    await mainWebhook.send({
      embeds: [vote_embed],
    });
  }
});

module.exports = app;
