const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
  intents: Object.values(Intents.FLAGS),
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  shards: "auto",
});
const token = process.env.TOKEN;
const ranks = {
  bronze: "Bronze",
  10: "Silver",
  silver: "Silver",
  20: "Gold",
  gold: "Gold",
  30: "Platinum",
  plat: "Platinum",
  40: "Diamond",
  diamond: "Diamond",
  50: "Champion",
  champ: "Champion",
  60: "Grand Champion",
  gc: "Grand Champion",
  70: "Supersonic Legend",
  ssl: "Supersonic Legend",
};

global.Discord = require("discord.js");
global.client = client;
global.MessageEmbed = require("discord.js").MessageEmbed;
global.ranks = ranks;

client.commands = new Collection();
client.events = new Collection();

const handlers = fs
  .readdirSync("./handlers")
  .filter((file) => file.endsWith(".js"));

for (const handler of handlers) {
  require(`./handlers/${handler}`)(client, Discord);
}

client.login(token);
