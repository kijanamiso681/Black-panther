const fetch = require("node-fetch");
const { keith } = require('../keizzah/command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

keith({
  on: "text"
}, async (zk, mek, m, { from, text, isGroup, isAdmins, fromMe, isBaileys, isBotAdmins, reply, sender }) => {
  try {
    // Check if chatbot feature is enabled in config
    if (config.CHAT_BOT !== 'true') {
      console.log("Chatbot feature is disabled.");
      return;  // Skip processing if chatbot is not enabled
    }

    // Skip messages from the bot itself or system messages
    if (isBaileys || fromMe) {
      console.log("Message from bot or system message, skipping.");
      return;
    }

    // Skip irrelevant message types
    const irrelevantTypes = ["protocolMessage", "pollUpdateMessage", "reactionMessage", "stickerMessage"];
    if (irrelevantTypes.includes(m.mtype)) {
      console.log("Irrelevant message type, skipping.");
      return;
    }

    // Skip if there's no text content in the message
    if (!m.text) {
      console.log("No text in the message.");
      return;
    }

    // Define the owner's number (for owner-specific responses)
    const ownerNumber = config.OWNER_NUMBER;

    // Only process if the message is from the owner or chatbot is enabled
    if (sender === ownerNumber || config.CHAT_BOT === 'true') {
      console.log("Processing message:", m.text);

      // Function to send the message to the GPT-3 API
      const getGPT3Response = async (userMessage) => {
        try {
          // System prompt setup (to guide the AI)
          const systemPrompt = {
            role: "system",
            content: "This is Alpha Md with a lot of features. Respond with heart emojis in every reply."
          };

          // User's message
          const userPrompt = {
            role: "user",
            content: userMessage
          };

          const conversation = [systemPrompt, userPrompt];

          // API call to get GPT-3's response
          const response = await fetch("https://api.yanzbotz.live/api/ai/gpt3", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: conversation })
          });

          // Check if the API request was successful
          if (!response.ok) {
            throw new Error("API request failed with status " + response.status);
          }

          const gpt3Response = await response.json();
          console.log("GPT-3 response:", gpt3Response);
          return gpt3Response.result;

        } catch (error) {
          console.error("Error during GPT-3 API request:", error.message);
          return "I'm sorry, I couldn't process your request at this time.";
        }
      };

      // Get GPT-3 response and send it as a reply
      const gpt3Response = await getGPT3Response(m.text);
      if (gpt3Response) {
        await reply(gpt3Response);
        console.log("Replied with:", gpt3Response);
      } else {
        await reply("Sorry, no suitable response from the API.");
        console.log("No suitable response from the API.");
      }

    } else {
      console.log("Chatbot is not enabled for this chat, skipping.");
    }

  } catch (error) {
    console.error("Error processing message:", error.message);
    await reply("An error occurred while processing your message.");
  }

  return true;
});
