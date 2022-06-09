const express = require("express");
const app = express.Router();
const fs = require("fs");
const ticketFolders = fs.readdirSync("./tickets/");
const key = process.env.GOOGLE_ANALYTICS_KEY;

app.get("/:guild", (req, res) => {
  var guild = client.guilds.cache.get(req.params.guild);
  if (!guild) return res.redirect("/");
  var i = 1;
  var string = "";
  for (var folder of ticketFolders) {
    if (folder == guild.id) {
      var ticketFiles = fs.readdirSync(`tickets/${folder}`);
      for (var file of ticketFiles) {
        var buffer = fs.readFileSync(`tickets/${folder}/${file}`);
        string += `${i != 1 ? "\n" : ""}${buffer.toString()}`;
        i++;
      }
    }
  }
  return res.status(200).send(string);
});

app.get("/:guild/:channel", (req, res) => {
  var guild = client.guilds.cache.get(req.params.guild);
  if (!guild) return res.redirect("/");
  var channel = guild.channels.cache.get(req.params.channel);
  if (!channel) return res.redirect("/");
  try {
    var buffer = fs.readFileSync(`tickets/${guild.id}/${channel.id}.txt`);
    var array = buffer.toString().split("\n");
    res.status(200).render("transcript", {
      req,
      array,
      key,
    });
  } catch (e) {
    return res.redirect("/");
  }
});

module.exports = app;
