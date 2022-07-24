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
const Radar = require("radarbots.js");
const radar = new Radar(client, process.env.RADAR_KEY);
module.exports.radar = radar;
const { Client: StatcordClient } = require("statcord.js");
const statcord = new StatcordClient({
  client,
  key: process.env.STATCORD_KEY,
  postCpuStatistics: true,
  postMemStatistics: true,
  postNetworkStatistics: true,
});

global.Discord = require("discord.js");
global.client = client;
global.MessageEmbed = require("discord.js").MessageEmbed;
global.ranks = ranks;
global.ms = require("ms");
global.Enum = {
  Log: {
    Info: 0,
    Error: 1,
    Kick: 2,
    Ban: 3,
    Mute: 4,
    Softban: 5,
    Tempban: 6,
    MessageEdit: 7,
    MessageDelete: 8,
    ChannelCreate: 9,
    ChannelDelete: 10,
    Purge: 11,
  },
  Actions: {
    None: 0,
    Delete: 1,
    DeleteWarn: 2,
    0: "None",
    1: "Delete Message",
    2: "Delete Message & Warn Member",
  },
};
global.statcord = statcord;
global.fightsStarted = 0;

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.radar = radar;

const handlers = fs
  .readdirSync("./handlers")
  .filter((file) => file.endsWith(".js"));

for (const handler of handlers) {
  require(`./handlers/${handler}`)(client, Discord);
}

client.login(token);
