const config = require('../config');
const { keith, commands } = require('../keizzah/command');

keith({
    pattern: "opentime",
    react: "🔖",
    desc: "To open group to a time",
    category: "group",
    use: '.opentime',
    filename: __filename
}, async (zk, mek, m, { from, prefix, reply, isGroup, isAdmins, args, text }) => {
    try {
        if (!isGroup) return reply('This command is meant for groups.');
        if (!isAdmins) return reply('This command is meant for admins.');

        let timer;

        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return reply('Please select a valid time unit: second, minute, hour, or day.\nExample: 10 second');
        }

        reply(`Open time of ${text} starting from now...`);

        setTimeout(() => {
            const openMessage = `*⏰ Open Time 🗿*\nGroup was opened by the bot. Now all members can send messages.`;
            zk.groupSettingUpdate(from, 'not_announcement');
            reply(openMessage);
        }, timer);

        await zk.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        console.error(e);
        reply('An error occurred!');
    }
});

keith({
    pattern: "closetime",
    react: "⏰",
    desc: "To close group to a time",
    category: "group",
    use: '.closetime',
    filename: __filename
}, async (zk, mek, m, { from, prefix, reply, isGroup, isAdmins, args, text }) => {
    try {
        if (!isGroup) return reply('This command is meant for groups.');
        if (!isAdmins) return reply('This command is meant for admins.');

        let timer;

        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return reply('Please select a valid time unit: second, minute, hour, or day.\nExample: 10 second');
        }

        reply(`Close time of ${text} starting from now...`);

        setTimeout(() => {
            const closeMessage = `*⏰ Close Time 🗿*\nThe group has been successfully closed.`;
            zk.groupSettingUpdate(from, 'announcement');
            reply(closeMessage);
        }, timer);

        await zk.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        console.error(e);
        reply('An error occurred!');
    }
});
