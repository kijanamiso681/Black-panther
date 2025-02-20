
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./keizzah/functions');
const fs = require('fs');
const P = require('pino');
const { DateTime } = require('luxon');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const StickersTypes = require('wa-sticker-formatter');
const { sms, downloadMediaMessage } = require('./keizzah/msg');
const axios = require('axios');
const { File } = require('megajs');
const { fromBuffer } = require('file-type');
const bodyparser = require('body-parser');
const { tmpdir } = require('os');
const Crypto = require('crypto');
const path = require('path');
const prefix = config.PREFIX;
const ownerNumber = ['254748387615']; // Owner numbers

// Import commands from keizzah/command
const { keith, commands } = require('./keizzah/command');

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');

  const sessdata = config.SESSION_ID;
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);

  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
      console.log("SESSION DOWNLOADED COMPLETED ✅");
    });
  });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ===================== Dynamically Fetch Total Commands =====================
const totalCommands = commands.length;  // Corrected: Get the length of the commands array dynamically

//==================== Fetch Mode ====================
const mode = config.MODE; // Fetch the mode value from config

//=============================================

async function connectToWA() {
  console.log("CONNECTING ALPHA MD..");

  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/');
  const { version } = await fetchLatestBaileysVersion();

  const zk = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  // Connection Update Listener
  zk.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close' && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
      connectToWA();
    } else if (connection === 'open') {
      console.log('HUNCHO IS CONNECTING✅ ');

      // Load scripts dynamically
      fs.readdirSync("./scripts/").forEach((script) => {
        if (path.extname(script).toLowerCase() == ".js") {
          require("./scripts/" + script);
        }
      });

      console.log('PLUGINS FILES INSTALLED SUCCESSFULLY ✅');
      console.log('ALPHA MD IS CONNECTED ENJOY ✅');

      const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;

      // Greeting Message
      const getGreeting = () => {
        if (currentHour >= 5 && currentHour < 12) return 'Good morning 🌄';
        if (currentHour >= 12 && currentHour < 18) return 'Good afternoon ☀️';
        if (currentHour >= 18 && currentHour < 22) return 'Good evening 🌆';
        return 'Good night 😴';
      };

      const getCurrentTimeInNairobi = () => DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);

      let up = `Hey, ${getGreeting()}
╭════⊷
║ *『𝐀𝐋𝐏𝐇𝐀-𝐌𝐃 𝐢𝐬 𝐎𝐧𝐥𝐢𝐧𝐞』*
║    Creator: *keithkeizzah*
║    Prefix : [ ${prefix} ]
║    Mode : ${mode}
╰═════════════════⊷
╭───◇
┃
┃ *Thank you for choosing*                      
┃  *ALPHA-MD*
> Regards keithkeizzah 
╰═════════════════⊷`;

      zk.sendMessage(zk.user.id, { text: up });
    }
  });

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Track the last text time to prevent overflow
  let lastTextTime = 0;
  const messageDelay = 5000; // Set the minimum delay between messages (in milliseconds)

  zk.ev.on('call', async (callData) => {
    if (config.ANTICALL === 'true') {
      const callId = callData[0].id;
      const callerId = callData[0].from;
    
      // Reject the call
      await zk.rejectCall(callId, callerId);

      // Check if enough time has passed since the last message
      const currentTime = Date.now();
      if (currentTime - lastTextTime >= messageDelay) {
        // Send the rejection message if the delay has passed
        await zk.sendMessage(callerId, {
          text: '```❗📵I AM ALPHA MD | I REJECT THIS CALL BECAUSE MY OWNER IS BUSY. KINDLY SEND TEXT INSTEAD```.',
        });

        // Update the last text time
        lastTextTime = currentTime;
      } else {
        console.log('Message skipped to prevent overflow');
      }
    }
  });

  zk.ev.on('creds.update', saveCreds);

  // Handle Incoming Messages
  zk.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    mek.message = getContentType(mek.message) === 'ephemeralMessage' ? mek.message.ephemeralMessage.message : mek.message;

    const m = sms(zk, mek);
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const quoted = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
    const body = type === 'conversation' ? mek.message.conversation : type === 'extendedTextMessage' ? mek.message.extendedTextMessage.text : (type === 'imageMessage' && mek.message.imageMessage.caption) || (type === 'videoMessage' && mek.message.videoMessage.caption) || '';
    
    const isKeith = body.startsWith(prefix);
    const command = isKeith ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(" ");
    
    const isGroup = from.endsWith('@g.us');
    const sender = mek.key.fromMe ? zk.user.id.split(':')[0] + '@s.whatsapp.net' || zk.user.id : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    const botNumber = zk.user.id.split(':')[0];
    const pushname = mek.pushName || 'Keithkeizzah';
    const isMe = botNumber.includes(senderNumber);
    const isOwner = ownerNumber.includes(senderNumber) || isMe;

    const botNumber2 = await jidNormalizedUser(zk.user.id);
    const groupMetadata = isGroup ? await zk.groupMetadata(from).catch(e => {}) : '';
    const groupName = isGroup ? groupMetadata.subject : '';
    const participants = isGroup ? await groupMetadata.participants : '';
    const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
    const isReact = m.message.reactionMessage ? true : false;
    
    const reply = (teks) => {
      zk.sendMessage(from, { text: teks }, { quoted: mek });
    };

    // Command Handling
    if (isKeith) {
      const commandHandler = commands.find((cmd) => cmd.pattern === command) || commands.find((cmd) => cmd.alias && cmd.alias.includes(command));
      if (commandHandler) {
        if (commandHandler.react) zk.sendMessage(from, { react: { text: commandHandler.react, key: mek.key } });

        try {
          commandHandler.function(zk, mek, m, {
            from, quoted, body, isKeith, command, args, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
          });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }

    commands.forEach(async (command) => {
      if (body && command.on === "body") {
        command.function(zk, mek, m, {
          from, quoted, body, isKeith, command, args, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
        });
      } else if (mek.text && command.on === "text") {
        command.function(zk, mek, m, {
          from, quoted, body, isKeith, command, args, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
        });
      } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
        command.function(zk, mek, m, {
          from, quoted, body, isKeith, command, args, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
        });
      } else if (command.on === "sticker" && mek.type === "stickerMessage") {
        command.function(zk, mek, m, {
          from, quoted, body, isKeith, command, args, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
        });
      }
    });
  });
}

//========================= Web Server ====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'keizzah', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

setTimeout(() => {
  connectToWA();
}, 4000);
