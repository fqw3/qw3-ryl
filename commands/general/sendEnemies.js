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
        .setName("send_enemies")
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
    // .addBooleanOption((options) => options.setName('embed').setDescription('Send as Embed or normal text ?').setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    //! No Enemies
    async execute(interaction) {
        // let lastMessage = await db.get(`guild.${interaction.guild.id}.lastMessage.alliance`);
        // try {
        //   interaction.guild.channels.cache.get(lastMessage.channel);
        // } catch (err) {
        //   await db.set(`guild.${interaction.guild.id}.lastMessage.alliance`, {
        //     channel: interaction.options.getChannel('channel'),
        //     message: '1',
        //     mention: '@here',
        //   });
        // }
        let lastMessage = await db.get(
            `guild.${interaction.guild.id}.lastMessage.enemies`
        );
        let selecteddChannel = interaction.options.getChannel("channel");
        // try {
        interaction.guild.channels.cache
            .get(selecteddChannel.id)
            .messages.fetch(lastMessage?.message)
            .then((message) => {
                return interaction.reply(
                    `**There is already an Enemies message here <#${lastMessage.channel}>**`
                );
            })
            .catch(async (err) => {
                function pluck(array, key) {
                    // https://stackoverflow.com/a/37092497/18428010
                    return array.map(function (obj) {
                        return `**${obj[key]}**`;
                    });
                }
                let guildEnemies = await db.get(
                    `guild.${interaction.guild.id}.enemies.guilds`
                );
                let memberEnemies = await db.get(
                    `guild.${interaction.guild.id}.enemies.members`
                );
                const mention = interaction.options.getString("mention");
                let members, guilds;
                if (!memberEnemies || memberEnemies.length === 0) {
                    members = "**No Enemies :)**";
                } else {
                    members = pluck(await memberEnemies, "full").join("\n");
                }
                if (!guildEnemies || guildEnemies.length === 0) {
                    guilds = "**No Enemies :)**";
                } else {
                    guilds = pluck(await guildEnemies, "full").join("\n");
                }
                let msg = `**__Guilds:__**
${guilds}

**__Members:__**
${members}
      
${mention}`;
                async function withoutMention(message) {
                    message.edit(msg.replace("None_qw3!", ".."));
                    await db.set(
                        `guild.${interaction.guild.id}.lastMessage.enemies`,
                        {
                            channel: message.channel.id,
                            message: message.id,
                            mention: mention,
                        }
                    );
                }
                async function withMention(message) {
                    await db.set(
                        `guild.${interaction.guild.id}.lastMessage.enemies`,
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
                    content: `**Enemies list sent to <#${selectedChannel.id}>**`,
                });
            });
    },
};
