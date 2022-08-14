const LoggerClass = require("../classes/Logger");
const Logger = new LoggerClass();

module.exports = {
    name: "warn",
    once: false,
    execute: (warning) => {
        Logger.warn(warning)
    }
}
