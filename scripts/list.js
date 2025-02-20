const { keith, commands } = require('../keizzah/command');
const { runtime } = require('../keizzah/functions');
const { platform, totalmem, freemem } = require('os');
const axios = require('axios');

// Function to convert text to fancy uppercase font
const toFancyUppercaseFont = (text) => {
    const fonts = {
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌',
        'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    };
    return typeof text === 'string' ? text.split('').map(char => fonts[char] || char).join('') : text;
};

// Function to convert text to fancy lowercase font
const toFancyLowercaseFont = (text) => {
    const fonts = {
        'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 
        'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣'
    };
    return typeof text === 'string' ? text.split('').map(char => fonts[char] || char).join('') : text;
};

// Command to list all bot commands along with descriptions and aliases
keith({
    pattern: "help",
    react: "⚔️",
    alias: ["panelist", "commandlist", "cmdlist", "list"],
    desc: "Get bot command list.",
    category: "universal",
    use: '.menu',
    filename: __filename
}, async (zk, mek, m, { from, pushname }) => {
    let menu = 'ᴀʟᴘʜᴀ ᴍᴅ ʟɪsᴛ\n\n';
    let keithList = [];

    // Loop through all commands to fetch the relevant information (command, description, and alias)
    commands.forEach((command) => {
        const { pattern, desc = 'No description available', alias = 'No aliases', dontAddCommandList } = command;

        if (!dontAddCommandList && pattern !== undefined) {
            keithList.push({ keith: pattern, desc, alias });
        }
    });

    // Sort the command list alphabetically by command name
    keithList.sort((a, b) => a.keith.localeCompare(b.keith));

    // Format and add each command, description, and alias to the menu
    keithList.forEach(({ keith, desc, alias }, index) => {
        menu += `${index + 1}. ${toFancyUppercaseFont(keith.trim())}\n`;
        menu += `Description: ${toFancyLowercaseFont(desc)}\n`;
        menu += `Aliases: ${toFancyLowercaseFont(alias)}\n\n`;
    });

    // Send the formatted menu as a message
    return await zk.sendMessage(m.chat, {
        text: menu,
        contextInfo: {
            mentionedJid: [pushname], // Mention the sender
            externalAdReply: {
                title: "𝗔𝗟𝗣𝗛𝗔-𝗠𝗗",
                body: "𝐫𝐞𝐠𝐚𝐫𝐝𝐬 𝐊𝐞𝐢𝐭𝐡𝐤𝐞𝐢𝐳𝐳𝐚𝐡",
                thumbnailUrl: "https://telegra.ph/file/967c663a5978c545f78d6.jpg",
                sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    });
});
