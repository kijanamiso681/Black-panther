const { keith, commands } = require('../keizzah/command');

keith({
    pattern: "repo",
    react: "⚔️",
    alias: ["script", "sc"],
    desc: "to get bot repository.",
    category: "universal",
    use: '.menu',
    filename: __filename
}, async (zk, mek, m, { from, pushname }) => {
    try {
        // Fetch repository data from GitHub
        const response = await fetch("https://api.github.com/repos/Keithkeizzah/ALPHA-MD1");

        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Failed to fetch repository data');
        }

        const repoData = await response.json();

        // Extract relevant information
        const repoInfo = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            lastUpdate: repoData.updated_at,
            owner: repoData.owner.login,
            createdAt: repoData.created_at,
            url: repoData.html_url
        };

        // Format dates
        const createdDate = new Date(repoInfo.createdAt).toLocaleDateString("en-GB");
        const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString("en-GB");

        // Construct message caption
        const messageCaption = `
*Hello 👋 ${pushname}, this is 𝐀𝐋𝐏𝐇𝐀-𝐌𝐃* 
The best bot in the universe, developed by Kᴇɪᴛʜ Kᴇɪᴢᴢᴀʜ. Fork and give a star 🌟 to my repo.

╭───────────────────────
│✞ *Stars:* ${repoInfo.stars}
│✞ *Forks:* ${repoInfo.forks}
│✞ *Release Date:* ${createdDate}
│✞ *Last Update:* ${lastUpdateDate}
│✞ *Owner:* ${repoInfo.owner}
│✞ *Repository:* ${repoInfo.url}
│✞ *Session:* https://keith-sessions-pi5z.onrender.com
╰───────────────────────
`;

        // Send the generated message to the user
        await zk.sendMessage(m.chat, {
            text: messageCaption,
            contextInfo: {
                mentionedJid: [m.sender], // Mention the sender
                externalAdReply: {
                    title: "🌟 𝐊𝐄𝐈𝐓𝐇-𝐌𝐃 ✨",
                    body: "Regards, Kᴇɪᴛʜ Kᴇɪᴢᴢᴀʜ",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
        await zk.sendMessage(m.chat, { text: 'An unexpected error occurred while generating the repo information.' });
    }
});
