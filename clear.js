const { getVoiceConnection } = require('@discordjs/voice');
const Queue = require('../modules/queue.js');

module.exports = async (interaction) => {
    // stop playing
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
            await Queue.removeQueue(interaction.guild.id);
            interaction.editReply(':stop_button: **|** Wyczyściłem kolejke.');
     }};

// export properties
module.exports.config = {
    "name": "clear",
    "description": "Wyczyść kolejkę biciorów."
};