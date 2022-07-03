const {
  Interaction,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const ms = require("ms");
const colors = require("../colors.json");
const config = require("../config.json");
const Users = require("../schemas/userSchema");
const fetch = require("node-fetch");

module.exports = {
  name: "link",
  description: "Link an external account to Rocket!",
  usage: "{prefix}link",
  cooldown: ms("5s"),
  type: "Other",
  testing: true,
  voteOnly: false,
  ownerOnly: false,
  nsfw: false,
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    var user = message.author;
    var User = await Users.findOne({
      id: user.id,
    });
    if (!User) {
      User = new Users({
        id: user.id,
      });
      User.save();
    }

    const linkEmbed = new MessageEmbed()
      .setColor(colors.cyan)
      .setTitle("Link External Account(s)")
      .setDescription(
        `Here you can link your external accounts to \`${client.user.username}\`!\n\n**Please use the select menu below to select a supported provider**`
      )
      .setFooter({
        text: "This will expire after 1 minute of inactivity",
      });

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setDisabled(false)
        .setCustomId("none")
        .addOptions([
          {
            label: "WakaTime",
            value: "wakatime",
            description: "Link Rocket to WakaTime",
          },
        ])
    );

    var msg = await message.reply({
      embeds: [linkEmbed],
      components: [row],
    });

    /**
     * @param {Interaction} interaction
     */
    var filter = async (interaction) => {
      if (interaction.user.id != user.id)
        return await interaction.reply({ content: "This isn't yours!" });
      return true;
    };

    var collector = msg.createMessageComponentCollector({
      filter,
      idle: 60000,
    });

    collector.on("collect", async (collected) => {
      var linkValue = collected.values[0];
      switch (linkValue) {
        case "wakatime":
          var linkAccountEmbed = new MessageEmbed()
            .setColor(colors.cyan)
            .setTitle("Link your WakaTime account")
            .setDescription(
              `Please go [here](https://${config.origin}/login/wakatime), authorize, then refer to your DMs for further instructions.`
            );
          await collected.update({
            embeds: [linkAccountEmbed],
          });
          var dmMessage = await user
            .send({
              content:
                "Please enter the code found in the URL of the webpage, then I'll handle the rest for you.",
            })
            .catch(async (e) => {
              return await collected.reply({
                content:
                  "I'm sorry, but your DMs are disabled, so I can't link your WakaTime account until you run this again after enabling your DMs.",
                ephemeral: true,
              });
            });
          /**
           * @param {Message} m
           */
          var dmMessageFilter = async (m) => {
            if (m.author.bot) return;
            if (!m.content.startsWith("sec_"))
              return await m.reply({
                content:
                  "That's not a valid security key!\n\nA security key on WakaTime would start with `sec_`",
              });
            return true;
          };
          var dmMessageCollector =
            dmMessage?.channel.createMessageCollector({
              filter: dmMessageFilter,
            }) || null;
          if (dmMessageCollector == null) return;
          dmMessageCollector.on("collect", async (collected) => {
            var req = await fetch.default(
              `https://${config.origin}/login/wakatime/authorize?code=${collected.content}`,
              {
                method: "GET",
                headers: {
                  Authorization: process.env.SECRET_AUTH_KEY,
                },
              }
            );
            if (req.status != 200)
              return await collected.reply({
                content: "An error occurred, maybe check the key you entered!",
              });
            if (!collected.content.startsWith("sec_")) return;
            await collected.reply({ content: "Authorization Completed!" });
            dmMessageCollector.stop();
          });
          break;
      }
    });

    collector.on("end", async () => {
      for (var component of row.components) {
        component.setDisabled(true);
      }
      await msg.edit({
        content: "Sorry, this has expired.",
        components: [row],
      });
    });
  },
};
