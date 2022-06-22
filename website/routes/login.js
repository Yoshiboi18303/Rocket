const express = require("express");
const app = express.Router();
const passport = require("passport");
const fetch = require("node-fetch");

app.get("/", (req, res, next) => {
  req.session.redirect = req.query.redirect;
  req.session.save();

  passport.authenticate("discord", { failureRedirect: "/" })(req, res, next);
});

app.get(
  "/callback",
  passport.authenticate("discord", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    res.redirect(req.session.redirect || "/");
  }
);

app.get("/wakatime", (req, res) => {
  var redirectURL = `https://${config.origin}/login/wakatime/getcode`;
  res.redirect(
    `https://wakatime.com/oauth/authorize?client_id=${process.env.WAKATIME_CLIENT_ID}&response_type=code&redirect_uri=${redirectURL}&scope=email,read_logged_time,read_stats`
  );
});

app.get("/wakatime/getcode", async (req, res) => {
  res.send("Ready to recieve code, just read the URL!");
});

app.get("/wakatime/authorize", async (req, res) => {
  var redirectURL = `https://${config.origin}/login/wakatime/getcode`;
  var authorization = req.headers["authorization"];
  if (authorization != process.env.SECRET_AUTH_TOKEN)
    return res.status(403).send({ code: 403, message: "Forbidden" });
  var accessTokenRequest = await fetch.default(
    `https://wakatime.com/oauth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        code: req.query.code,
        grant_type: "authorization_code",
        client_id: process.env.WAKATIME_CLIENT_ID,
        client_secret: process.env.WAKATIME_CLIENT_SECRET,
        redirect_uri: redirectURL,
      }),
    }
  );
  var data = await accessTokenRequest.json();
  res.status(200).send(data);
});

module.exports = app;
