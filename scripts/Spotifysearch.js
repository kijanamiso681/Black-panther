const { keith } = require('../keizzah/command');
const axios = require('axios');

keith({
  pattern: 'spotifylist',
  alias: ['ssearch', 'searchspotify', 'spotifysearch'],
  react: '🌐',
  desc: 'Search for Spotify tracks.',
  category: 'search',
  filename: __filename
}, async (zk, mek, m, { quoted, reply, arg, text, q, args, from }) => {
  // Check if the user provided a search query
  if (!text) {
    return reply('Please provide a query to search for tracks!');
  }

  try {
    // Define the Spotify search API URL
    const searchApiUrl = `https://spotifyapi.caliphdev.com/api/search/tracks?q=${encodeURIComponent(text)}`;
    
    // Make the API request to search for tracks
    const response = await axios.get(searchApiUrl);
    const searchData = response.data;

    // Check if the response contains any tracks
    if (!searchData || !searchData.tracks || searchData.tracks.length === 0) {
      return reply('No Spotify tracks found for your search.');
    }

    // Start constructing the playlist message
    let playlistMessage = `𝐀𝐋𝐏𝐇𝐀 𝐌𝐃 𝐒𝐏𝐎𝐓𝐈𝐅𝐘 𝐏𝐋𝐀𝐘𝐋𝐈𝐒𝐓\n\n`;

    // Loop through the tracks in the search results
    searchData.tracks.forEach((track, index) => {
      const trackNumber = index + 1; // Number tracks starting from 1
      playlistMessage += `*┃${trackNumber}.* ${track.title}\n`;
      playlistMessage += `*┃Artist*: ${track.artist || 'Unknown'}\n`;
      playlistMessage += `*┃Album*: ${track.album || 'Unknown'}\n`;
      playlistMessage += `*┃URL*: ${track.url}\n\n`;
      playlistMessage += `───────────────────◆\n\n`;
    });

    // Send the playlist message back to the user, mentioning them in the message
    await zk.sendMessage(
      from,
      {
        text: playlistMessage,
        contextInfo: {
          mentionedJid: [m.sender],  // Mention the sender's JID
          externalAdReply: {
            showAdAttribution: true,
            title: 'ALPHA MD SPOTIFY LIST',
            body: 'Powered by KeithKeizzah',
            sourceUrl: 'https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47',
            mediaType: 1,
            renderLargerThumbnail: false
          },
        },
      }
    );

  } catch (error) {
    // Handle any errors that occur during the API request
    console.error(error);  // Log the error for debugging
    reply(`Error occurred while fetching data: ${error.message}`);
  }
});
