const { keith } = require('../keizzah/command');
const { default: axios } = require("axios");
const { mediafireDl } = require("../keizzah/dl/Function");

keith({
    pattern: "fetch",
    alias: ["get", "dl"], 
    react: "📑",
    desc: "Fetch content from a URL.",
    category: "technology",
    filename: __filename
}, 
async (zk, mek, m, { from, quoted, body, isKeith, command, args, text, reply }) => {
    const urlInput = args.join(" ");

    // Check if URL starts with http:// or https://
    if (!/^https?:\/\//.test(urlInput)) {
        return reply("Start the *URL* with http:// or https://");
    }

    try {
        const url = new URL(urlInput);
        const fetchUrl = `${url.origin}${url.pathname}?${url.searchParams.toString()}`;

        // Fetch the URL content
        const response = await axios.get(fetchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
            }
        });

        // Check the content type
        const contentType = response.headers['content-type'];
        console.log('Content-Type:', contentType);

        // Check if the content length is too large
        const contentLength = parseInt(response.headers['content-length'], 10);
        if (contentLength && contentLength > 104857600) { // 100MB limit
            return reply(`Content-Length exceeds the limit: ${contentLength}`);
        }

        // Handle different content types
        if (/image\/.*/.test(contentType)) {
            // Send image message
            await zk.sendMessage(from, {
                image: { url: fetchUrl },
                caption: "Fetched Image"
            }, { quoted: mek });
        } else if (/video\/.*/.test(contentType)) {
            // Send video message
            await zk.sendMessage(from, {
                video: { url: fetchUrl },
                caption: "Fetched Video"
            }, { quoted: mek });
        } else if (/text|json/.test(contentType)) {
            // Try parsing the content as JSON
            try {
                const json = JSON.parse(response.data);
                console.log("Parsed JSON:", json);
                reply(JSON.stringify(json, null, 2).slice(0, 10000)); // Limit response size to 10000 characters
            } catch {
                // If parsing fails, send the raw text response
                reply(response.data.slice(0, 10000)); // Limit response size to 10000 characters
            }
        } else {
            // Send other types of documents
            await zk.sendMessage(from, {
                document: { url: fetchUrl },
                caption: "Fetched Document"
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("Error fetching data:", error.message);
        reply(`Error fetching data: ${error.message}`);
    }
});
