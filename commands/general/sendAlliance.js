const e = require("cors");
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
        .setName("send_alliance")
        .setDescription("Send Enemies message")
        .addChannelOption((options) =>
            options
                .setName("channel")
                .setDescription("Select a channel to send the Enemies list")
                .setRequired(true)
        )
        .addStringOption((options) =>
            options
                .setName("mention")
                .setDescription("Mention with the message")
                .setRequired(true)
                .addChoices(
                    { name: "everyone", value: "@everyone" },
                    { name: "here", value: "@here" },
                    { name: "none", value: "None_qw3!" }
                )
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    //! No Enemies
    async execute(interaction) {
        let lastMessage = await db.get(
            `guild.${interaction.guild.id}.lastMessage.alliance`
        );
        let selecteddChannel = interaction.options.getChannel("channel");
        // try {
        interaction.guild.channels.cache
            .get(selecteddChannel.id)
            .messages.fetch(lastMessage?.message)
            .then((message) => {
                return interaction.reply(
                    `**There is already an Alliance message here <#${lastMessage.channel}>**`
                );
            })
            .catch(async (err) => {
                function pluck(array, key) {
                    // https://stackoverflow.com/a/37092497/18428010
                    return array.map(function (obj) {
                        return `**${obj[key]}**`;
                    });
                }
                let guildAlliance = await db.get(
                    `guild.${interaction.guild.id}.alliance.guilds`
                );
                let memberAlliance = await db.get(
                    `guild.${interaction.guild.id}.alliance.members`
                );
                const mention = interaction.options.getString("mention");
                let members, guilds;
                if (!memberAlliance || memberAlliance.length === 0) {
                    members = "**No Alliance :)**";
                } else {
                    members = pluck(await memberAlliance, "full").join("\n");
                }
                if (!guildAlliance || guildAlliance.length === 0) {
                    guilds = "**No Alliance :)**";
                } else {
                    guilds = pluck(await guildAlliance, "full").join("\n");
                }
                let msg = `**__Guilds:__**
${guilds}

**__Members:__**
${members}
      
${mention}`;
                async function withoutMention(message) {
                    message.edit(msg.replace("None_qw3!", ".."));
                    await db.set(
                        `guild.${interaction.guild.id}.lastMessage.alliance`,
                        {
                            channel: message.channel.id,
                            message: message.id,
                            mention: mention,
                        }
                    );
                }
                async function withMention(message) {
                    await db.set(
                        `guild.${interaction.guild.id}.lastMessage.alliance`,
                        {
                            channel: message.channel.id,
                            message: message.id,
                            mention: mention,
                        }
                    );
                }
                const selectedChannel =
                    interaction.options.getChannel("channel") ||
                    interaction.channel;
                if (mention !== "None_qw3!") {
                    selectedChannel.send({ content: msg }).then((message) => {
                        withMention(message);
                    });
                } else {
                    selectedChannel
                        .send({ content: msg })
                        .then(async (message) => {
                            withoutMention(message);
                        });
                }
                interaction.reply({
                    content: `**Alliance list sent to <#${selectedChannel.id}>**`,
                });
            });
    },
};
