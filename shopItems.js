const emojis = require("./emojis.json");

module.exports = [
  {
    name: "XP Booster",
    id: "xpbooster",
    desc: "Boosts how much XP you get from winning a minigame",
    emoji: emojis.xpbooster,
    image: "https://cdn.discordapp.com/emojis/976293124710236230.png",
    type: "powerup",
    price: 250,
  },
  {
    name: "Padlock",
    id: "padlock",
    desc: "An item used to prevent a shifty person from taking your precious tokens",
    emoji: emojis.padlock,
    image: "https://cdn.discordapp.com/emojis/927438274287501342.png",
    type: "powerup",
    price: 350,
  },
  {
    name: "Machete",
    id: "machete",
    desc: "Prevents whoever tries to steal from you and has a chance to take some extra money back from the thief!",
    emoji: emojis.machete,
    image: "https://cdn.discordapp.com/emojis/1001610911385124884.png",
    type: "powerup",
    price: 600,
  },
  {
    name: "Gloves",
    id: "gloves",
    desc: "Adds another chance for you to steal more money from a user!",
    emoji: emojis.gloves,
    image: "https://cdn.discordapp.com/emojis/1001916487197536357.png",
    type: "powerup",
    price: 450,
  },
];
