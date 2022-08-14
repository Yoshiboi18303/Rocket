const express = require("express");
const app = express.Router();
const { Permissions } = require("discord.js");
const key = process.env.GOOGLE_ANALYTICS_KEY;

/**
 * Checks if a user is blacklisted.
 * @param {express.Request} req
 * @param {express.Response} res
 */
const isBlacklisted = (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  if (req.user.blacklisted) return true;
  else return false;
};

app.get("/", (req, res) => {
  if (isBlacklisted(req, res) == true)
    return res.redirect(
      "/blacklisted?referral=dashboard&message=The bot and the website!"
    );
  if (!ready) return res.send("<h1>The client is offline!</h1>");
  // if(isBlacklisted(req, res, next) == true) return res.redirect("/blacklisted?referral=dashboard")

  var eligible_guilds = [];

  for (var guild of req.user.discord.guilds) {
    var perms = new Permissions(guild.permissions_new);

    guild.initials = guild.name
      .replace(/\w+/g, (name) => name[0])
      .replace(/\s/g, "");

    if (perms.has(Permissions.FLAGS.MANAGE_GUILD)) eligible_guilds.push(guild);
  }

  res.status(200).render("dashboardcards", {
    req,
    client,
    key,
    servers: eligible_guilds,
  });
});

app.get("/:id", (req, res) => {
  if (isBlacklisted(req, res) == true)
    return res.redirect("/blacklisted?referral=dashboard");
  if (!ready) return res.send("<h1>The client is offline!</h1>");
  var id = req.params.id;
  if (!client.guilds.cache.has(id))
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=975450018360229908&permissions=412317244416&scope=bot&guild_id=${id}`
    );
  var permissions = new Permissions(req.user.discord.guilds.find((guild) => guild.id == id).permissions_new)
  if (!permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return res.redirect("/dashboard", 308)
  res.status(200).render("dashboard", {
    req,
    client,
    id,
    key,
  });
});

module.exports = app;
