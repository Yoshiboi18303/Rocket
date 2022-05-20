const Guilds = require("../schemas/guildSchema");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    var Guild = await Guilds.findOne({ id: message.guild.id });
    if (!Guild) {
      Guild = new Guilds({
        id: message.guild.id,
      });
      Guild.save();
    }
    var prefix = Guild.prefix;
    if (message.author.bot || !message.guild) return;
    if (message.content == `<@${client.user.id}>`) {
      const pinged_embed = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription(
          `Hello <@${message.author.id}>, thanks for pinging me! Here's some helpful info!\n\n**My prefix in this guild:** \`${prefix}\`\n**See all commands:** \`${prefix}help\`\n**Invite the bot:** [Click me!](https://discord.com/oauth2/authorize?client_id=971841942998638603&permissions=412421053440&scope=bot)`
        )
        .setTimestamp();
      return await message.reply({
        embeds: [pinged_embed],
      });
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    const cmd = client.commands.get(command) || client.aliases.get(command);
    if (!cmd && Guild.unknownCommandMessage) {
      const unknown_command_embed = new MessageEmbed()
        .setColor(colors.red)
        .setDescription(`❌ Command **\`${command}\`** not found! ❌`)
        .setTimestamp();
      return await message.reply({
        embeds: [unknown_command_embed],
      });
    } else if (!cmd && !Guild.unknownCommandMessage) return;
    var Testing = cmd.testing;
    if (!Testing) Testing = false;
    if (Testing) {
      if (message.guild.id != config.testServerId)
        return await message.reply({
          content: `This command is restricted to the testing server (**\`${
            client.guilds.cache.get(config.testServerId)?.name
          }\`**) for the moment!`,
        });
    }
    var OwnerOnly = cmd.ownerOnly;
    if (OwnerOnly == undefined || OwnerOnly == null) OwnerOnly = false;
    if (OwnerOnly) {
      if (message.author.id != config.owner)
        return await message.reply({
          content: "You aren't the owner of the bot!",
        });
    }
    if (cmd.userPermissions?.length > 0) {
      if (!message.member.permissions.has(cmd.userPermissions))
        return await message.reply({
          content:
            "You don't have the required permissions to use this command!",
        });
    }
    if (cmd.clientPermissions?.length > 0) {
      if (!message.guild.me.permissions.has(cmd.clientPermissions))
        return await message.reply({
          content:
            "I don't have the required permissions to be able to run this command!",
        });
    }
    await cmd.execute(message, args);
  },
};
