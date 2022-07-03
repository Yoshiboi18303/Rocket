const { GuildMember } = require("discord.js");
const { Canvas } = require("canvas");
const fs = require("fs");
const path = require("path")

/**
 * Returns the lowercase verion of a string
 * @param {String} string
 */
function convertToLowerCase(string) {
  const lowerCaseString = string.toLowerCase();
  return lowerCaseString;
}

/**
 * Returns the uppercase verion of a string
 * @param {String} string
 */
function convertToUpperCase(string) {
  const upperCaseString = string.toUpperCase();
  return upperCaseString;
}

/**
 * Reverses a string
 * @param {String} string
 */
function reverseString(string) {
  return string.split("").reverse().join("");
}

/**
 * Gets and returns the status of a Discord Guild Member
 * @param {GuildMember} user
 */
function returnUserStatusText(user) {
  var status_text = "";
  if (user.presence.status == "online") {
    status_text = `${emojis.online} **-** Online`;
  } else if (user.presence.status == "idle") {
    status_text = `${emojis.idle} **-** Idle/AFK`;
  } else if (user.presence.status == "dnd") {
    status_text = `${emojis.dnd} **-** Do Not Disturb`;
  } else {
    status_text = `${emojis.offline} **-** Invisible`;
  }
  return status_text;
}

/**
 * Turns text into Discord emojis
 * @param {String} text
 */
function emojifyText(text) {
  text = text.split("");
  var object = {
    a: ":regional_indicator_a:",
    b: ":regional_indicator_b:",
    c: ":regional_indicator_c:",
    d: ":regional_indicator_d:",
    e: ":regional_indicator_e:",
    f: ":regional_indicator_f:",
    g: ":regional_indicator_g:",
    h: ":regional_indicator_h:",
    i: ":regional_indicator_i:",
    j: ":regional_indicator_j:",
    k: ":regional_indicator_k:",
    l: ":regional_indicator_l:",
    m: ":regional_indicator_m:",
    n: ":regional_indicator_n:",
    o: ":regional_indicator_o:",
    p: ":regional_indicator_p:",
    q: ":regional_indicator_q:",
    r: ":regional_indicator_r:",
    s: ":regional_indicator_s:",
    t: ":regional_indicator_t:",
    u: ":regional_indicator_u:",
    v: ":regional_indicator_v:",
    w: ":regional_indicator_w:",
    x: ":regional_indicator_x:",
    y: ":regional_indicator_y:",
    z: ":regional_indicator_z:",
    " ": ":blue_square:",
    1: ":one:",
    2: ":two:",
    3: ":three:",
    4: ":four:",
    5: ":five:",
    6: ":six:",
    7: ":seven:",
    8: ":eight:",
    9: ":nine:",
    0: ":zero:",
  };
  let final = "";
  for (var char of text) {
    char = char.toLowerCase();
    if (!Object.keys(object).includes(char)) {
      final += char;
    } else {
      final += object[char];
    }
  }
  return final;
}

/**
 * Makes text fit into a canvas.
 * @param {Canvas} canvas
 * @param {String} text
 */
const applyText = (canvas, text) => {
  if (!(canvas instanceof Canvas))
    throw new TypeError("The canvas needs to be a type of Canvas!".red);
  if (!(canvas instanceof String)) text = `${text}`;
  const context = canvas.getContext("2d");

  var fontSize = 70;

  do {
    context.font = `${(fontSize -= 10)}px sans-serif`;
  } while (context.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return context.font;
};

/**
 * Returns all the commands sorted by type.
 * @returns An `Object` with all the command types.
 */
function sortCommands() {
  var commands = fs.readdirSync(path.join(__dirname, "..", "commands"));

  var object = {}

  for(var command of commands) {
    var cmd = require(`../commands/${command}`);
    var type = cmd.type;

    if(!Object.keys(object).includes(type)) {
      // console.log(object)
      object[type] = [
        cmd
      ]
    } else {
      object[type].push(cmd)
      // console.log(object)
    }
  }

  // console.log(object);

  return object;
}

module.exports = {
  convertToLowerCase,
  convertToUpperCase,
  reverseString,
  returnUserStatusText,
  emojifyText,
  applyText,
  sortCommands,
};
