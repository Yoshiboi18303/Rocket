const { Message, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const patBuffer = fs.readFileSync(
    path.join(__dirname, "..", "..", "PAT.txt")
);
const pat = patBuffer.toString();
const ms = require("ms");
const colors = require("../colors.json");
const { utc } = require("moment");

module.exports = {
    name: "github",
    description: "View some GitHub info using the bot!",
    usage: "{prefix}github <user | repo> <user> [repository]",
    type: "Information",
    cooldown: ms("2s"),
    testing: false,
    /**
     * @param {Message} message
     * @param {Array<String>} args
     */
    execute: async (message, args) => {
        var type = args[0];
        var user = args[1];
        var repo = args.slice(2).join("-") || null;
        var validTypes = ["user", "repo", "repository"];
        if (!validTypes.includes(type)) {
            const invalid_type_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(
                    "That's not a valid type! The valid types are `user`, `repo` and `repository`!"
                );
            return await message.reply({
                embeds: [invalid_type_embed],
            });
        }
        if (!user) {
            var description =
                type == "user"
                    ? "Please provide a GitHub user to search for!"
                    : "Please provide a GitHub repository to search for!";
            const no_query_embed = new MessageEmbed()
                .setColor(colors.red)
                .setDescription(description);
            return await message.reply({
                embeds: [no_query_embed],
            });
        }

        if (type == "repository") type = "repo";

        switch (type) {
            case "user":
                const user_fetch = await fetch.default(
                    `https://api.github.com/users/${user}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Yoshiboi18303:${pat}`,
                        },
                    }
                );
                var data = await user_fetch.json();

                if (data.message && data.message === "Not Found") {
                    const invalid_username_embed = new MessageEmbed()
                        .setColor(colors.red)
                        .setTitle("Invalid Username")
                        .setDescription("That user was not found!");
                    return await message.reply({
                        embeds: [invalid_username_embed],
                    });
                }
                const gh_user_embed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle(`Info on ${data.login}`)
                    .setDescription("More info can be found on the user's profile.")
                    .addFields([
                        {
                            name: "Follower Count",
                            value: `${data.followers}`,
                            inline: true,
                        },
                        {
                            name: "Created On",
                            value: `${utc(data.created_at).format("LL LTS")} - ${utc(
                                data.created_at
                            ).fromNow()}`,
                            inline: true,
                        },
                        {
                            name: "Last Updated On",
                            value: `${utc(data.updated_at).format("LL LTS")} - ${utc(
                                data.updated_at
                            ).fromNow()}`,
                            inline: true,
                        },
                        {
                            name: "Public Repository Count",
                            value: `${data.public_repos}`,
                            inline: true,
                        },
                        {
                            name: "Profile",
                            value: `[View ${data.login}'s Profile](${data.html_url}
               )`,
                            inline: true,
                        },
                    ]);
                await message.reply({
                    embeds: [gh_user_embed],
                });
                break;
            case "repo":
                var req;

                if (repo != null) {
                    req = await fetch.default(
                        ` https://api.github.com/repos/${user}/${repo}`,
                        {
                            method: "GET",
                            headers: {
                                Accept: "application/vnd.github.v3+json",
                                Authorization: `Yoshiboi18303:${pat}`
                            },
                        }
                    );
                } else {
                    req = await fetch.default(
                        `https://api.github.com/users/${user}/repos`,
                        {
                            method: "GET",
                            headers: {
                                Accept: "application/vnd.github.v3+json",
                                Authorization: `Yoshiboi18303:${pat}`
                            },
                        }
                    );
                }
                var data = await req.json();

                if (data.message == "Not Found")
                    return await message.reply({
                        content: "That's an unknown user/repository!",
                    });

                if (repo == null) {
                    repo = data[Math.floor(Math.random() * data.length)];

                    console.log(repo)

                    const embed = new MessageEmbed()
                        .setColor(message.member.displayHexColor)
                        .setAuthor({
                            name: repo.owner.login,
                            url: repo.owner.html_url,
                            iconURL: repo.owner.avatar_url,
                        })
                        .setDescription(
                            `**\`${repo.description != null
                                ? repo.description
                                : "No description provided."
                            }\`**`
                        )
                        .addFields([
                            {
                                name: "Repository Name",
                                value: `${repo.name}`,
                                inline: true,
                            },
                            {
                                name: "Repository URL",
                                value: `${!repo.private
                                    ? `[Click me!](${repo.svn_url})`
                                    : "Repository is private."
                                    }`,
                                inline: true,
                            },
                            {
                                name: "Is Forked?",
                                value: `${repo.fork ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Stars Count",
                                value: `${repo.stargazers_count}`,
                                inline: true,
                            },
                            {
                                name: "Watchers Count",
                                value: `${repo.watchers_count}`,
                                inline: true,
                            },
                            {
                                name: "Is Forkable?",
                                value: `${repo.allow_forking ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Is Archived?",
                                value: `${repo.archived ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Is Disabled?",
                                value: `${repo.disabled ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Repository License",
                                value: `**${!repo.license
                                    ? "None"
                                    : `[${repo.license.name}](${repo.license.url})`
                                    }**`,
                                inline: true,
                            },
                        ]);
                    await message.reply({
                        embeds: [embed],
                    });
                } else {
                    repo = data;

                    // console.log(repo.license)

                    const embed = new MessageEmbed()
                        .setColor(message.member.displayHexColor)
                        .setAuthor({
                            name: repo.owner.login,
                            url: repo.owner.html_url,
                            iconURL: repo.owner.avatar_url,
                        })
                        .setDescription(
                            `**\`${repo.description != null
                                ? repo.description
                                : "No description provided."
                            }\`**`
                        )
                        .addFields([
                            {
                                name: "Repository Name",
                                value: `${repo.name}`,
                                inline: true,
                            },
                            {
                                name: "Repository URL",
                                value: `${!repo.private
                                    ? `[Click me!](${repo.svn_url})`
                                    : "Repository is private."
                                    }`,
                                inline: true,
                            },
                            {
                                name: "Is Forked?",
                                value: `${repo.fork ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Stars Count",
                                value: `${repo.stargazers_count}`,
                                inline: true,
                            },
                            {
                                name: "Watchers Count",
                                value: `${repo.watchers_count}`,
                                inline: true,
                            },
                            {
                                name: "Is Forkable?",
                                value: `${repo.allow_forking ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Is Archived?",
                                value: `${repo.archived ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Is Disabled?",
                                value: `${repo.disabled ? "Yes" : "No"}`,
                                inline: true,
                            },
                            {
                                name: "Repository License",
                                value: `**${!repo.license
                                    ? "None"
                                    : `[${repo.license.name}](${repo.license.url})`
                                    }**`,
                                inline: true,
                            },
                        ]);
                    await message.reply({
                        embeds: [embed],
                    });
                }
                break;
        }
    },
};
