const {
  MessageActionRow,
  MessageButton,
  Message,
  Interaction,
} = require("discord.js");
const Users = require("../schemas/userSchema");
const Questions = require("../questions.json");

module.exports = {
  name: "quiz",
  description: "Gives you a quiz about Rocket League stuff!",
  usage: "{prefix}quiz",
  aliases: [],
  type: "Economy",
  userPermissions: [],
  clientPermissions: [],
  testing: true,
  ownerOnly: false,
  /**
   * @param {Message} message
   * @param {Array<String>} args
   */
  execute: async (message) => {
    var types = ["Mechanics" /*, "Players", "Game Knowledge", "Gamemodes" */];
    var footer_type = types[Math.floor(Math.random() * types.length)];
    var type = types[Math.floor(Math.random() * types.length)]
      .split(" ")
      .join("")
      .toLowerCase();
    var User = await Users.findOne({ id: message.author.id });
    if (!User) {
      User = new Users({
        id: message.author.id,
      });
      User.save();
    }
    var keys = Object.keys(Questions);
    // console.log(keys);
    if (!keys.includes(type))
      return await message.reply({
        content:
          "The owner of the bot forgot to implement this set of questions, please run the command again!",
      });
    var key = keys.find((k) => k == type);
    /*
    console.log(keys.includes(type))
    await message.reply({ content: "Check the console!" })
    */
    switch (key) {
      case "mechanics":
        var questions = Questions.mechanics;
        var object = questions[Math.floor(Math.random() * questions.length)];
        var row = new MessageActionRow();
        var question = object.question;
        if (object.number > 3)
          return await message.reply({
            content: `The owner hasn't implemented this question yet, please try running the command again (Question number: \`${object.number}\`)!`,
          });
        switch (object.number) {
          case 1:
            var id = object.answer.split(" ").join("").toLowerCase();
            var rows = [
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Car Carry")
                  .setCustomId("carcarry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Ball Fly")
                  .setCustomId("ballfly"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Ball Fly")
                  .setCustomId("ballfly"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Car Carry")
                  .setCustomId("carcarry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Car Carry")
                  .setCustomId("carcarry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Ball Fly")
                  .setCustomId("ballfly"),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Car Carry")
                  .setCustomId("carcarry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Ball Fly")
                  .setCustomId("ballfly"),
              ],
            ];
            var buttonRow = rows[Math.floor(Math.random() * rows.length)];
            for (var button of buttonRow) {
              row.addComponents(button);
            }
            var question_embed = new MessageEmbed()
              .setColor(colors.blue)
              .setAuthor({
                name: `${message.author.username}`,
                iconURL: `${message.author.displayAvatarURL({
                  format: "png",
                })}`,
              })
              .setTitle("Quiz Time!")
              .setDescription(`${question}`)
              .setFooter({
                text: `Type: ${footer_type}`,
              });
            var msg = await message.reply({
              embeds: [question_embed],
              components: [row],
            });

            /**
             * @param {Interaction} btnInt
             */
            var filter = async (btnInt) => {
              if (btnInt.user.id != message.author.id)
                return await btnInt.reply({
                  content: "Get your own quiz noob.",
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
              const answered_embed = new MessageEmbed()
                .setColor(colors.yellow)
                .setAuthor({
                  name: `${message.author.username}`,
                  iconURL: `${message.author.displayAvatarURL({
                    format: "png",
                  })}`,
                })
                .setTitle("Hmm...")
                .setDescription("Seems like this quiz was already answered...");
              await msg.edit({
                embeds: [answered_embed],
                components: [],
              });

              if (first?.customId != id) {
                const incorrect_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setTitle("Whoops...")
                  .setDescription(
                    "That wasn't quite right, try again next time."
                  );
                return await first?.reply({
                  embeds: [incorrect_embed],
                  ephemeral: true,
                });
              } else {
                var addedTokens = Math.ceil(Math.random() * 225);
                var data = await Users.findOneAndUpdate(
                  {
                    id: message.author.id,
                  },
                  {
                    $inc: {
                      tokens: addedTokens,
                    },
                  }
                );
                data.save();
                const correct_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setTitle("I got it!")
                  .setDescription(
                    `That's correct! You have earned \`${addedTokens}\` tokens for your perfect answer!\n\n**You now have \`${
                      User.tokens + addedTokens
                    }\` tokens in your account!**`
                  );
                await first?.reply({
                  embeds: [correct_embed],
                  ephemeral: true,
                });
              }
            });
            break;
          case 2:
            var id = object.answer.split(" ").join("").toLowerCase();
            var rows = [
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Carry")
                  .setCustomId("carry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Drag")
                  .setCustomId("drag"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Drag")
                  .setCustomId("drag"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Carry")
                  .setCustomId("carry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Carry")
                  .setCustomId("carry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Drag")
                  .setCustomId("drag"),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Carry")
                  .setCustomId("carry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Drag")
                  .setCustomId("drag"),
              ],
            ];
            var buttonRow = rows[Math.floor(Math.random() * rows.length)];
            for (var button of buttonRow) {
              row.addComponents(button);
            }
            question_embed = new MessageEmbed()
              .setColor(colors.blue)
              .setAuthor({
                name: `${message.author.username}`,
                iconURL: `${message.author.displayAvatarURL({
                  format: "png",
                })}`,
              })
              .setTitle("Quiz Time!")
              .setDescription(`${question}`)
              .setFooter({
                text: `Type: ${footer_type}`,
              });
            var msg = await message.reply({
              embeds: [question_embed],
              components: [row],
            });

            /**
             * @param {Interaction} btnInt
             */
            filter = async (btnInt) => {
              if (btnInt.user.id != message.author.id)
                return await btnInt.reply({
                  content: "Get your own quiz noob.",
                  ephemeral: true,
                });
              return true;
            };

            collector = msg.createMessageComponentCollector({
              filter,
              max: 1,
            });

            collector.on("end", async (collection) => {
              var first = collection.first();
              const answered_embed = new MessageEmbed()
                .setColor(colors.yellow)
                .setAuthor({
                  name: `${message.author.username}`,
                  iconURL: `${message.author.displayAvatarURL({
                    format: "png",
                  })}`,
                })
                .setTitle("Hmm...")
                .setDescription("Seems like this quiz was already answered...");
              await msg.edit({
                embeds: [answered_embed],
                components: [],
              });

              if (first?.customId != id) {
                const incorrect_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setTitle("Whoops...")
                  .setDescription(
                    "That wasn't quite right, try again next time."
                  );
                return await first?.reply({
                  embeds: [incorrect_embed],
                  ephemeral: true,
                });
              } else {
                var addedTokens = Math.ceil(Math.random() * 225);
                var data = await Users.findOneAndUpdate(
                  {
                    id: message.author.id,
                  },
                  {
                    $inc: {
                      tokens: addedTokens,
                    },
                  }
                );
                data.save();
                const correct_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setTitle("I got it!")
                  .setDescription(
                    `That's correct! You have earned \`${addedTokens}\` tokens for your perfect answer!\n\n**You now have \`${
                      User.tokens + addedTokens
                    }\` tokens in your account!**`
                  );
                await first?.reply({
                  embeds: [correct_embed],
                  ephemeral: true,
                });
              }
            });
            break;
          case 3:
            var id = object.answer.split(" ").join("").toLowerCase();
            var rows = [
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Fling")
                  .setCustomId("fling"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Catapult")
                  .setCustomId("catapult"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Fake")
                  .setCustomId("fake"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Catapult")
                  .setCustomId("catapult"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("FlICK")
                  .setCustomId("random"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Sling")
                  .setCustomId("sling"),
              ],
              [
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel(`${object.answer}`)
                  .setCustomId(`${id}`),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Catapult")
                  .setCustomId("carry"),
                new MessageButton()
                  .setStyle("SECONDARY")
                  .setLabel("Flicker-Doodle")
                  .setCustomId("wtf"),
              ],
            ];
            var buttonRow = rows[Math.floor(Math.random() * rows.length)];
            for (var button of buttonRow) {
              row.addComponents(button);
            }
            question_embed = new MessageEmbed()
              .setColor(colors.blue)
              .setAuthor({
                name: `${message.author.username}`,
                iconURL: `${message.author.displayAvatarURL({
                  format: "png",
                })}`,
              })
              .setTitle("Quiz Time!")
              .setDescription(`${question}`)
              .setFooter({
                text: `Type: ${footer_type}`,
              });
            var msg = await message.reply({
              embeds: [question_embed],
              components: [row],
            });

            /**
             * @param {Interaction} btnInt
             */
            filter = async (btnInt) => {
              if (btnInt.user.id != message.author.id)
                return await btnInt.reply({
                  content: "Get your own quiz noob.",
                  ephemeral: true,
                });
              return true;
            };

            collector = msg.createMessageComponentCollector({
              filter,
              max: 1,
            });

            collector.on("end", async (collection) => {
              var first = collection.first();
              const answered_embed = new MessageEmbed()
                .setColor(colors.yellow)
                .setAuthor({
                  name: `${message.author.username}`,
                  iconURL: `${message.author.displayAvatarURL({
                    format: "png",
                  })}`,
                })
                .setTitle("Hmm...")
                .setDescription("Seems like this quiz was already answered...");
              await msg.edit({
                embeds: [answered_embed],
                components: [],
              });

              if (first?.customId != id) {
                const incorrect_embed = new MessageEmbed()
                  .setColor(colors.red)
                  .setTitle("Whoops...")
                  .setDescription(
                    "That wasn't quite right, try again next time."
                  );
                return await first?.reply({
                  embeds: [incorrect_embed],
                  ephemeral: true,
                });
              } else {
                var addedTokens = Math.ceil(Math.random() * 225);
                var data = await Users.findOneAndUpdate(
                  {
                    id: message.author.id,
                  },
                  {
                    $inc: {
                      tokens: addedTokens,
                    },
                  }
                );
                data.save();
                const correct_embed = new MessageEmbed()
                  .setColor(colors.green)
                  .setTitle("I got it!")
                  .setDescription(
                    `That's correct! You have earned \`${addedTokens}\` tokens for your perfect answer!\n\n**You now have \`${
                      User.tokens + addedTokens
                    }\` tokens in your account!**`
                  );
                await first?.reply({
                  embeds: [correct_embed],
                  ephemeral: true,
                });
              }
            });
            break;
        }
        break;
    }
  },
};
