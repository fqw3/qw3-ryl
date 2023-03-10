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
        .setName("add_staff")
        .setDescription("add Staff")
        .addUserOption((options) =>
            options
                .setName("staff_name")
                .setDescription("The user")
                .setRequired(true)
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        let staffID = interaction.options.getUser("staff_name");
        if (
            typeof (await db.get(`guild.${interaction.guild.id}.staff`)) !==
                "object" ||
            !Object.values(
                await db.get(`guild.${interaction.guild.id}.staff`)
            ).includes(staffID.id)
        ) {
            db.push(`guild.${interaction.guild.id}.staff`, staffID.id);
            interaction.reply({
                content: `**Added ${staffID.username} to the staff list**`,
            });
        } else {
            interaction.reply({
                content: `**${staffID.username} is already in the staff list**`,
            });
        }
    },
};
