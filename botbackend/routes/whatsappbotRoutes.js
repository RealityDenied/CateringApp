const express = require('express');
const router = express.Router();
require('dotenv').config();

const { sendReply } = require('../utils/metaSend'); // your util function to send messages

// GET: Webhook verification
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ POST: Incoming messages from Meta
router.post('/', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages;

  if (messages && messages.length > 0) {
    const msg = messages[0];
    const from = msg.from; // WhatsApp phone number
    const text = msg.text?.body;

    console.log(`Received message from ${from}: ${text}`);

    if (text?.toLowerCase() === 'hi') {
      await sendReply(from, 'Hi there! 👋 This is Treat Caterers. How can we help you?');
    }
    if (text?.toLowerCase() === 'thanks') {
      await sendReply(from, 'You\'re welcome! If you have any more questions, feel free to ask.');
    }
  }

  res.sendStatus(200);
});

module.exports = router;
