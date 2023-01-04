const { ChatInputCommandInteraction } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'commands/general/json.sqlite' });
const hasValueDeep = require('../../utils/checkObject');

module.exports = {
  name: 'interactionCreate',
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        content: 'Outdated command',
        ephemeral: true,
      });
    let qw3 = ['731436868964712449'];
    let userID = interaction.user.id;
    let noMsg = '**You are not allowed to use this command**';
    if (interaction.guild === null) {
      return interaction.reply({ content: "**You can't use commands on dm**", ephemeral: true });
    }
    if (command.developer === true && !qw3.includes(staffID)) {
      return interaction.reply({
        content: '**This command is only available for qw3**',
      });
    }
    if (command.developer && qw3.includes(userID) || interaction.guild.ownerId === userID) {
      command.execute(interaction, client);
    } else {
      if (
        typeof (await db.get(`guild.${interaction.guild.id}.staff`)) !== 'object' ||
        !Object.values(await db.get(`guild.${interaction.guild.id}.staff`)).includes(userID)
      ) {
        return interaction.reply({ content: noMsg });
      }
    }
  },
};
