const { keith } = require("../keizzah/command");
const Heroku = require('heroku-client');
const s = require("../config");

// Command to get all Heroku variables
keith({
  pattern: 'allvar',
  react: '⚔️',
  desc: 'Get shell scripts',
  category: 'system',
  filename: __filename
}, async (zk, mek, m, { quoted, reply, arg, text, q, args, from, isOwner, isMe, pushname }) => {

  // Check if the command is issued by the owner
  if (!isOwner) {
    return reply("*This command is restricted to the bot owner or Alpha owner 💀*");
  }

  const appname = s.HEROKU_APP_NAME;
  const herokuapi = s.HEROKU_API_KEY;

  const heroku = new Heroku({
    token: herokuapi,
  });

  const baseURI = `/apps/${appname}/config-vars`;

  try {
    // Fetch config vars from Heroku API
    const configVars = await heroku.get(baseURI);

    let str = '*╭───༺All my Heroku vars༻────╮*\n\n';

    // Loop through the returned config vars and format them
    for (let key in configVars) {
      if (configVars.hasOwnProperty(key)) {
        str += `★ *${key}* = ${configVars[key]}\n`;
      }
    }

    // Send the formatted response back to the user
    reply(str);

  } catch (error) {
    console.error('Error fetching Heroku config vars:', error);
    reply('Sorry, there was an error fetching the config vars.');
  }
});

// Command to set or change Heroku variables
keith({
  pattern: 'setvar',
  react: '⚔️',
  desc: 'Set or change your Heroku variables',
  category: 'system',
  filename: __filename
}, async (zk, mek, m, { quoted, reply, arg, text, q, args, from, isOwner, isMe, pushname }) => {

  // Check if the command is issued by the owner
  if (!isOwner) {
    return reply("*This command is restricted to the bot owner or Alpha owner 💀*");
  }

  const appname = s.HEROKU_APP_NAME;
  const herokuapi = s.HEROKU_API_KEY;

  // Validate argument format: key=value
  if (!text || text.length < 1 || !text.includes('=')) {
    return reply('Incorrect Usage:\nProvide the key and value correctly.\nExample: setvar ANTICALL=yes');
  }

  const [key, value] = text.split('=');

  if (!key || !value) {
    return reply("Invalid format. Example: setvar ANTICALL=yes");
  }

  const heroku = new Heroku({
    token: herokuapi,
  });

  const baseURI = `/apps/${appname}/config-vars`;

  try {
    // Set the new config var
    await heroku.patch(baseURI, {
      body: {
        [key]: value,
      },
    });

    // Notify success
    await reply(`*✅ The variable ${key} = ${value} has been set successfully. The bot is restarting...*`);

  } catch (error) {
    console.error('Error setting config variable:', error);
    await reply(`❌ There was an error setting the variable. Please try again later.\n${error.message}`);
  }
});
