const LoggerClass = require("../classes/Logger");
const Logger = new LoggerClass();

module.exports = {
  name: "debug",
  execute: (info) => {
    Logger.debug(info);
  },
};
