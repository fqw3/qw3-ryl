const { loadCommands } = require('../../handlers/commandHandler');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    client.user.setActivity(`qw3 Bot`);
    console.log(`${client.user.tag} is ready!`);
    loadCommands(client)
  },
};
