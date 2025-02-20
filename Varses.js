const { default: makeWASocket, DisconnectReason } = require('@whiskeysockets/baileys');
const { getBuffer, getRandom, sleep } = require('./keizzah/functions');
const config = require('./config');
const { sms, downloadMediaMessage } = require('./keizzah/msg');
const axios = require('axios');
const { tmpdir } = require('os');

async function handleCall(zk, callData) {
  if (config.ANTICALL === 'true') {
    const { id: callId, from: callerId } = callData[0];

    // Reject the call
    await zk.rejectCall(callId, callerId);

    // Track the last time a text message was sent to avoid spam
    const currentTime = Date.now();
    if (currentTime - lastTextTime >= messageDelay) {
      await zk.sendMessage(callerId, {
        text: '```❗📵I AM KEITH MD | I REJECT THIS CALL BECAUSE MY OWNER IS BUSY. KINDLY SEND TEXT INSTEAD```.',
      });
      lastTextTime = currentTime;
    } else {
      console.log('Message skipped to prevent overflow');
    }
  }
}

// Initialize delay variables
let lastTextTime = 0;
const messageDelay = 5000; // Minimum delay between messages in milliseconds

// Listen for incoming calls and handle them
zk.ev.on('call', async (callData) => {
  await handleCall(zk, callData);
});
