const { keith } = require('../keizzah/command');

keith({
    pattern: "gpt",
    alias: ["gemini", "chat"], 
    react: "📑",
    desc: "ai chat.",
    category: "technology",
    filename: __filename
},
async (zk, mek, m, { from, quoted, body, isKeith, command, args, text, reply }) => {
    try {
        if (!text) return reply("This is Keith assistant, what is your query?");

        const { default: Gemini } = await import('gemini-ai');
        const gemini = new Gemini("AIzaSyBK1U4dgP9XtN6qgyB3YtMD5nsLbmM7ruM");
        const chat = gemini.createChat();

        const res = await chat.ask(text);  // Use q as input to the chat

        await reply(res);
    } catch (e) {
        reply("I am unable to generate responses\n\n" + e);
    }
});
