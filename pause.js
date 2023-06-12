const { AudioPlayerStatus } = require('@discordjs/voice');
const Queue = require('../modules/queue.js');

module.exports = async (interaction) => {
    if (Queue.getPlayer(interaction.guild.id)) {
        if (Queue.getPlayer(interaction.guild.id).state.status === AudioPlayerStatus.Playing || Queue.getPlayer(interaction.guild.id).state.status === AudioPlayerStatus.Buffering) {
            Queue.getPlayer(interaction.guild.id).pause();   
            interaction.editReply('Wstrzymałem odtwarzanie.');
        } else {
            Queue.getPlayer(interaction.guild.id).unpause();
            interaction.editReply('Wznowiłem odtwarzanie.')
        }
     }
};

module.exports.config = {
    "name": "pause",
    "description": "Wstrzymaj bicior."
};