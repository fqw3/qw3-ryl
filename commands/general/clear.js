const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'commands/general/json.sqlite' });
const hasValueDeep = require('../../utils/checkObject');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear All')
    .addStringOption((options) =>
      options
        .setName('clear')
        .setDescription('Choose what to clear')
        .setRequired(true)
        .addChoices(
          { name: 'everything', value: 'everything' },
          { name: 'enemies', value: 'enemies' },
          { name: 'alliance', value: 'alliance' },
          { name: 'staff', value: 'staff' },
        ),
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (interaction.options.getString('clear') === 'everything') {
      await db.delete(`guild.${interaction.guild.id}`);
      await db.delete("guild.staff")
    } else {
      await db.delete(`guild.${interaction.guild.id}.${interaction.options.getString('clear')}`);
    }
    interaction.reply({ content: 'Done!', ephemeral: true });
  },
};
