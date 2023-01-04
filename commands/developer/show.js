const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'commands/general/json.sqlite' });
const hasValueDeep = require('../../utils/checkObject');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder().setName('show').setDescription('show All'),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (interaction.guild === null) {
      interaction.reply({ content: "**You can't use commands on dm**", ephemeral: true });
    } else {
      // console.log(await db.get("guild"))
      console.log('Enemies');
      console.log(await db.get(`guild.${interaction.guild.id}.lastMessage.enemies`));
      console.log('Alliance');
      console.log(await db.get(`guild.${interaction.guild.id}.lastMessage.enemies`));
      console.log('Staff');
      console.log(await db.get(`guild.${interaction.guild.id}.staff`));
      console.log('Bot Staff');
      console.log(await db.get(`guild.staff`));
      console.log('Last Message');
      console.log(await db.get(`guild.${interaction.guild.id}.lastMessage.enemies.channel`));
      // console.log(await db.get("guild.enemies"))
      interaction.reply({ content: '**Done!**', ephemeral: true });
    }
  },
};
