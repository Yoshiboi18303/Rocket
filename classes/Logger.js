require("colors");

module.exports = class Logger {
  constructor() {}

  /**
   * Sends a normal log message to stdout
   * @param {any} message - The message to log
   */
  log(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [LOG]: ".cyan.bold + `${message}`.blue);
    return "Logged";
  }

  /**
   * Sends a warning to stdout
   * @param {any} message - The warning message
   */
  warn(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [WARNING]: ".yellow.bold + `${message}`.yellow);
    return "Logged";
  }

  /**
   * Prints an error message to stderr
   * @param {any} error - The error message
   * @param {Boolean} exit - Whether to exit the process
   * @returns `never` if exit is true, or `Logged` if exit is false.
   */
  async error(error, exit = false) {
    if (!error) throw new Error("Define an error!");
    if (!(exit instanceof Boolean) || typeof exit != "boolean") exit = !!exit;
    if (exit) {
      console.error("ROCKET [ERROR]: ".red.bold + `${error}`.red);
      return process.exit(1);
    } else {
      console.error("ROCKET [ERROR]: ".red.bold + `${error}`.red);
      return "Logged";
    }
  }

  /**
   * Sends a success message to stdout
   * @param {any} message - The success message
   */
  success(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [SUCCESS]: ".green.bold + `${message}`.green);
    return "Logged";
  }

  /**
   * Sends a debug message to stdout
   * @param {any} message - The debug message
   */
  debug(message) {
    if (!message) throw new Error("Define a message!");
    console.log("ROCKET [DEBUG]: ".yellow.bold + `${message}`.blue);
    return "Logged";
  }
};
