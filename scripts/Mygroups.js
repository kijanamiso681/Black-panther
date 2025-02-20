const { keith } = require('../keizzah/command');

keith({
    pattern: "mygroup",
    desc: "Get all the groups the bot is a part of.",
    alias: ["mygroups", "mgroup"],
    category: "owner",
    react: "🚫",
    filename: __filename
}, async (zk, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("*Are you the bot owner?*");

    try {
        let getGroupzs = await zk.groupFetchAllParticipating();
        let groupzs = Object.entries(getGroupzs).map(entry => entry[1]);
        let anaa = groupzs.map(v => v.id);

        let jackhuh = `*My groups*\n\n`;
        await reply(`Bot is in ${anaa.length} groups. Fetching and sending their JIDs...`);

        const promises = anaa.map(async (i) => {
            try {
                let metadat = await zk.groupMetadata(i);
                jackhuh += `Subject: ${metadat.subject}\n`;
                jackhuh += `Members: ${metadat.participants.length}\n`;
                jackhuh += `JID: ${i}\n\n`;
            } catch (err) {
                jackhuh += `Failed to fetch data for group with JID: ${i}\n\n`;
            }
        });

        await Promise.all(promises);
        reply(jackhuh);
    } catch (e) {
        reply("Error occurred while accessing bot groups.\n\n" + e);
    }
});
