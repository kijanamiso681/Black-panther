const { keith } = require('../keizzah/command');
const fs = require("fs");
const { exec } = require("child_process");

const filename = `${Math.random().toString(36).substring(2)}`;

keith({
  pattern: "blown",
  react: "✅",
  desc: "to change audio vocals.",
  category: "audio-edit",
  filename: __filename
}, async (zk, mek, m, { quoted, reply, from }) => {

  // Ensure there is a quoted message
  if (!quoted) {
    return reply('Please mention an audio');
  }

  // Check if the quoted message contains audio
  if (!quoted.audioMessage) {
    return reply('The command only works with audio messages');
  }

  try {
    // Download and save the quoted audio message
    const media = await zk.downloadAndSaveMediaMessage(quoted.audioMessage);
    const outputFilename = `${filename}.mp3`;

    // Apply the filter to change vocals using ffmpeg
    const ffmpegCommand = `ffmpeg -i ${media} -af acrusher=.1:1:64:0:log ${outputFilename}`;
    
    exec(ffmpegCommand, (err, stderr, stdout) => {
      // Delete the original media file after processing
      fs.unlinkSync(media);

      // If an error occurs, notify the user
      if (err) {
        return reply(`Error during the procedure: ${err}`);
      }

      // Read the output file into a buffer
      const outputBuffer = fs.readFileSync(outputFilename);

      // Send the processed audio back
      zk.sendMessage(from, { audio: outputBuffer, mimetype: "audio/mpeg" }, { quoted: mek });

      // Clean up by deleting the output file
      fs.unlinkSync(outputFilename);
    });
    
  } catch (e) {
    // Catch any unexpected errors and reply to the user
    reply('Error during the process');
  }
});
