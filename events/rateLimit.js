const { RateLimitData } = require("discord.js");

module.exports = {
  name: "rateLimit",
  once: false,
  /**
   * @param {RateLimitData} data
   */
  execute: (data) => {
    console.log(data.red);
  },
};
