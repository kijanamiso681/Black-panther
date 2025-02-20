const { keith } = require('../keizzah/command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const badWords = ["wtf", "mia", "xxx", "fuck", "sex", "huththa", "pakaya", "ponnaya", "hutto", "lol"];
const linkPatterns = [
    /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,   // WhatsApp group or chat links
    /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,           // Telegram links
    /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,           // YouTube links
    /https?:\/\/youtu\.be\/\S+/gi,                        // YouTube short links
    /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,          // Facebook links
    /https?:\/\/fb\.me\/\S+/gi,                           // Facebook short links
    /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,         // Instagram links
    /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,           // Twitter links
    /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,            // TikTok links
    /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,          // LinkedIn links
    /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,          // Snapchat links
    /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,         // Pinterest links
    /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,            // Reddit links
    /https?:\/\/ngl\/\S+/gi,                              // NGL links
    /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,           // Discord links
    /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,             // Twitch links
    /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,             // Vimeo links
    /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,       // Dailymotion links
    /https?:\/\/(?:www\.)?medium\.com\/\S+/gi             // Medium links
];

keith({
    on: "text"
}, async (zk, mek, m, { from, text, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup || isAdmins || !isBotAdmins) return;  // Skip if not in group, or sender is admin, or bot is not admin

        const lowerCaseMessage = text.toLowerCase();

        // Check for bad words
        const containsBadWord = badWords.some(word => lowerCaseMessage.includes(word));
        if (containsBadWord && config.ANTI_BAD === 'true') {
            // Delete the message with bad words
            await zk.sendMessage(from, { delete: mek.key }, { quoted: mek });

            // Send a warning message
            await zk.sendMessage(from, { text: "🚫 ⚠️ BAD WORDS NOT ALLOWED ⚠️ 🚫" }, { quoted: mek });
        }

        // Check for links
        const containsLink = linkPatterns.some(pattern => pattern.test(text));
        if (containsLink && config.ANTI_LINK === 'true') {
            // Delete the message with a link
            await zk.sendMessage(from, { delete: mek.key }, { quoted: mek });

            // Send a warning message and remove the user from the group
            await zk.sendMessage(from, {
                text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`,
                mentions: [sender]
            }, { quoted: mek });

            // Remove the user from the group
            await zk.groupParticipantsUpdate(from, [sender], 'remove');
        }
    } catch (error) {
        console.error(error);
        reply("An error occurred while processing the message.");
    }
});
