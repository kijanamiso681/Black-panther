const { keith } = require('../keizzah/command');
const axios = require("axios");

keith({
  pattern: "twittersearch",
  alias: ["xsearch", "searchx"],
  react: "🌐",
  desc: "Check bot online or not.",
  category: "developer",
  filename: __filename
}, async (zk, mek, m, { quoted, reply, arg, text, q, args, from }) => {
  // Check if there is a query in the arguments
  if (!text) {
    return reply('Please provide a query!');
  }

  try {
    // Define the search API URL
    const searchApiUrl = `https://apis-starlights-team.koyeb.app/starlight/Twitter-Posts?text=${encodeURIComponent(text)}`;
    const response = await axios.get(searchApiUrl);
    const searchData = response.data.result;  // Assuming 'result' contains an array of tweets

    // Check if no results are found
    if (!searchData || searchData.length === 0) {
      return reply("No Twitter search results found.");
    }

    // Construct the search message
    let searchMessage = `𝐀𝐋𝐏𝐇𝐀 𝐌𝐃 𝐓𝐖𝐈𝐓𝐓𝐄𝐑 𝐒𝐄𝐀𝐑𝐂𝐇\n\n`;
    searchMessage += `Creator: ${response.data.creator}\n\n`;  // Include the creator info

    // Loop through search results and append details to the message
    searchData.forEach((track, index) => {
      const trackNumber = index + 1; // Number tracks starting from 1
      searchMessage += `*┃${trackNumber}.* ${track.user}\n`;
      searchMessage += `*┃Profile*: ${track.profile || "Unknown"}\n`;
      searchMessage += `*┃Post*: ${track.post}\n`;  // The text of the tweet
      searchMessage += `*┃User Link*: ${track.user_link}\n`;  // Link to the user's profile
      searchMessage += `───────────────────◆\n\n`;
    });

    // Send the search result message
    await zk.sendMessage(
      from,
      {
        text: searchMessage,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            showAdAttribution: true,
            title: "ALPHA MD TWITTER SEARCH",
            body: "Powered by KeithKeizzah",
            sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      }
    );
  } catch (error) {
    // Log and respond with the error message
    console.error(error);  // Log the error to the console
    reply(`Error: ${error.message || 'Something went wrong.'}`);
  }
});
