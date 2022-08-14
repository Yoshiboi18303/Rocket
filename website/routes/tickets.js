const express = require("express");
const app = express.Router();
const fs = require("fs");
const ticketFolders = fs.readdirSync("./tickets/");
const key = process.env.GOOGLE_ANALYTICS_KEY;

app.get("/", (req, res) => {
  res.status(200).send("This would be for a transcript, don't be peeking now!");
});

app.get("/:guild", (req, res) => {
  if (!ready) return res.send("<h1>The client is offline!</h1>");
  var guild = client.guilds.cache.get(req.params.guild);
  if (!guild) return res.redirect("/");
  var transcripts = [];
  for (var folder of ticketFolders) {
    if (folder == guild.id) {
      var ticketFiles = fs.readdirSync(`tickets/${folder}`);
      var toPush = ticketFiles.map(
        (v, i) => `${i + 1} - ${v.replace(".txt", "").split("\n").join("\n")}`
      );
      transcripts.push(toPush);
    }
  }
  return res.status(200).send(transcripts.join("\n"));
});

app.get("/:guild/:channel", (req, res) => {
  if (!ready) return res.send("<h1>The client is offline!</h1>");
  var guild = client.guilds.cache.get(req.params.guild);
  if (!guild) return res.redirect("/");
  var channel = req.params.channel;
  try {
    var buffer = fs.readFileSync(`tickets/${guild.id}/${channel}.txt`);
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
