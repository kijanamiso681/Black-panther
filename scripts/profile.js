const { keith } = require('../keizzah/command');

keith({
    pattern: "profile",
    react: "🌐",
    desc: "Check bot online or not.",
    category: "universal",
    filename: __filename
}, async (zk, mek, m) => {
    
    let sender = null;
    let name = null;

    // Check if the message is a reply or not
    if (m.quoted) {
        // If it's a reply, use the quoted sender's details
        sender = m.quoted.sender;
        name = "@" + m.quoted.sender.split("@")[0];  // Format the name with @username
    } else {
        // If not a reply, use the message sender's details
        sender = m.sender;
        name = m.pushName;
    }

    // Function to fetch status
    const fetchStatus = async () => {
        try {
            const status = await zk.fetchStatus(sender);
            return status.status || "About not accessible due to user privacy";
        } catch {
            return "About not accessible due to user privacy"; // Fallback status
        }
    };

    // Construct the URL for the profile picture
    const ppUrl = `https://avatar.example.com/${sender.split('@')[0]}.jpg`;  // Replace with actual URL pattern

    // Fetch the status
    const status = await fetchStatus();

    // Construct the message with the profile picture URL, name, and status
    const message = {
        image: { url: ppUrl },
        caption: `Name: ${name}\nAbout:\n${status}`,
        mentions: [sender]  // Mention the sender (quoted or original)
    };

    // Send the message to the chat
    await zk.sendMessage(m.chat, message, { quoted: mek });
});
