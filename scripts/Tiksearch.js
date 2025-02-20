const { keith } = require('../keizzah/command');
const axios = require("axios");

keith({
  pattern: "tiksearch",
  alias: ["searchtiktok", "searchtik", "tiktoksearch"],
  react: "🌐",
  desc: "search for tiktok username and spy on his/her account.",
  category: "search",
  filename: __filename
}, async (zk, mek, m, { quoted, reply, arg, text, q, args, from }) => {

  // Check if a query (search term) is provided
  if (!text) {
    return reply('Please provide a query!');
  }

  try {
    // Construct the search URL for the TikTok API with the provided query
    const searchApiUrl = `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(text)}`;
    
    // Send GET request to the API
    const response = await axios.get(searchApiUrl);

    // Check if search results are present in the response
    const searchData = response.data.data;
    if (!searchData || searchData.length === 0) {
      return reply("No TikTok search results found.");
    }

    // Initialize message to send with search results
    let searchMessage = `𝐀𝐋𝐏𝐇𝐀 𝐌𝐃 𝐓𝐈𝐊𝐓𝐎𝐊 𝐒𝐄𝐀𝐑𝐂𝐇\n\n`;

    // Loop through search results and construct the track details message
    searchData.forEach((track, index) => {
      const trackNumber = index + 1; // Number tracks starting from 1

      searchMessage += `*┃${trackNumber}.* ${track.title}\n`;
      searchMessage += `*┃Region*: ${track.region || "Unknown"}\n`;
      searchMessage += `*┃ID*: ${track.id}\n`;  // Video ID
      searchMessage += `*┃Video URL*: ${track.url}\n`;
      searchMessage += `*┃Cover Image*: ${track.cover}\n`;
      searchMessage += `*┃Views*: ${track.views || 0}\n`;
      searchMessage += `*┃Likes*: ${track.likes || 0}\n`;
      searchMessage += `*┃Comments*: ${track.comments || 0}\n`;
      searchMessage += `*┃Shares*: ${track.share || 0}\n`;
      searchMessage += `*┃Download Count*: ${track.download || 0}\n`;
      searchMessage += `───────────────────◆\n\n`;
    });

    // Send the constructed message with search results
    await zk.sendMessage(
      from,
      {
        text: searchMessage,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            showAdAttribution: true,
            title: "ALPHA MD TIKTOK SEARCH",
            body: "Powered by KeithKeizzah",
            sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      }
    );

  } catch (error) {
    // Log any errors and send error message to user
    console.error(error);  // Log the error for debugging purposes
    reply(`Error: ${error.message || 'Something went wrong.'}`);
  }
});
