const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'commands/general/json.sqlite' });
const hasValueDeep = require('../../utils/checkObject');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add_enemie')
    .setDescription('add enemie to the list')
    .addStringOption((options) =>
      options
        .setName('type')
        .setDescription('Add Guild or Member ?')
        .setRequired(true)
        .addChoices({ name: 'guild', value: 'guild' }, { name: 'member', value: 'member' }),
    )
    .addStringOption((options) => options.setName('name').setDescription('The name').setRequired(true))
    .addStringOption((options) => options.setName('tag').setDescription('The tag').setRequired(true))
    .addStringOption((options) =>
      options
        .setName('mention')
        .setDescription('Mention with the message')
        .setRequired(true)
        .addChoices({ name: 'everyone', value: '@everyone' }, { name: 'here', value: '@here' }, { name: 'none', value: '..' }),
    ),
  // .addBooleanOption((options) => options.setName('embed').setDescription('Send as Embed or normal text ?').setRequired(true)),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    let lastMessageC = await db.get(`guild.${interaction.guild.id}.lastMessage.enemies`);
    interaction.guild.channels.cache
      .get(lastMessageC.channel)
      .messages.fetch(lastMessageC.message)
      .then(async (message) => {
        function pluck(array, key) {
          return array.map(function (obj) {
            return `**${obj[key]}**`;
          });
        }
        const name = interaction.options.getString('name');
        const tag = interaction.options.getString('tag');
        // const isEmbed = interaction.options.getBoolean('embed');
        let lastMessage = await db.get(`guild.${interaction.guild.id}.lastMessage.enemies`);
        if (!lastMessage?.channel || !lastMessage) {
          return interaction.reply('**Set a channel by using </send_enemies:1058807787376873622> **');
        } else if (!lastMessage.message) {
          interaction.guild.channels.cache
            .get(lastMessage.channel)
            .send(msg)
            .then((message) => message.edit(msg.replace('..', '@everyone')));
          interaction.reply({ content: `**${name} [${tag}] Added to the Enemies list**` });
        } else {
          const type = interaction.options.getString('type');
          if (type === 'guild') {
            await db.push(`guild.${interaction.guild.id}.enemies.guilds`, [{ name: name, tag: tag, full: `${name} [${tag}]` }]);
          } else if (type === 'member') {
            await db.push(`guild.${interaction.guild.id}.enemies.members`, [{ name: name, tag: tag, full: `${name} [${tag}]` }]);
          }
          let guildEnemies = await db.get(`guild.${interaction.guild.id}.enemies.guilds`);
          let memberEnemies = await db.get(`guild.${interaction.guild.id}.enemies.members`);
          let members, guilds, mention;
          mention = interaction.options.getString('mention');
          if (!memberEnemies || memberEnemies.length === 0) {
            members = '**No Enemies :)**';
          } else {
            members = pluck(await memberEnemies, 'full').join('\n');
          }
          if (!guildEnemies || guildEnemies.length === 0) {
            guilds = '**No Enemies :)**';
          } else {
            guilds = pluck(await guildEnemies, 'full').join('\n');
          }
          let msg = `**__Guilds:__**
${guilds}

**__Members:__**
${members}

${mention}`;
          interaction.guild.channels.cache
            .get(lastMessage.channel)
            .messages.fetch(lastMessage.message)
            .then((message) => message.edit(msg.replace('..', '@everyone')))
            .catch((err) => {
              interaction.guild.channels.cache
                .get(lastMessage.channel)
                .send(msg)
                .then((message) => message.edit(msg.replace('..', '@everyone')));
            });
          interaction.guild.channels.cache
            .get(lastMessage.channel)
            .send(interaction.options.getString('mention'))
            .then((message) => message.delete());
          interaction.reply({ content: `**${name} [${tag}] Added to the Enemies list**` });
        }
      })
      .catch(async (err) => {
        return interaction.reply('**Set a channel by using </send_enemies:1058807787376873622> **');
      });
    // interaction.guild.channels.cache
    //   .get(lastMessage.channel)
    //   .messages.fetch(lastMessage.message)
    //   .then((message) => message.edit(msg));
    // interaction.reply({ content: `${name} [${tag}] Are now Enemies`, ephemeral: true });
  },
};
