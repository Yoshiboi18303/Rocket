const express = require("express");
const app = express.Router();
var channel = client.channels.cache.get(config.reportChannel);

app.get("/", (req, res) => {
  res.render("reportchoice", {
    req,
  });
});

app.get("/:type", (req, res) => {
  var type = req.params.type;
  if (!["bug", "suggestion", "user"].includes(type))
    return res.redirect("/report");
  var msg = req.query.message || "";
  var error = req.query.error?.toLowerCase() == "true" ? true : false;
  switch (type) {
    case "bug":
      res.render("bugreport", {
        req,
        msg,
        error,
      });
      break;
    case "suggestion":
      res.render("suggest", {
        req,
        msg,
        error,
      });
      break;
    case "user":
      res.render("userreport", {
        req,
        msg,
        error,
      });
      break;
  }
});

app.post("/submitbug", async (req, res) => {
  var content_type = req.headers["content-type"];
  // console.log(content_type)
  if (content_type != "application/json")
    return res
      .status(400)
      .send({ code: 400, message: "Invalid Content-Type Header" });
  var bug = req.body.bug;
  if (!bug)
    return res.status(400).send({ code: 400, message: "No Bug Provided" });
  const bug_report_embed = new MessageEmbed()
    .setColor(colors.orange)
    .setTitle("New Bug Report")
    .setDescription("A new bug report was recieved!")
    .addFields([
      {
        name: "User",
        value: `${req.user.discord.username} (\`${req.user.id}\`)`,
        inline: true,
      },
      {
        name: "Bug",
        value: `${bug}`,
        inline: true,
      },
    ]);
  await channel.send({
    content: `<@${config.owner}>`,
    embeds: [bug_report_embed],
  });
  return res
    .status(200)
    .send({ code: 200, message: "Bug Reported Successfully" });
});

app.post("/sendsuggestion", async (req, res) => {
  var contentType = req.headers["content-type"];
  if (contentType != "application/json")
    return res
      .status(400)
      .send({ code: 400, message: "Invalid Content-Type Header" });
  var object = {
    shopitem: "Shop Item",
    command: "Command",
    website: "Website",
    other: "Other",
  };
  if (!Object.keys(object).includes(req.body.type))
    return res
      .status(400)
      .send({ code: 400, message: "Invalid Suggestion Type" });
  const suggestion_embed = new MessageEmbed()
    .setColor(colors.cyan)
    .setTitle("New Suggestion!")
    .setDescription("A new suggestion was sent!")
    .addFields([
      {
        name: "User",
        value: `${req.user.discord.username} (\`${req.user.id}\`)`,
        inline: true,
      },
      {
        name: "Suggestion Type",
        value: `${object[req.body.type]}`,
        inline: true,
      },
      {
        name: "Suggestion",
        value: `${req.body.suggestion}`,
        inline: true,
      },
    ]);
  await channel.send({
    content: `<@${config.owner}>`,
    embeds: [suggestion_embed],
  });
  return res
    .status(200)
    .send({ code: 200, message: "Suggestion Sent Successfully" });
});

app.post("/sendreport", async (req, res) => {
  var contentType = req.headers["content-type"];
  if (contentType != "application/json")
    return res
      .status(400)
      .send({ code: 400, message: "Invalid Content-Type Header" });
  var id = req.body.id;
  var description = req.body.description;
  var user = client.users.cache.get(id);
  // console.log(req.body)
  if (!user)
    return res.status(400).send({ code: 400, message: "Unknown User" });
  const user_report_embed = new MessageEmbed()
    .setColor(colors.dred)
    .setTitle("New User Report")
    .setDescription("A new user report was sent!")
    .addFields([
      {
        name: "Reporter",
        value: `${req.user.discord.username} (\`${req.user.id}\`)`,
        inline: true,
      },
      {
        name: "Reported User",
        value: `${user.username} (\`${id}\`)`,
        inline: true,
      },
      {
        name: "Description",
        value: `\`\`\`\n${description}\n\`\`\``,
        inline: true,
      },
    ]);
  await channel.send({
    content: `<@${config.owner}>`,
    embeds: [user_report_embed],
  });
  return res
    .status(200)
    .send({ code: 200, message: "Report Sent Successfully" });
});

module.exports = app;
