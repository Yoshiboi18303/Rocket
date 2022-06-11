const Users = require("../schemas/userSchema");
const { MessageActionRow, MessageButton } = require("discord.js");
const rankUpWins = {
  silver: 10,
  gold: 20,
  plat: 30,
  diamond: 40,
  champ: 50,
  gc: 60,
  ssl: 70,
};
const difficulties = ["beginner", "rookie", "pro", "all-star"];

module.exports = {
  name: "play",
  description: "Start playing a quick game of your choice!",
  aliases: ["work"],
  usage: "{prefix}play [type] [difficulty]",
  type: "Economy",
  cooldown: ms("5m"),
  execute: async (message, args) => {
    var type = args[0]?.toLowerCase();
    var difficulty = args[1]?.toLowerCase();
    if (!type) type = "soccar";
    if (!difficulty)
      difficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
    // console.log(type);
    if (
      ![
        "soccar",
        "hoops",
        "snowday",
        "rumble",
        "dropshot",
        "heatseeker",
      ].includes(type)
    ) {
      const invalid_type_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's an invalid type! ❌\n\nℹ️ Valid types are `soccar`, `hoops`, `snowday`, `rumble`, `dropshot` and `heatseeker` ℹ️"
        );
      return await message.reply({
        embeds: [invalid_type_embed],
      });
    }
    /*
    if (!difficulties.includes(difficulty)) {
      const invalid_difficulty_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          "❌ That's an invalid difficulty! ❌\n\nℹ️ Valid types are `beginner`, `rookie`, `pro` and `all-star` ℹ️"
        );
      return await message.reply({
        embeds: [invalid_difficulty_embed],
      });
    }
    */
    if (type != "soccar" && type != "heatseeker" && type != "rumble")
      return await message.reply({
        content: "The other mode types are coming soon!",
      });
    var User = await Users.findOne({ id: message.author.id });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
    }
    if (Object.values(rankUpWins).includes(User.wins)) {
      var data = await Users.findOneAndUpdate(
        {
          id: message.author.id,
        },
        {
          $set: {
            rank: ranks[User.wins],
          },
          $inc: {
            tokens: 100,
          },
        }
      );
      var rank = ranks[data.rank];
      const rank_up_embed = new MessageEmbed()
        .setColor(colors.green)
        .setTitle("You Ranked Up!")
        .setDescription(
          `Congratulations! You have ranked up from **\`${User.rank}\`** to **\`${rank}\`**!`
        )
        .setTimestamp();
      await message.reply({
        embeds: [rank_up_embed],
      });
    }
    var defensivePositions = ["left", "middle", "right"];
    switch (type) {
      case "soccar":
        var position =
          defensivePositions[
            Math.floor(Math.random() * defensivePositions.length)
          ];
        var game_embed = new MessageEmbed()
          .setColor(colors.yellow)
          .setTitle("Take the shot!")
          .setDescription(
            "Time to take a shot at net! Choose where the defender is **NOT** standing!\n\n**Arriving near net in 5 seconds...**"
          );

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("Left")
            .setCustomId("left"),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("Middle")
            .setCustomId("middle"),
          new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("Right")
            .setCustomId("right")
        );
        var msg = await message.reply({
          embeds: [game_embed],
        });
        setTimeout(async () => {
          switch (position) {
            case "left":
              await msg.edit({
                content: `🥅🥅🥅\n${emojis.defender}\n\n\u2800\u2800${emojis.ball}`,
                embeds: [],
                components: [row],
              });
              break;
            case "middle":
              await msg.edit({
                content: `🥅🥅🥅\n\u2800\u2800${emojis.defender}\n\n\u2800\u2800${emojis.ball}`,
                embeds: [],
                components: [row],
              });
              break;
            case "right":
              await msg.edit({
                content: `🥅🥅🥅\n\u2800\u2800\u2800\u2800${emojis.defender}\n\n\u2800\u2800${emojis.ball}`,
                embeds: [],
                components: [row],
              });
              break;
          }
          var keepGoing = true;
          setInterval(async () => {
            if (keepGoing == false) return;
            var new_position =
              defensivePositions[
                Math.floor(Math.random() * defensivePositions.length)
              ];
            position = new_position;
            switch (new_position) {
              case "left":
                await msg.edit({
                  content: `🥅🥅🥅\n${emojis.defender}\n\n\u2800\u2800${emojis.ball}`,
                });
                break;
              case "middle":
                await msg.edit({
                  content: `🥅🥅🥅\n\u2800\u2800${emojis.defender}\n\n\u2800\u2800${emojis.ball}`,
                });
                break;
              case "right":
                await msg.edit({
                  content: `🥅🥅🥅\n\u2800\u2800\u2800\u2800${emojis.defender}\n\n\u2800\u2800${emojis.ball}`,
                });
                break;
            }
          }, 4500);

          var filter = async (btnInt) => {
            if (btnInt.user.id != message.author.id)
              return await btnInt.reply({
                content: "Get your own shot noob.",
                ephemeral: true,
              });
            return true;
          };

          var collector = msg.createMessageComponentCollector({
            filter,
            max: 1,
          });

          collector.on("end", async (collection) => {
            var first = collection.first();
            keepGoing = false;
            await msg.edit({
              components: [],
            });
            const failure_embed = new MessageEmbed()
              .setColor(colors.red)
              .setTitle("What a save!")
              .setDescription(
                'Nice shot bruh, you just passed the ball off to the defender and got scored on. You are "so good" at this, huh.'
              );
            const success_embed = new MessageEmbed()
              .setColor(colors.green)
              .setTitle("Nice shot!")
              .setDescription(
                "Well done user! You successfully shot the ball away from the defender and scored a goal!"
              );
            if (first?.customId == "left") {
              if (position.toLowerCase() == "left") {
                return await first?.reply({
                  embeds: [failure_embed],
                  ephemeral: true,
                });
              } else {
                var data = await Users.findOneAndUpdate(
                  {
                    id: message.author.id,
                  },
                  {
                    $inc: {
                      wins: 1,
                    },
                  }
                );
                data.save();
                if (User.rank == "Supersonic Legend") {
                  data = await Users.findOneAndUpdate(
                    {
                      id: message.author.id,
                    },
                    {
                      $inc: {
                        tokens: 250,
                      },
                    }
                  );
                  data.save();
                }
                return await first?.reply({
                  embeds: [success_embed],
                  ephemeral: true,
                });
              }
            } else if (first?.customId == "middle") {
              if (position.toLowerCase() == "middle") {
                return await first?.reply({
                  embeds: [failure_embed],
                  ephemeral: true,
                });
              } else {
                var data = await Users.findOneAndUpdate(
                  {
                    id: message.author.id,
                  },
                  {
                    $inc: {
                      wins: 1,
                    },
                  }
                );
                data.save();
                if (User.rank == "Supersonic Legend") {
                  data = await Users.findOneAndUpdate(
                    {
                      id: message.author.id,
                    },
                    {
                      $inc: {
                        tokens: 250,
                      },
                    }
                  );
                  data.save();
                }
                return await first?.reply({
                  embeds: [success_embed],
                  ephemeral: true,
                });
              }
            } else {
              if (position.toLowerCase() == "right") {
                return await first?.reply({
                  embeds: [failure_embed],
                  ephemeral: true,
                });
              } else {
                var data = await Users.findOneAndUpdate(
                  {
                    id: message.author.id,
                  },
                  {
                    $inc: {
                      wins: 1,
                    },
                  }
                );
                data.save();
                if (User.rank == "Supersonic Legend") {
                  data = await Users.findOneAndUpdate(
                    {
                      id: message.author.id,
                    },
                    {
                      $inc: {
                        tokens: 250,
                      },
                    }
                  );
                  data.save();
                }
                return await first?.reply({
                  embeds: [success_embed],
                  ephemeral: true,
                });
              }
            }
          });
        }, 5000);
        break;
      case "heatseeker":
        game_embed = new MessageEmbed()
          .setColor(colors.yellow)
          .setTitle("Get Ready...")
          .setDescription(
            "You're going to want to be ready for this one, the ball is about to come back towards your net at a super high speed.\n\n**Ball coming back in 5 seconds!**"
          );
        var msg = await message.reply({
          embeds: [game_embed],
        });
        var modes = [
          "Soccar",
          "Hoops",
          "Snow Day",
          "Rumble",
          "Dropshot",
          "Heatseeker",
        ];
        var nonModes = [
          "Gridiron",
          "Knockout",
          "Rocket Labs Loophole",
          "Dropshot Rumble",
          "Summer Formal",
          "Spikeshot",
        ];
        var rowNumbers = [1, 2, 3, 4];
        setTimeout(async () => {
          const question_embed = new MessageEmbed()
            .setColor(colors.orange)
            .setTitle("HURRY UP!")
            .setDescription(
              "**Which one of these is NOT an available Rocket League gamemode?**\n\n**YOU HAVE 7.5 SECONDS TO ANSWER!**"
            );
          var rowNumber =
            rowNumbers[Math.floor(Math.random() * rowNumbers.length)];
          var mode1 = modes[Math.floor(Math.random() * modes.length)];
          var mode2 = modes[Math.floor(Math.random() * modes.length)];
          if (mode1 == mode2) {
            mode1 = modes[Math.floor(Math.random() * modes.length)];
          }
          var nonMode = nonModes[Math.floor(Math.random() * nonModes.length)];
          var row = new MessageActionRow();
          switch (rowNumber) {
            case 1:
              row.addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode1)
                  .setCustomId(`${mode1.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode2)
                  .setCustomId(`${mode2.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(nonMode)
                  .setCustomId(`${nonMode.split(" ").join("-").toLowerCase()}`)
              );
              break;
            case 2:
              row.addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode1)
                  .setCustomId(`${mode1.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(nonMode)
                  .setCustomId(`${nonMode.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode2)
                  .setCustomId(`${mode2.split(" ").join("-").toLowerCase()}`)
              );
              break;
            case 3:
              row.addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(nonMode)
                  .setCustomId(`${nonMode.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode2)
                  .setCustomId(`${mode2.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode1)
                  .setCustomId(`${mode1.split(" ").join("-").toLowerCase()}`)
              );
              break;
            case 4:
              row.addComponents(
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode2)
                  .setCustomId(`${mode2.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(nonMode)
                  .setCustomId(`${nonMode.split(" ").join("-").toLowerCase()}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(mode1)
                  .setCustomId(`${mode1.split(" ").join("-").toLowerCase()}`)
              );
              break;
          }
          await msg.edit({
            embeds: [question_embed],
            components: [row],
          });

          var filter = async (btnInt) => {
            if (btnInt.user.id != message.author.id)
              return await btnInt.reply({
                content: "Get your own buttons noob.",
                ephemeral: true,
              });
            return true;
          };

          var collector = msg.createMessageComponentCollector({
            filter,
            time: 7500,
            max: 1,
          });

          collector.on("end", async (collection) => {
            var first = collection.first();
            await msg.edit({
              components: [],
            });
            if (
              !first ||
              first?.customId != nonMode.split(" ").join("-").toLowerCase()
            ) {
              const wrong_embed = new MessageEmbed()
                .setColor(colors.red)
                .setTitle("What a save!")
                .setDescription(
                  "That's incorrect. You just got scored on, nice job."
                );
              return await first?.reply({
                embeds: [wrong_embed],
                ephemeral: true,
              });
            } else {
              var data = await Users.findOneAndUpdate(
                {
                  id: message.author.id,
                },
                {
                  $inc: {
                    wins: 1,
                  },
                }
              );
              data.save();
              if (User.rank == "Supersonic Legend") {
                data = await Users.findOneAndUpdate(
                  {
                    id: message.author.id,
                  },
                  {
                    $inc: {
                      tokens: 250,
                    },
                  }
                );
                data.save();
              }
              const correct_embed = new MessageEmbed()
                .setColor(colors.green)
                .setTitle("Nice shot!")
                .setDescription(
                  "That's correct! You just scored on the other team!"
                );
              await first?.reply({
                embeds: [correct_embed],
                ephemeral: true,
              });
            }
          });
        }, 5000);
        break;
      case "rumble":
        if (message.guild.id != config.testServerId)
          return await message.reply({
            content: "This mode is under construction!",
          });
        var items = [
          `${emojis.haymaker} Haymaker`,
          `${emojis.grappler} Grappling Hook`,
          `${emojis.plunger} Plunger`,
          `${emojis.boot} The Boot`,
          `${emojis.disruptor} Disruptor`,
          `${emojis.freezer} Freezer`,
          `${emojis.magnetizer} Magnetizer`,
          `${emojis.powerhitter} Power Hitter`,
          `${emojis.spikes} Spike`,
          `${emojis.swapper} Swapper`,
          `${emojis.tornado} Tornado`,
        ];
        var item = items[Math.floor(Math.random() * items.length)];
        console.log(item);
        await message.reply({
          content: "Check the console!",
        });
        break;
    }
  },
};
