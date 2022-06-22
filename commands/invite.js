const ms = require("ms");
const { Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Sends some invite links for the client",
  usage: "{prefix}invite",
  aliases: ["get"],
  cooldown: ms("5s"),
  type: "Other",
  userPermissions: [],
  clientPermissions: [],
  testing: false,
  nsfw: false,
  ownerOnly: false,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var neededPermissionsInvite =
      "https://discord.com/oauth2/authorize?client_id=975450018360229908&permissions=1632460340247&scope=bot%20applications.commands";
    var adminPermissionInvite =
      "https://discord.com/oauth2/authorize?client_id=975450018360229908&permissions=8&scope=bot%20applications.commands";

    const invitesEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle(`Invite ${client.user.username}!`)
      .addFields([
        {
          name: "Needed Permissions",
          value: `**[Invite](${neededPermissionsInvite})**`,
          inline: true,
        },
        {
          name: "Admin Permission",
          value: `**[Invite](${adminPermissionInvite})**`,
          inline: true,
        },
      ]);
    await message.reply({
      embeds: [invitesEmbed],
    });
  },
};
