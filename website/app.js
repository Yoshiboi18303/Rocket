const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
// const TwitterStrategy = require("passport-twitter").Strategy;
const Users = require("../schemas/userSchema");
const bodyParser = require("body-parser");
const utc = require("moment").utc;
// const Twitter = require("../schemas/twitterSchema");
const key = process.env.GOOGLE_ANALYTICS_ID;
const Reviews = require("../schemas/reviewSchema");
const LoggerClass = require("../classes/Logger");
const Logger = new LoggerClass();
const { sortCommands } = require("../utils/");

app.use(
  require("express-session")({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: require("connect-mongo").create({
      mongoUrl: process.env.MONGO_CS,
      ttl: 86400 * 2, // 2 days
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  var User = await Users.findOne({ id: user.id });
  if (!user) {
    user = new Users({
      id: user.id,
    });
    user.save();
  }
  if (!User) {
    User = new Users({
      id: user.id,
    });
    User.save();
  }

  done(null, {
    id: user.id,
    discord: user,
    voted: User.voted,
    blacklisted: User.blacklisted,
  });
});

passport.use(
  new DiscordStrategy(
    {
      clientID: "975450018360229908",
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/login/callback",
      scope: ["identify", "guilds"],
    },
    (access, refresh, profile, done) => {
      process.nextTick(() => {
        done(null, profile);
      });
    }
  )
);

app.use("/static", express.static("website/static"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/webhooks", require("./routes/webhooks"));
app.use("/report", require("./routes/report"));
app.use("/tickets", require("./routes/tickets"));
app.use("/shortlinks", require("./routes/shortlinks"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get(["/", "/home"], async (req, res) => {
  var reviews = await Reviews.find({});
  var count = await Reviews.countDocuments();
  // console.log(count)
  if (!Array.isArray(reviews)) reviews = [reviews];
  res.status(200).render("index", {
    req,
    key,
    reviews,
    count,
    client,
  });
});

app.get("/features", (req, res) => {
  res.status(200).render("features", {
    req,
    key,
  });
});

app.get("/owner", (req, res) => {
  res.redirect("https://yoshiboi18303-website-recoded.yoshiboi18303.repl.co/");
});

app.get("/stats", async (req, res) => {
  if (!ready) return res.send("<h1>The client is offline!</h1>");
  res.status(200).render("stats", {
    req,
    client,
    utc,
    distube,
    users: await Users.countDocuments(),
    key,
  });
});

app.get("/blacklisted", (req, res) => {
  if (!req.query.referral || !req.isAuthenticated()) return res.redirect("/");
  res.status(403).render("blacklisted", {
    req,
    key,
  });
});

app.get(["/commands", "/cmds"], (req, res) => {
  var commands = sortCommands()
  res.status(200).render("commands", {
    req,
    key,
    commands,
  })
})

app.all("*", (req, res) => {
  res.status(404).render("notfound", {
    req,
    key,
    route: req._parsedOriginalUrl.path.replace("/", ""),
  });
});

app.listen(port);
Logger.success(
  `The website for ${"Rocket".bold}` +
    ` is now listening on port ${`${port}`.bold}` +
    "!"
);
