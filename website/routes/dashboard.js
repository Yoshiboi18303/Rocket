const express = require("express");
const app = express.Router();
const { Permissions } = require("discord.js");

app.get("/", (req, res) => {
  res.status(200).render("dashboardcards", {
    req,
    client,
    Permissions
  });
});

app.get("/:id", (req, res) => {
  var id = req.params.id;
  if(!client.guilds.cache.has(id)) return res.redirect(`https://discord.com/oauth2/authorize?client_id=975450018360229908&permissions=412317244416&scope=bot&guild_id=${id}`)
  res.status(200).render("dashboard", {
    req,
    client,
    id
  })
})

module.exports = app;