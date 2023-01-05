const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "commands/general/json.sqlite" });
const hasValueDeep = require("../../utils/checkObject");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_alliance")
        .setDescription("add alliance to the list")
        .addStringOption((options) =>
            options
                .setName("type")
                .setDescription("Add Guild or Member ?")
                .setRequired(true)
                .addChoices(
                    { name: "guild", value: "guild" },
                    { name: "member", value: "member" }
                )
        )
        .addStringOption((options) =>
            options.setName("name").setDescription("The name").setRequired(true)
        )
        .addStringOption((options) =>
            options.setName("tag").setDescription("The tag").setRequired(true)
        )
        .addStringOption((options) =>
            options
                .setName("mention")
                .setDescription("Mention with the message")
                .setRequired(true)
                .addChoices(
                    { name: "everyone", value: "@everyone" },
                    { name: "here", value: "@here" },
                    { name: "none", value: ".." }
                )
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        let lastMessageC = await db.get(
            `guild.${interaction.guild.id}.lastMessage.alliance`
        );
        const checkChannel = interaction.guild.channels.cache.find(
            (channel) => channel.id === lastMessageC?.channel
        );
        if (!checkChannel) {
            return interaction.reply(
                "**Set a channel by using </send_alliance:1059065996587061292> **"
            );
        }
        interaction.guild.channels.cache
            .get(lastMessageC?.channel)
            .messages.fetch(lastMessageC?.message)
            .then(async (message) => {
                function pluck(array, key) {
                    return array.map(function (obj) {
                        return `**${obj[key]}**`;
                    });
                }
                const name = interaction.options.getString("name");
                const tag = interaction.options.getString("tag");
                let lastMessage = await db.get(
                    `guild.${interaction.guild.id}.lastMessage.alliance`
                );
                if (!lastMessage?.channel || !lastMessage) {
                    return interaction.reply(
                        "**Set a channel by using </send_alliance:1059065996587061292> **"
                    );
                } else if (!lastMessage.message) {
                    interaction.guild.channels.cache
                        .get(lastMessage.channel)
                        .send(msg)
                        .then((message) =>
                            message.edit(msg.replace("..", "@everyone"))
                        );
                    return interaction.reply({
                        content: `**${name} [${tag}] Added to the Alliance list**`,
                    });
                } else {
                    const type = interaction.options.getString("type");
                    if (type === "guild") {
                        await db.push(
                            `guild.${interaction.guild.id}.alliance.guilds`,
                            [{ name: name, tag: tag, full: `${name} [${tag}]` }]
                        );
                    } else if (type === "member") {
                        await db.push(
                            `guild.${interaction.guild.id}.alliance.members`,
                            [{ name: name, tag: tag, full: `${name} [${tag}]` }]
                        );
                    }
                    let guildaAlliance = await db.get(
                        `guild.${interaction.guild.id}.alliance.guilds`
                    );
                    let memberAlliance = await db.get(
                        `guild.${interaction.guild.id}.alliance.members`
                    );
                    let members, guilds, mention;
                    mention = interaction.options.getString("mention");
                    if (!memberAlliance || memberAlliance.length === 0) {
                        members = "**No Alliance :)**";
                    } else {
                        members = pluck(await memberAlliance, "full").join(
                            "\n"
                        );
                    }
                    if (!guildaAlliance || guildaAlliance.length === 0) {
                        guilds = "**No Alliance :)**";
                    } else {
                        guilds = pluck(await guildaAlliance, "full").join("\n");
                    }
                    let msg = `**__Guilds:__**
${guilds}

**__Members:__**
${members}

${mention}`;
                    interaction.guild.channels.cache
                        .get(lastMessage.channel)
                        .messages.fetch(lastMessage.message)
                        .then((message) =>
                            message.edit(msg.replace("..", "@everyone"))
                        )
                        .catch((err) => {
                            interaction.guild.channels.cache
                                .get(lastMessage.channel)
                                .send(msg)
                                .then((message) =>
                                    message.edit(msg.replace("..", "@everyone"))
                                );
                        });
                    interaction.guild.channels.cache
                        .get(lastMessage.channel)
                        .send(interaction.options.getString("mention"))
                        .then((message) => message.delete());
                    return interaction.reply({
                        content: `**${name} [${tag}] Added to the Alliance list**`,
                    });
                }
            })
            .catch(async (err) => {
                return interaction.reply(
                    "**Set a channel by using </send_alliance:1059065996587061292> **"
                );
            });
    },
};
