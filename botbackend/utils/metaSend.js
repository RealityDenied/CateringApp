const axios = require('axios');

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WABA_PHONE_NUMBER_ID;

async function sendReply(to, message) {
    console.log('PHONE ID:', process.env.WABA_PHONE_NUMBER_ID);

  try {
    const res = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Sent message:', res.data);
  } catch (error) {
    console.error('Error sending reply:', error.response?.data || error.message);
  }
}

module.exports = { sendReply };
