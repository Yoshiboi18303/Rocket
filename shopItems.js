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
];
