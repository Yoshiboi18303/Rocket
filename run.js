console.clear();
require("colors");
require("dotenv").config();
const LoggerClass = require("./classes/Logger");

global.fs = require("fs");
global.mongoose = require("mongoose");
global.config = require("./config.json");
global.colors = require("./colors.json");
global.emojis = require("./emojis.json");
global.ready = false;

const Logger = new LoggerClass();
var i = 0;

setInterval(() => {
  if (ready == false) {
    // console.log(i);
    if (i >= 60)
      return Logger.error(
        "The bot didn't start up within the first minute of the app being run, this may be due to an error preventing the bot from starting or a 429 while trying to connect. Exiting the process immediately.",
        true
      );
    else i++;
  }
}, 1000);

Logger.log("Starting bot...");
require("./client");

Logger.log("Starting MongoDB...");
require("./mongo");

setTimeout(() => {
  Logger.log("Starting website...");
  require("./website/app");
}, 10000);
