const { keith } = require('../keizzah/command');
const { default: axios } = require('axios');

keith({
    pattern: 'gitclone',
    alias: ['zip', 'botclone'],
    react: '📑',
    desc: 'Fetch content from a GitHub repository link.',
    category: 'developer',
    filename: __filename
}, async (zk, mek, m, { from, quoted, body, isKeith, command, args, text, arg, reply }) => {
  
  // Get the GitHub link from the arguments
  const githubLink = args.join(' ');

  // Check if a GitHub link was provided
  if (!githubLink) {
    return reply('Please provide a valid GitHub repository link.');
  }

  // Validate if the link is a GitHub link
  if (!githubLink.includes('github.com')) {
    return reply('This doesn\'t seem to be a GitHub repository link.');
  }

  // Extract owner and repo from the GitHub URL using a regex pattern
  const match = githubLink.match(/(?:https:\/\/|git(?:hub\.com\/))([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    return reply('Could not extract owner and repo from the provided link. Ensure the URL is correctly formatted.');
  }

  const [, owner, repo] = match;

  // GitHub API URL for the zipball of the repo
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;

  try {
    // Make a HEAD request to fetch the file metadata
    const response = await axios.head(apiUrl);

    // Extract the file name from the Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    const fileName = contentDisposition ? contentDisposition.match(/filename="(.+)"/)[1] : `${repo}.zip`;

    // Send the zip file link as a document
    await zk.sendMessage(from, {
      document: { url: apiUrl },
      fileName: fileName,
      mimetype: 'application/zip'
    }, { quoted: mek });

  } catch (error) {
    // Handle errors (e.g., if the repository cannot be fetched)
    console.error(error);
    reply('Error fetching the GitHub repository. Please make sure the URL is correct and the repository is accessible.');
  }
});
