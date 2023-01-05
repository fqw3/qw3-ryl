const { ChatInputCommandInteraction } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "commands/general/json.sqlite" });
const hasValueDeep = require("../../utils/checkObject");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isStringSelectMenu()) return;
      async function remove(allianceOrEnemy, allianceOrEnemyCapital) {
        function pluck(array, key) {
          return array.map(function (obj) {
              return `**${obj[key]}**`;
          });
      }
      let value = interaction.values[0].split("!!");
      let guildOrMember = value[1];
      await interaction.deferUpdate();
      let arr = await db.get(
          `guild.${interaction.guild.id}.${allianceOrEnemy}.${guildOrMember}`
      );
      let index = arr.findIndex((x) => x.full === value[0]);
      if (index > -1) {
          // only splice array when item is found || https://stackoverflow.com/a/5767357/18428010
          arr.splice(index, 1); // 2nd parameter means remove one item only
      }
      await db.set(
          `guild.${interaction.guild.id}.${allianceOrEnemy}.${value[1]}`,
          arr
      );
      // !
      let lastMessage = await db.get(
          `guild.${interaction.guild.id}.lastMessage.${allianceOrEnemy}`
      );
      let guildaAlliance = await db.get(
          `guild.${interaction.guild.id}.${allianceOrEnemy}.guilds`
      );
      let memberAlliance = await db.get(
          `guild.${interaction.guild.id}.${allianceOrEnemy}.members`
      );
      let members, guilds, mention;
      mention = value[2].split("##")[1];
      if (!memberAlliance || memberAlliance.length === 0) {
          members = `**No ${allianceOrEnemyCapital} :)**`;
      } else {
          members = pluck(await memberAlliance, "full").join("\n");
      }
      if (!guildaAlliance || guildaAlliance.length === 0) {
          guilds = `**No ${allianceOrEnemyCapital} :)**`;
      } else {
          guilds = pluck(await guildaAlliance, "full").join("\n");
      }
      let msg = `**__Guilds:__**
${guilds}

**__Members:__**
${members}

${mention}`;
      interaction.guild.channels.cache
          .get(lastMessage.channel)
          .messages.fetch(lastMessage.message)
          .then((message) => message.edit(msg.replace("..", "@everyone")))
          .catch((err) => {
              interaction.guild.channels.cache
                  .get(lastMessage.channel)
                  .send(msg)
                  .then((message) =>
                      message.edit(msg.replace("..", "@everyone"))
                  );
          });
      interaction.guild.channels.cache
          .get(lastMessage.channel)
          .send(value[2].split("##")[1])
          .then((message) => message.delete());
      // !
      await interaction.editReply({
          content: `**Removed ${value[0]} from the ${allianceOrEnemyCapital} List**`,
          components: [],
      });
        }
        if (interaction.customId === "remove_alliance") {
          return remove("alliance", "Alliance")
        }
        if (interaction.customId === "remove_enemy") {
          return remove("enemies", "Enemies")
        }
    },
};
