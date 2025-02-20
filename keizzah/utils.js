// Keith's code bro 😥

// Converts phone numbers to WhatsApp IDs
export const numtoId = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== 'string') return '';
  return `${phoneNumber.replace(/\D/g, '')}@s.whatsapp.net`;
};

// Function to decode JIDs (optional, but useful for any decoding needs)
export const decodeJid = (jid) => {
  if (!jid) return jid;
  if (/:\d+@/gi.test(jid)) {
    const decoded = jidDecode(jid) || {};
    return decoded.user && decoded.server ? `${decoded.user}@${decoded.server}` : jid;
  }
  return jid;
};

