const { getVoiceConnection } = require('@discordjs/voice');
const Queue = require('../helper/queue.js');

module.exports = async (interaction) => {
    // stop playing
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
            await Queue.shuffleQueue(interaction.guild.id);
            interaction.editReply(':stop_button: **|** Przetasowałem piosenki.');
     }};