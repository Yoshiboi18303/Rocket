const { GuildBan } = require("discord.js");
const Log = require("../utils/logger");

module.exports = {
    name: "guildBanAdd",
    once: false,
    /**
     * @param {GuildBan} ban 
     */
    execute: async (ban) => {
        Log(ban.client, ban.guild, Enum.Log.BanLog, {
            user: ban.user,
            reason: ban.reason != null ? ban.reason : "Unknown/No Reason"
        })
    }
}