const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendBotMessage(body) {
    return client.conversations.v1
        .conversations(process.env.CONVERSATION_SID)
        .messages.create({ author: 'system', body });
}

module.exports = { sendBotMessage };


