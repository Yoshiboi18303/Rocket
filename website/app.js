const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const Users = require("../schemas/userSchema");
const bodyParser = require("body-parser");

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
  if (!user)
    user = new Users({
      id: user.id,
    });
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get(["/", "/home"], (req, res) => {
  res.status(200).render("index", {
    req,
  });
});

app.get("/features", (req, res) => {
  res.status(200).render("features", {
    req,
  });
});

app.get("/owner", (req, res) => {
  res.redirect("https://yoshiboi18303-website-recoded.yoshiboi18303.repl.co/");
});

app.listen(port);
console.log(
  `The website for ${"Rocket-Conomy".blue}`.green +
    ` is now listening on port ${`${port}`.blue}`.green +
    "!".green
);
