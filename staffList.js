const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "commands/general/json.sqlite" });
const hasValueDeep = require("../../utils/checkObject");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder().setName("staff_list").setDescription("server staff list"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
      if (interaction.guild === null) {
          interaction.reply({
              content: "**You can't use commands on dm**",
              ephemeral: true,
          });
      } else {
        let staffList = [];
        let staffListDB = await db.get(
          `guild.${interaction.guild.id}.staff`)
        if (!staffListDB) {
            return interaction.reply(`**No Staff on ${interaction.guild.name} server**`)
          }
        staffListDB.forEach(async staffID => {
          await client.users.fetch(staffID).then(async user => {
            await staffList.push({name: user.username, id: user.id})
          })
        });
        console.log(await staffList)
          const staffListEmbed = new EmbedBuilder()
            .setColor("Blue")
          .addFields(
              staffList.map((staff) => {
                return {
                    name: staff.name,
                    value: `<@${staff.id}>`,
                };
            })
          )
          return interaction.reply({ content: `**${interaction.guild.name} - Staff list**`, embeds: [staffListEmbed] });
      }
  },
};
