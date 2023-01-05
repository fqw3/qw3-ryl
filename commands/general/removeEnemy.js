const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    Events,
    StringSelectMenuBuilder,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "commands/general/json.sqlite" });
const hasValueDeep = require("../../utils/checkObject");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove_enemy")
        .setDescription("remove enemy from the list")
        .addStringOption((options) =>
            options
                .setName("type")
                .setDescription("remove Guild or Member ?")
                .setRequired(true)
                .addChoices(
                    { name: "guild", value: "guilds" },
                    { name: "member", value: "members" }
                )
        )
        .addStringOption((options) =>
            options
                .setName("mention")
                .setDescription("Mention with the message after the update")
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
        let guildOrMember = interaction.options.getString("type");
        let mention = interaction.options.getString("mention");
        let list = await db.get(
            `guild.${interaction.guild.id}.enemies.${guildOrMember}`
        );
        if (!list || list.length === 0) {
            return interaction.reply("**There is no Enemies**");
        }
        let enemiesListArr = [];
        for (const guild of await db.get(
            `guild.${interaction.guild.id}.enemies.${guildOrMember}`
        )) {
            enemiesListArr.push({
                label: guild.name,
                description: guild.full,
                value: `${guild.full}!!${guildOrMember}!!##${mention}##`,
            });
        }
        const allianceList = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("remove_enemy")
                .setPlaceholder("Nothing selected")
                .addOptions(
                    enemiesListArr.map((guild) => {
                        return {
                            label: guild.label,
                            description: guild.description,
                            value: guild.value,
                        };
                    })
                )
        );
        return await interaction.reply({
            content: "Select to remove",
            components: [allianceList],
        });
    },
};
