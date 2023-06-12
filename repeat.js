const { getVoiceConnection } = require('@discordjs/voice');
const Queue = require('../modules/queue.js');

module.exports = async (interaction) => {
    // stop playing
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
            await Queue.addToRepeat(interaction.guild.id);
            interaction.editReply(':stop_button: **|** Odtwarzam w pętli.');
     }};

module.exports.config = {
    "name": "repeat",
    "description": "Niech bicior będzie na zawsze!"
};