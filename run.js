console.clear();
require("colors");
require("dotenv").config();

global.fs = require("fs");
global.mongoose = require("mongoose");
global.config = require("./config.json");
global.colors = require("./colors.json");
global.emojis = require("./emojis.json");

require("./client");
require("./mongo");

setTimeout(() => require("./website/app"), 10000);
