const { keith } = require('../keizzah/command');
const config = require('../config');

keith({
    pattern: "owner",
    react: "🦁", 
    alias: ["keith", "master"],
    desc: "Get owner number",
    category: "master",
    filename: __filename
}, async (zk, mek, m, { from }) => {
    try {
        // Retrieve owner information from config
        const ownerNumber = config.OWNER_NUMBER; 
        const ownerName = config.BOT_NAME; 
        const organization = 'UD TEAM'; // Optional: replace with the owner's organization

        // Create a vCard (contact card) for the owner
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nORG:${organization}\nTEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\nEND:VCARD`;

        // Send the vCard (contact card) to the user
        const sentVCard = await zk.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send a reply with the owner's contact and a reference to the vCard
        await zk.sendMessage(from, {
            text: `This is the owner's contact: ${ownerName}`,
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`], // Corrected the JID format
                quotedMessageId: sentVCard.key.id // Reference the vCard message correctly
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await zk.sendMessage(from, { text: 'Sorry, there was an error fetching the owner contact.' }, { quoted: mek });
    }
});
