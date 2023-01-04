const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder().setName('servers').setDescription('leave'),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    client.guilds.cache.forEach(guild => {
      console.log(`${guild.name} | ${guild.id}`);
    })
    interaction.reply({ content: '**Done**', ephemeral: true });
  },
};
