const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require('discord.js');
const { loadCommands } = require('../../handlers/commandHandler');
const { loadEvents } = require('../../handlers/eventHandler');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload your commands and events')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options.setName('events').setDescription('Reload Events'))
    .addSubcommand((options) => options.setName('commands').setDescription('Reload Commands')),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case 'events':
        {
          for (const [key, value] of client.events) client.removeListener(`${key}`, value, true);
          loadEvents(client);
          interaction.reply({ content: '**Events Reloaded**', ephemeral: true });
        }
        break;
      case 'commands':
        {
          loadCommands(client);
          interaction.reply({ content: '**Commands Reloaded**', ephemeral: true });
        }
        break;
    }
  },
};
