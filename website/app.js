const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static("static"));

app.get(["/", "/home"], (req, res) => {
  res.status(200).send("Main page coming soon!");
});

app.listen(port);
