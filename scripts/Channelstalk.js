const { keith, commands } = require('../keizzah/command');
const axios = require('axios');

keith({
    pattern: "channelstalk",
    alias: ["wachannel", "stalkchannel"], 
    react: "📑",
    desc: "AI chat.",
    category: "main",
    filename: __filename
}, async (zk, mek, m, { from, text, reply }) => {
    try {
        // Validate input: Ensure the user provided a link
        if (!text) {
            return reply('Please provide a WhatsApp channel link to stalk.');
        }

        // Validate if the link is a valid WhatsApp channel link
        if (!text.includes('whatsapp.com/channel')) {
            return reply('This doesn’t look like a valid WhatsApp channel link.');
        }

        // Send request to the API to fetch channel details
        const response = await axios.get(`https://itzpire.com/stalk/whatsapp-channel`, {
            params: { url: text }
        });

        // Check if the API response contains the necessary data
        if (!response.data.data) {
            return reply('Could not fetch data for the provided channel link.');
        }

        const { img, title, followers, description } = response.data.data;

        // Send the channel details along with the image to the user
        await zk.sendMessage(from, {
            image: { url: img },
            caption: `Channel Name: ${title}\n\nFollowers: ${followers}\n\nDescription: ${description}`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        return reply('An error occurred while fetching the channel details. Please try again later.');
    }
});
