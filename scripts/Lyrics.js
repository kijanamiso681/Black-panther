const { keith } = require('../keizzah/command');
const lyricsFinder = require('lyrics-finder');
const yts = require("yt-search");

keith({
    pattern: "lyrics",
    alias: ["lyric", "finder"], 
    react: "📑",
    desc: "Find lyrics for a song.",
    category: "technology",
    filename: __filename
}, 
async (zk, mek, m, { from, quoted, body, isKeith, command, args, text, reply }) => {
    try {
        if (!text) return reply("Please provide a song name and artist.");
        
        // Search for the song using yts (youtube search)
        const info = await yts(text);
        const results = info.videos;

        if (!results || results.length === 0) {
            return reply("No results found for the given song or artist.");
        }

        // Try to extract the artist and song from the search text
        const songDetails = text.split(' ').reverse();  // Reverse to check both formats
        const title = songDetails.slice(0, songDetails.length - 1).join(' '); // All but the last part as title
        const artist = songDetails[songDetails.length - 1]; // The last part as artist
        
        // Fetch lyrics using lyricsFinder
        const lyrics = await lyricsFinder(artist, title);

        if (!lyrics) {
            return reply(`Sorry, I couldn't find any lyrics for "${text}". Please try another song.`);
        }

        // Format the lyrics message
        const formattedMessage = `
*ALPHA-MD LYRICS FINDER*
*Title:* ${title}
*Artist:* ${artist}

${lyrics}
        `;

        // Send both the image and the formatted message with the lyrics
        await zk.sendMessage(m.chat, { 
            image: { url: results[0].thumbnail }, 
            caption: formattedMessage 
        }, { quoted: mek });

    } catch (error) {
        reply(`Error: I was unable to fetch the lyrics. Please try again later.\n\n${error.message}`);
        console.log(error);
    }
});
