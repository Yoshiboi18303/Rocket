const { GuildMember, MessageAttachment } = require("discord.js");
const Guilds = require("../schemas/guildSchema");
const fetch = require("node-fetch");
// const { isHexColor } = require("ishex");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   */
  execute: async (member) => {
    var Guild = await Guilds.findOne({ id: member.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: member.guild.id,
      });
      Guild.save();
    }
    if (Guild.memberRole != "") {
      if (member.guild.verificationLevel == "HIGH") {
        setTimeout(async () => {
          await member.roles.add(Guild.memberRole);
        }, ms("10m"));
      } else {
        await member.roles.add(Guild.memberRole);
      }
    }
    if (Guild.welcomeChannel == "") return;

    var req = await fetch.default(
      `https://weebyapi.xyz/custom/greeting?icon=${member.user.displayAvatarURL(
        {
          format: "png",
        }
      )}&background=${process.env.BACKGROUND_URL}&name=${
        member.user.username
      }&greet=New Member!&greetHex=118bb8&nameHex=5271ff&messageHex=ffffff&message=${
        member.guild.name
      }%20now%20has%20${
        member.guild.members.cache.size
      }%20members!&font=nexa&token=${process.env.WEEBY_KEY}`,
      {
        method: "GET",
      }
    );
    var buffer = Buffer.from(await req.arrayBuffer());
    var attachment = new MessageAttachment(buffer, "welcome.png");

    var welcomeMessage = Guild.welcomeMessage
      .replace("{usermention}", `<@${member.user.id}>`)
      .replace("{guild}", `${member.guild.name}`)
      .replace("{usertag}", `${member.user.tag}`)
      .replace("{membercount}", `${member.guild.members.cache.size}`)
      .replace("{username}", `${member.user.username}`)
      .replace("{userid}", `${member.user.id}`);

    var channel = client.channels.cache.get(Guild.welcomeChannel);
    await channel.send({
      content: `${welcomeMessage}`,
      files: [attachment],
    });

    if (Guild.dmUsersOnJoin == false) return;

    var dmMessage = Guild.dmMessage.replace("{guild}", `${member.guild.name}`);
    member.user
      .send({
        content: `${dmMessage}`,
      })
      .catch(() => {
        return;
      });
  },
};
