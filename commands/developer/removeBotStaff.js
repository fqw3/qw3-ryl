const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'commands/general/json.sqlite' });
const hasValueDeep = require('../../utils/checkObject');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('remove_bot_staff')
    .setDescription('Remove Staff')
    .addUserOption((options) => options.setName('staff_name').setDescription('The user').setRequired(true)),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    function hasValueDeep(json, findValue) {
      try {
        const values = Object.values(json);
      } catch (err) {
        return false;
      }
      const values = Object.values(json);
      let hasValue = values.includes(findValue);
      values.forEach(function (value) {
        if (typeof value === 'object') {
          hasValue = hasValue || hasValueDeep(value, findValue);
        }
      });
      return hasValue;
    }
    let staffID = interaction.options.getUser('staff_name').id;
    if (typeof(await db.get(`guild.staff`)) !== "object" || !Object.values(await db.get(`guild.staff`)).includes(staffID)) {
      interaction.reply({ content: `**<@${staffID}> is not in the staff list**` });
    } else {
      let staffList = await db.get(`guild.staff`);
      console.log(staffList.indexOf(staffID));
      await db.delete(`guild.staff[${staffList.indexOf(staffID)}]`)
      interaction.reply({ content: `**Removed <@${staffID}> from the staff list**` });
    }
  },
};
