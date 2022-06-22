const express = require("express");
const app = express.Router();
var channel = client.channels.cache.get(config.reportChannel);
const key = process.env.GOOGLE_ANALYTICS_ID;
const Reviews = require("../../schemas/reviewSchema");

/**
 * Checks if a user is blacklisted.
 * @param {express.Request} req
 * @param {express.NextFunction} next
 */
const isBlacklisted = (req, next) => {
  if (!req.isAuthenticated()) return next();
  if (req.user.blacklisted) return true;
  else return false;
};

app.get("/", (req, res) => {
  res.render("reportchoice", {
    req,
    key,
  });
});

app.get("/:type", (req, res, next) => {
  if (isBlacklisted(req, next))
    return res.redirect("/blacklisted?referral=report");
  if (!ready) return res.send("<h1>The client is offline!</h1>");
  var type = req.params.type;
  if (!["bug", "suggestion", "user", "review"].includes(type))
    return res.redirect("/report");
  var msg = req.query.message || "";
  var error = req.query.error?.toLowerCase() == "true" ? true : false;
  switch (type) {
    case "bug":
      res.render("bugreport", {
        req,
        msg,
        error,
        key,
      });
      break;
    case "suggestion":
      res.render("suggest", {
        req,
        msg,
        error,
        key,
      });
      break;
    case "user":
      res.render("userreport", {
        req,
        msg,
        error,
        key,
      });
      break;
    case "review":
      var placeholder = req.query.placeholder || "";
      res.render("review", {
        req,
        msg,
        error,
        key,
        client,
        placeholder,
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

app.post("/sendreview", async (req, res) => {
  var user = client.users.cache.get(req.user?.id);
  if (!user) user = client.users.cache.get(req.body.user?.id);
  var contentType = req.headers["content-type"];
  if (contentType != "application/json")
    return res
      .status(400)
      .send({ code: 400, message: "Invalid Content Type Header" });
  var body = req.body;
  var stars = parseInt(body.stars);
  if (isNaN(stars))
    return res.status(400).send({ code: 400, message: "Invalid Body" });
  if (stars <= 0 || stars > 5)
    return res
      .status(400)
      .send({ code: 400, message: "Stars Too High or Too Low" });

  /**
   * Returns the corresponding star count to your input.
   * @param {Number} input
   */
  const returnStars = (input) => {
    if (!(input instanceof Number)) input = parseInt(input);
    if (isNaN(input)) throw new Error("Invalid Input");
    var final = "";
    switch (input) {
      case 1:
        final = "⭐";
        break;
      case 2:
        final = "⭐⭐";
        break;
      case 3:
        final = "⭐⭐⭐";
        break;
      case 4:
        final = "⭐⭐⭐⭐";
        break;
      case 5:
        final = "⭐⭐⭐⭐⭐";
        break;
    }
    return final;
  };

  var data = new Reviews({
    user: user.id,
    starCount: stars,
    formattedStars: returnStars(stars),
    review: req.body.review,
  });
  data.save();

  const review_embed = new MessageEmbed()
    .setColor(colors.cyan)
    .setTitle("New Review!")
    .setDescription("A new review on the bot was recieved!")
    .addFields([
      {
        name: "Reviewer",
        value: `${user.username}`,
        inline: true,
      },
      {
        name: "Stars",
        value: `${returnStars(stars)} (${stars})`,
        inline: true,
      },
      {
        name: "Review",
        value: `\`\`\`\n${req.body.review}\n\`\`\``,
        inline: true,
      },
    ]);
  await channel.send({
    content: `<@${config.owner}>`,
    embeds: [review_embed],
  });
  return res.status(200).send({ code: 200, message: "Review Recieved" });
});

module.exports = app;
