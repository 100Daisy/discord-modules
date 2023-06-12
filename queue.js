const { getVoiceConnection } = require('@discordjs/voice');
const Queue = require('../helper/queue.js');

module.exports = async (interaction) => {
    // stop playing
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
        interaction.editReply(Queue.getQueue(interaction.guild.id).map((song, i) => `${i + 1}. ${song.title}`).join('\n'));
    }
};

module.exports.config = {
    "name": "queue",
    "description": "Pokaż kolejkę biciorów."
};