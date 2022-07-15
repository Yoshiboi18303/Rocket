require("colors");
const wait = require("util").promisify(setTimeout);

module.exports = class Logger {
  constructor() {}

  /**
   * Sends a normal log message to stdout
   * @param {any} message
   */
  log(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [LOG]: ".cyan.bold + `${message}`.blue);
    return "Logged";
  }

  /**
   * Sends a warning to stdout
   * @param {any} message
   */
  warn(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [WARNING]: ".yellow.bold + `${message}`.yellow);
    return "Logged";
  }

  /**
   * Prints an error message to stderr
   * @param {any} error
   * @param {Boolean} exit
   * @returns `never` if exit is true, or `Logged` if exit is false.
   */
  async error(error, exit = false) {
    if (!error) throw new Error("Define an error!");
    if (!(exit instanceof Boolean) || typeof exit != "boolean") exit = !!exit;
    if (exit) {
      console.error("ROCKET [ERROR]: ".red.bold + `${error}`.red);
      await wait(10000);
      return process.exit(1);
    } else {
      console.error("ROCKET [ERROR]: ".red.bold + `${error}`.red);
      return "Logged";
    }
  }

  /**
   * Sends a success message to stdout
   * @param {any} message
   */
  success(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [SUCCESS]: ".green.bold + `${message}`.green);
    return "Logged";
  }

  /**
   * Sends a debug message to stdout
   * @param {any} message
   */
  debug(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [DEBUG]: ".yellow.bold + `${message}`.blue);
    return "Logged";
  }
};
