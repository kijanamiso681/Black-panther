const axios = require("axios");
const { keith, commands } = require("../keizzah/command");
const { sinhalaSub } = require("mrnima-moviedl");

keith({
  pattern: "movie",
  alias: ["sinhalasub"],
  react: '📑',
  category: "download",
  desc: "Search movies on sinhalasub and get download links",
  filename: __filename
}, async (zk, message, context, { from, text, reply }) => {
  try {
    if (!text) {
      return await reply("*Please provide a search query! (e.g., Deadpool)*");
    }

    const sinhalaSubInstance = await sinhalaSub();
    const searchResults = await sinhalaSubInstance.search(text);
    const movies = searchResults.result.slice(0, 10);

    if (!movies || movies.length === 0) {
      return await reply("No results found for: " + text);
    }

    let responseText = `🔢 *Please reply with the number you want to select*\n\n📽️ *Search Results for* "${text}":\n\n`;
    movies.forEach((movie, index) => {
      responseText += `${index + 1}. ${movie.title}\n🔗 Link: ${movie.link}\n\n`;
    });

    const sentMessage = await zk.sendMessage(from, {
      text: responseText,
      contextInfo: {
        mentionedJid: ["254748387615@s.whatsapp.net"],
        externalAdReply: {
          title: "Alpha Md",
          body: "Keithkeizzah",
          mediaType: 1,
          sourceUrl: 'https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47',
          thumbnailUrl: 'config.ALIVE_IMG',
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }
    }, {
      quoted: context
    });

    const messageId = sentMessage.key.id;

    zk.ev.on("messages.upsert", async (event) => {
      const incomingMessage = event.messages[0];
      if (!incomingMessage.message) return;

      const selectedNumber = incomingMessage.message.conversation || incomingMessage.message.extendedTextMessage?.text;
      const isReplyToSelection = incomingMessage.message.extendedTextMessage && incomingMessage.message.extendedTextMessage.contextInfo.stanzaId === messageId;

      if (isReplyToSelection) {
        const selectionIndex = parseInt(selectedNumber.trim()) - 1;

        if (selectionIndex >= 0 && selectionIndex < movies.length) {
          const selectedMovie = movies[selectionIndex];
          const movieLink = `https://api-site-2.vercel.app/api/sinhalasub/movie?url=${encodeURIComponent(selectedMovie.link)}`;

          try {
            const movieDetailsResponse = await axios.get(movieLink);
            const movieData = movieDetailsResponse.data.result;
            const downloadLinks = movieData.dl_links || [];

            if (downloadLinks.length === 0) {
              return await reply("No download links found.");
            }

            let downloadResponse = `🔢 *Please reply with the number you want to select*\n\n🎥 *${movieData.title}*\n\n*Available Download Links:*\n`;

            downloadLinks.forEach((link, index) => {
              downloadResponse += `${index + 1}. ${link.quality} - ${link.size}\n🔗 Link: ${link.link}\n\n`;
            });

            const downloadMessage = await zk.sendMessage(from, {
              text: downloadResponse,
              contextInfo: {
                mentionedJid: ["254748387615@s.whatsapp.net"],
                externalAdReply: {
                  title: "ALPHA MD",
                  body: "Keithkeizzah",
                  mediaType: 1,
                  sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                  thumbnailUrl: "config.ALIVE_IMG",
                  renderLargerThumbnail: false,
                  showAdAttribution: true
                }
              }
            }, {
              quoted: incomingMessage
            });

            const downloadMessageId = downloadMessage.key.id;

            zk.ev.on("messages.upsert", async (responseEvent) => {
              const responseMessage = responseEvent.messages[0];
              if (!responseMessage.message) return;

              const selectedDownloadNumber = responseMessage.message.conversation || responseMessage.message.extendedTextMessage?.text;
              const isDownloadReply = responseMessage.message.extendedTextMessage && responseMessage.message.extendedTextMessage.contextInfo.stanzaId === downloadMessageId;

              if (isDownloadReply) {
                const downloadIndex = parseInt(selectedDownloadNumber.trim()) - 1;

                if (downloadIndex >= 0 && downloadIndex < downloadLinks.length) {
                  const selectedDownloadLink = downloadLinks[downloadIndex].link;
                  const fileId = selectedDownloadLink.split('/').pop();

                  await zk.sendMessage(from, {
                    react: { text: '⬇️', key: downloadMessage.key }
                  });

                  await zk.sendMessage(from, {
                    text: "*Downloading your movie... 📥*\n*Wait a few minutes...*\n\n> *Regards Keith*",
                    contextInfo: {
                      mentionedJid: ['254748387615@s.whatsapp.net'],
                      externalAdReply: {
                        title: "ALPHA MD",
                        body: "Keithkeizzah",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                        thumbnailUrl: "config.ALIVE_IMG",
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                      }
                    }
                  }, {
                    quoted: context
                  });

                  const downloadUrl = `https://pixeldrain.com/api/file/${fileId}`;
                  await zk.sendMessage(from, {
                    document: { url: downloadUrl },
                    mimetype: 'video/mp4',
                    fileName: `${movieData.title} - ${downloadLinks[downloadIndex].quality}.mp4`,
                    caption: `${movieData.title}\nQuality: ${downloadLinks[downloadIndex].quality}\n*Regards Keith*`,
                    contextInfo: {
                      mentionedJid: ['254748387615@s.whatsapp.net'],
                      externalAdReply: {
                        title: "ALPHA MD",
                        body: "Keithkeizzah",
                        mediaType: 1,
                        sourceUrl: "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
                        thumbnailUrl: "config.ALIVE_IMG",
                        renderLargerThumbnail: false,
                        showAdAttribution: true
                      }
                    }
                  }, {
                    quoted: context
                  });

                  await zk.sendMessage(from, {
                    react: { text: '✅', key: context.key }
                  });
                } else {
                  await reply("Invalid selection. Please reply with a valid number.");
                }
              }
            });
          } catch (error) {
            console.error("Error fetching movie details:", error);
            await reply("An error occurred while fetching movie details. Please try again.");
          }
        } else {
          await reply("Invalid selection. Please reply with a valid number.");
        }
      }
    });
  } catch (error) {
    console.error("Error during search:", error);
    reply("*An error occurred while searching!*");
  }
});
