const { GuildBan } = require("discord.js");
const Log = require("../utils/logger");

module.exports = {
    name: "guildBanRemove",
    once: false,
    /**
     * @param {GuildBan} ban
     */
    execute: async (ban) => {
        Log(ban.client, ban.guild, Enum.Log.UnbanLog, {
            user: ban.user,
        })
    }
}