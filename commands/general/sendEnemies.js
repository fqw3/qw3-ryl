const e = require('cors');
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB({ filePath: 'commands/general/json.sqlite' });
const hasValueDeep = require('../../utils/checkObject');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send_enemies')
    .setDescription('Send enemies message')
    .addChannelOption((options) => options.setName('channel').setDescription('Select a channel to send the enemies list').setRequired(true))
    .addStringOption((options) =>
      options
        .setName('mention')
        .setDescription('Mention with the message')
        .setRequired(true)
        .addChoices({ name: 'everyone', value: '@everyone' }, { name: 'here', value: '@here' }, { name: 'none', value: 'None_qw3!' }),
    ),
  // .addBooleanOption((options) => options.setName('embed').setDescription('Send as Embed or normal text ?').setRequired(true)),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  //! No Enemies
  async execute(interaction) {
    // let lastMessage = await db.get(`guild.${interaction.guild.id}.lastMessage.alliance`);
    // try {
    //   interaction.guild.channels.cache.get(lastMessage.channel);
    // } catch (err) {
    //   await db.set(`guild.${interaction.guild.id}.lastMessage.alliance`, {
    //     channel: interaction.options.getChannel('channel'),
    //     message: '1',
    //     mention: '@here',
    //   });
    // }
    let lastMessage = await db.get(`guild.${interaction.guild.id}.lastMessage.enemies`);
    async function sendEnemies() {
      // await db.delete(`guild.${interaction.guild.id}.alliance`);
      // return interaction.reply(`**No Message**`);
      // .catch(async (err) => {
      // } catch (err) {
      // try {
      // } catch(err) {
      function pluck(array, key) {
        return array.map(function (obj) {
          return `**${obj[key]}**`;
        });
      }
      let guildEnemies = await db.get(`guild.${interaction.guild.id}.enemies.guilds`);
      let memberEnemies = await db.get(`guild.${interaction.guild.id}.enemies.members`);
      const mention = interaction.options.getString('mention');
      let members, guilds;
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
      async function qw3(message) {
        message.edit(msg.replace('None_qw3!', '..'));
        await db.set(`guild.${interaction.guild.id}.lastMessage.enemies`, { channel: message.channel.id, message: message.id, mention: mention });
      }
      async function qw33(message) {
        await db.set(`guild.${interaction.guild.id}.lastMessage.enemies`, { channel: message.channel.id, message: message.id, mention: mention });
      }
      const selectedChannel = interaction.options.getChannel('channel') || interaction.channel;
      if (mention !== 'None_qw3!') {
        selectedChannel.send({ content: msg }).then((message) => {
          qw33(message);
        });
      } else {
        selectedChannel.send({ content: msg }).then(async (message) => {
          qw3(message);
        });
      }
      interaction.reply({ content: `**Enemies list sent to <#${selectedChannel.id}>**` });
      // });
    }
    try {
      interaction.guild.channels.cache
        .get(lastMessage.channel)
        .messages.fetch(lastMessage.message)
        .then((message) => {
          return interaction.reply(`**There is already an enemies message here <#${lastMessage.channel}>**`);
        })
        .catch(async (err) => {
          sendEnemies();
          // }
        });
    } catch (err) {
      sendEnemies();
    }
  },
};
