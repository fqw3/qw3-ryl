const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const hasValueDeep = require('../../utils/checkObject');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('The bot ping'),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
      interaction.reply({ content: `**Latency \`${Date.now() - interaction.createdTimestamp}ms\` - API  \`${Math.round(client.ws.ping)}ms\`**` });
  },
};
