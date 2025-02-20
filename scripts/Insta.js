const { keith } = require('../keizzah/command');
const { igdl } = require("ruhend-scraper");

keith({
  pattern: "instagram",
  alias: ["igdl", "insta", "ig"],
  react: "✅",
  desc: "Download Instagram videos.",
  category: "download",
  filename: __filename
}, async (zk, mek, m, { quoted, reply, arg, text, q, args, from }) => {

  // Ensure the user provides a query
  if (!text) {
    return reply('Please provide a query!');
  }

  // Check if the provided link is a valid Instagram URL
  if (!text.includes('https://www.instagram.com/')) {
    return reply("That is not a valid Instagram link.");
  }

  try {
    // Fetch the download data for the Instagram video
    let downloadData = await igdl(text);

    // Ensure that valid data is returned
    if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
      return reply("No video found at the provided Instagram link.");
    }

    let videoData = downloadData.data;

    // Loop through the video data and send the first 20 videos (if available)
    for (let i = 0; i < Math.min(20, videoData.length); i++) {
      let video = videoData[i];

      // Ensure the video object and URL are defined
      if (!video || !video.url) {
        continue; // Skip this entry if video data is incomplete
      }

      let videoUrl = video.url;

      // Send the video to the chat
      await zk.sendMessage(from, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: "*Instagram Video Downloaded by Alpha Md*"
      });
    }
  } catch (error) {
    // Log any errors and notify the user
    console.error(error);
    return reply("An error occurred while processing the request. Please try again later.");
  }
});
