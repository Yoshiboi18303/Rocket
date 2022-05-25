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
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { DisTube } = require("distube");
const distube = new DisTube(client, {
  plugins: [
    new SoundCloudPlugin(),
    new SpotifyPlugin({
      api: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    }),
    new YtDlpPlugin(),
  ],
  searchSongs: 15,
  youtubeDL: false,
});
const Radar = require("radarbots.js")
const radar = new Radar(client, process.env.RADAR_KEY)

global.Discord = require("discord.js");
global.client = client;
global.MessageEmbed = require("discord.js").MessageEmbed;
global.ranks = ranks;
global.status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? "Queue" : "This Song") : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
global.distube = distube;
global.ms = require("ms");

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
