const { keith } = require('../keizzah/command');

keith({
    pattern: "crash",
    desc: "Kicks all non-admin members from the group.",
    react: "👏",
    category: "group",
    filename: __filename,
}, async (zk, mek, m, { isGroup, isAdmins, isOwner, isBotAdmins, text, reply, args }) => {
    try {
        // Ensure the user is an admin and owner
        if (!isAdmins) return reply("Only admins can use this command.");
        if (!isOwner) return reply("Only the group owner can use this command.");

        // Ensure the command is used in a group
        if (!isGroup) return reply("This command can only be used in groups.");

        // Ensure the bot has admin privileges
        if (!isBotAdmins) return reply("The bot is not an admin in this group.");

        // Ensure a group link is provided
        if (!text) return reply("Please provide a valid group link. Ensure the bot is an admin in that group.");

        let groupId, groupName;
        try {
            // Extract group ID from the invite link
            const inviteCode = args[0].split("https://chat.whatsapp.com/")[1];
            const groupInfo = await zk.groupGetInviteInfo(inviteCode);
            ({ id: groupId, subject: groupName } = groupInfo);
        } catch (error) {
            return reply("The provided group link is invalid.");
        }

        // Fetch group metadata and participants
        const groupMetadata = await zk.groupMetadata(groupId);
        const participants = groupMetadata.participants;

        // Filter out the bot itself from the participant list
        const participantIds = participants
            .filter(participant => participant.id !== zk.decodeJid(zk.user.id))
            .map(participant => participant.id);

        // Notify about the crash process initiation
        await reply(`⚠️ Crash command initiated in ${groupName}. ${participantIds.length} participants will be removed.`);

        // Update group settings and revoke invites
        await zk.groupSettingUpdate(groupId, "announcement");
        await zk.groupUpdateSubject(groupId, "🎭 K҉E҉I҉T҉H҉ C҉R҉A҉S҉H҉E҉R҉ 🎭");
        await zk.groupUpdateDescription(groupId, "🎭 K҉E҉I҉T҉H҉ C҉R҉A҉S҉H҉E҉R҉ 🎭");
        await zk.groupRevokeInvite(groupId);

        // Send notification to group participants
        await zk.sendMessage(groupId, {
            text: `⚠️ This process is irreversible. ${participantIds.length} participants will be removed.`,
            mentions: participants.map(p => p.id)
        });

        // Remove the participants
        await zk.groupParticipantsUpdate(groupId, participantIds, "remove");

        // Notify the group about the action
        await zk.sendMessage(groupId, { text: "Goodbye, all non-admin participants!" });

        // Make the bot leave the group
        await zk.groupLeave(groupId);

        // Final confirmation message to the owner
        await reply("Successfully terminated the group.");
        
    } catch (error) {
        console.error(error);
        reply("Error: Crash command failed. The bot might not be in that group or doesn't have admin privileges.");
    }
});
