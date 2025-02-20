const config = require('../config');
const fs = require('fs');
const os = require('os');
const { keith, commands } = require('../keizzah/command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../keizzah/functions');

keith({
    pattern: 'ping',
    react: '⚔️',
    alias: ['speed', 'latency'],
    desc: 'Check bot\'s speed / latency',
    category: 'system',
    use: '.ping2',
    filename: __filename
}, async (zk, mek, m, { from, l, quoted, body, isKeith, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Record initial timestamp
        const initial = new Date().getTime();

        // Send a temporary ping message
        let ping = await zk.sendMessage(from, { text: '*_pinging..._*' }, { quoted: mek });

        // Record final timestamp after message is sent
        const final = new Date().getTime();

        // Delete the temporary ping message
        await zk.sendMessage(from, { delete: ping.key });

        // Send the pong message with ping time
        await zk.sendMessage(from, { 
            text: `𝖆𝖑𝖕𝖍𝖆 𝖘𝖕𝖊𝖊𝖉 ${final - initial} 𝐌/𝐒`,
            contextInfo: {
                mentionedJid: [m.sender], // Mention the sender
                externalAdReply: {
                    title: "𝐀𝐋𝐏𝐇𝐀-𝐌𝐃",
                    body: "𝘱𝘪𝘯𝘨𝘪𝘯𝘨",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });
    } catch (e) {
        // Handle errors
        reply('*Error !!*');
        l(e); // Log the error
    }
});
