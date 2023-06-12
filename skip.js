const { getVoiceConnection } = require('@discordjs/voice');
const Queue = require('../helper/queue.js');

module.exports = async (interaction) => {
    // get optional option
    const option = interaction.options.get('ilosc')?.value;
    // stop playing
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
        if (option) {
            await Queue.skipQueue(interaction.guild.id, option);
            interaction.editReply(':stop_button: **|** Pominąłem biciory.');
        } else {
            await Queue.skipQueue(interaction.guild.id);
            interaction.editReply(':stop_button: **|** Pominąłem bicior.');
        }
     }};

module.exports.config = {
    "name": "skip",
    "description": "Pomiń bicior."
};