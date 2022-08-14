const Users = require("../schemas/userSchema");
const {
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "rockpaperscissors",
  description: "Play RPS with a friend (or the bot)!",
  usage: "{prefix}rockpaperscissors [@user | user id | none] [bet]",
  type: "Games",
  cooldown: ms("15s"),
  testOnly: true,
  aliases: "rps",
  userPermissions: [],
  clientPermissions: [],
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message, args) => {
    var user =
      message.mentions.users.first() ||
      message.client.users.cache.get(args[0]) ||
      null;
    var bet = parseInt(args[1]);
    var OpposingUserBet;
    var EndUser = await Users.findOne({ id: message.author.id });
    if (!EndUser) {
      EndUser = new Users({
        id: message.author.id,
      });
      EndUser.save();
    }
    var OpposingUser = null;
    if (user != null) {
      OpposingUser = await Users.findOne({
        id: user.id,
      });
      if (!OpposingUser) {
        OpposingUser = new Users({
          id: user.id,
        });
        OpposingUser.save();
      }
      OpposingUserBet = bet;
    }
    var minimumAmount = 200;
    if (isNaN(bet)) {
      bet = args[1];
      if (bet == "all" || bet == "max" || bet == "maximum") {
        bet = EndUser.tokens;
        OpposingUserBet = OpposingUser.tokens;
      } else if (bet == "half") {
        bet = EndUser.tokens / 2;
        OpposingUserBet = OpposingUser.tokens / 2;
      } else if (bet == "min" || bet == "minimum") {
        bet = minimumAmount;
        OpposingUserBet = minimumAmount;
      } else bet = null;
    }
    /**
     * Checks if the game is complete.
     * @param {String} a
     * @param {String} b
     * @returns `true` if the game is complete, `tied` if it's tied, otherwise `false`
     */
    const checkIfDone = (a, b) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      var finished;
      var validResponses = ["rock", "paper", "scissors"];
      if (!a in validResponses || !b in validResponses)
        throw new Error(
          `Argument ${
            !a in validResponses ? "a" : !b in validResponses ? "b" : "unknown"
          } has an invalid response!`
        );
      if (a == "rock" && b == "paper") {
        finished = true;
      } else if (b == "rock" && a == "paper") {
        finished = true;
      } else if (a == "paper" && b == "scissors") {
        finished = true;
      } else if (b == "paper" && a == "scissors") {
        finished = true;
      } else if (a == "rock" && b == "scissors") {
        finished = true;
      } else if (b == "rock" && a == "scissors") {
        finished = true;
      }
      return finished;
    };
    if (bet != null) {
      if (user == null) {
        var botChose = "";
        var userChose = "";
      } else {
      }
    } else {
      if (user == null) {
      } else {
      }
    }
  },
};
