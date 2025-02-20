const { keith } = require('../keizzah/command');

keith({
    pattern: "blocklist",
    desc: "Get all the groups the bot is a part of.",
    alias: ["blockedusers", "listblock"],
    category: "owner",
    react: "🚫",
    filename: __filename
}, async (zk, mek, m, { from, isOwner, quoted, reply }) => {
    // Check if the user is the bot owner
    if (!isOwner) {
        return reply("*You must be the bot owner to use this command.*");
    }

    try {
        // Fetch the blocklist of contacts
        let blocklist = await zk.fetchBlocklist();

        // If there are blocked users, proceed
        if (blocklist.length > 0) {
            // Start the message with a title
            let responseMessage = `*Blocked Contacts*:\n\n`;

            // Inform the user that we are fetching blocked contacts
            await reply(`You have blocked ${blocklist.length} contact(s). Fetching their details...`);

            // Map blocked users to their phone numbers (JID)
            const blockedNumbers = blocklist.map(blockedUser => {
                // Extract the phone number from the JID (remove '@s.whatsapp.net')
                const phoneNumber = blockedUser.split('@')[0];
                return `🗡️ +${phoneNumber}\n`; // Format the phone number nicely
            });

            // Join all the blocked numbers into a single string
            responseMessage += blockedNumbers.join('');

            // Send the formatted message with all blocked contacts
            reply(responseMessage);
        } else {
            // If there are no blocked contacts
            reply("There are no blocked contacts.");
        }
    } catch (e) {
        // Catch any error and log it
        console.error(e);
        reply(`An error occurred while accessing blocked users:\n\n${e.message}`);
    }
});
