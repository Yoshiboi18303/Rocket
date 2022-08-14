const shell = require("shelljs");
const Log = require("../utils/logger");
const ms = require("ms");

module.exports = {
    name: "restart",
    description: "Restarts the bot (owner only)",
    usage: "{prefix}restart",
    type: "Owner",
    cooldown: ms("1s"),
    aliases: "rs",
    ownerOnly: true,
    execute: async (message) => {
        if (message.author.id == "381710555096023061") {
            return await message.reply({
                content: "You aren't authorized to run this command (yet)!"
            })
        }
        await message.reply({
            content: "Restarting..."
        })
        Log(client, message.guild, Enum.Log.Info, {
            message: "A restart was issued, please wait for Rocket to restart!"
        })
            .then(() => {
                shell.exec("pm2 restart 0")
            })
    }
}
