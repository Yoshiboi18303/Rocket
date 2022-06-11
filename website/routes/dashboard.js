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
  if(isBlacklisted(req, res) == true) return res.redirect("/blacklisted?referral=dashboard")
  if(!ready) return res.send("<h1>The client is offline!</h1>")
  // if(isBlacklisted(req, res, next) == true) return res.redirect("/blacklisted?referral=dashboard")
  res.status(200).render("dashboardcards", {
    req,
    client,
    Permissions,
    key,
  });
});

app.get("/:id", (req, res) => {
  if(isBlacklisted(req, res) == true) return res.redirect("/blacklisted?referral=dashboard")
  if(!ready) return res.send("<h1>The client is offline!</h1>")
  var id = req.params.id;
  if (!client.guilds.cache.has(id))
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=975450018360229908&permissions=412317244416&scope=bot&guild_id=${id}`
    );
  res.status(200).render("dashboard", {
    req,
    client,
    id,
    key,
  });
});

module.exports = app;
