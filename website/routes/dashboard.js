const express = require("express");
const app = express.Router();
const { Permissions } = require("discord.js");

/**
 * Checks if a user is blacklisted.
 * @param {express.Request} req
 * @param {express.NextFunction} next
 */
const isBlacklisted = async (req, next) => {
  if (!req.isAuthenticated()) return next();
  if (req.user.blacklisted) return true;
  else return false;
};

app.get("/", (req, res, next) => {
  // if(isBlacklisted(req, res, next) == true) return res.redirect("/blacklisted?referral=dashboard")
  res.status(200).render("dashboardcards", {
    req,
    client,
    Permissions,
  });
});

app.get("/:id", (req, res, next) => {
  // if(isBlacklisted(req, res, next) == true) return res.redirect("/blacklisted?referral=dashboard")
  var id = req.params.id;
  if (!client.guilds.cache.has(id))
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=975450018360229908&permissions=412317244416&scope=bot&guild_id=${id}`
    );
  res.status(200).render("dashboard", {
    req,
    client,
    id,
  });
});

module.exports = app;
