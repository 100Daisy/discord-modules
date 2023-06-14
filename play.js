const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');

const ytdl = require("ytdl-core");
const yts = require('yt-search');
const Queue = require('/app/helper/queue.js');

function setupPlayer(queueId, connection, song) {
    // Create a player
    player = createAudioPlayer();
    // Subscribe the connection to the player (will play audio in voice channel)
    connection.subscribe(player);
    // Play the song
    player.play(song.buffer);
    // When the song is finished, play the next one
    player.on(AudioPlayerStatus.Idle, () => {
        song = Queue.nextSong(queueId)
        if (song) {
            player.play(song.buffer);
        } else {
            // If there are no more songs, remove callbacks
            Queue.removeQueue(queueId);
            Queue.removePlayer(queueId);
        }
    });
    return player;
}

async function getSong(url) { 
        // Check if the url is a valid youtube url
        if (ytdl.validateURL(url)) { 
            // Get song info
            const songInfo = await ytdl.getInfo(url);
            // Create a song object
            return song = {
                title: songInfo.videoDetails.title,
                buffer: createAudioResource(ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })),
            };
        } else {
            // Search for a song
            const { videos } = await yts(url);
            // Check if the search returned any results
            if (!videos.length) {
                // If no results were found, return false
                return false;
            }
            // Create a song object
            return {
                title: videos[0].title,
                buffer: createAudioResource(ytdl(videos[0].url, { filter: 'audioonly', quality: 'highestaudio' })),
            }
        }
}
module.exports = async (interaction) => {
    console.log(Queue)
    const queueId = interaction.guild.id;
    interaction.editReply(":mag_right: **|** Szukam piosenki...")
    getSong(interaction.options.get('piosenka').value).then(song => {
        // check if bot is already in a voice channel
        let connection = getVoiceConnection(interaction.guild.id);
        if (connection) {
            // check if connection is in disconnected state
            if (connection.state.status == VoiceConnectionStatus.Disconnected) {
                connection.rejoin();
            }
            // check if bot is in the same voice channel as the user
            if (connection.joinConfig.channelId == interaction.member.voice.channelId) {
                // check if there's player
                if (Queue.getPlayer(queueId)) {
                    // check if player is playing or buffering state
                    if (Queue.getPlayer(queueId).state.status == AudioPlayerStatus.Playing || Queue.getPlayer(queueId).state.status == AudioPlayerStatus.Buffering) {
                        // add song to queue
                        Queue.addSong(song, queueId);
                        interaction.editReply(`:musical_note: **|** Dodano do kolejki: **${song.title}**`);
                        return;
                    }
                    // There should be no player in Idle state
                } else {
                    // make new player
                    Queue.addPlayer(setupPlayer(queueId, connection, song), queueId);
                    // Reply with the song title
                    interaction.editReply(`:musical_note: **|** Odtwarzam: **${song.title}**`);
                }
            } else {
                // join correct voice channel
                connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                // check if there's player
                if (Queue.getPlayer(queueId)) {
                    // unsubsribe from the old connection
                    Queue.getPlayer(queueId).connection.unsubscribe();
                    // subscribe to the new connection
                    connection.subscribe(Queue.getPlayer(queueId));
                    // check if player is playing or buffering state
                    if (Queue.getPlayer(queueId).state.status == AudioPlayerStatus.Playing || Queue.getPlayer(queueId).state.status == AudioPlayerStatus.Buffering) {
                        // add song to queue
                        Queue.addSong(song, queueId);
                        interaction.editReply(`:musical_note: **|** Dodano do kolejki: **${song.title}**`);
                        return;
                    }
                    // There should be no player in Idle state
                } else {
                    // make new player
                    Queue.addPlayer(setupPlayer(queueId, connection, song), queueId);
                    // Reply with the song title
                    interaction.editReply(`:musical_note: **|** Odtwarzam: **${song.title}**`);
                }
            }
        } else {
            // join correct voice channel
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            // make new player
            Queue.addPlayer(setupPlayer(queueId, connection, song), queueId);
            // Reply with the song title
            interaction.editReply(`:musical_note: **|** Odtwarzam: **${song.title}**`);
        }
    });
};

module.exports.config = {
    "name": "play",
    "description": "Zatrzęś tą remizą!",
    "options": [
        {
        "name": "piosenka",
        "description": "Gruby bicior",
        "type": 3,
        "required": true
        }
    ]
};