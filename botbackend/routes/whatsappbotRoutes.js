const express = require('express');
const router = express.Router();
require('dotenv').config();

const crypto = require('crypto');
const Lead = require('../models/lead');

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
// router.post('/', async (req, res) => {
//   const entry = req.body.entry?.[0];
//   const changes = entry?.changes?.[0];
//   const messages = changes?.value?.messages;

//   if (messages && messages.length > 0) {
//     const msg = messages[0];
//     const from = msg.from; // WhatsApp phone number
//     const text = msg.text?.body;

//     console.log(`Received message from ${from}: ${text}`);

//     if (text?.toLowerCase() === 'hi') {
//       await sendReply(from, 'Hi there! 👋 This is Treat Caterers. How can we help you?');
//     }
//     if (text?.toLowerCase() === 'thanks') {
//       await sendReply(from, 'You\'re welcome! If you have any more questions, feel free to ask.');
//     }
//   }

//   res.sendStatus(200);
// });




router.post('/', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages;

  if (messages && messages.length > 0) {
    const msg = messages[0];
    const from = msg.from;
    const text = msg.text?.body?.toLowerCase();

    console.log(`Received message from ${from}: ${text}`);

    if (text === 'hi') {
      await sendReply(from, 'Hi there! 👋 This is Treat Caterers. Please send your event details:\n\nName:\nContact Number:\nEvent Type:\nEvent Date:\nEvent Time:\nNumber of Guests:\nLocation:');
    }

    if (text?.includes('name:') && text?.includes('contact number:')) {
      const lines = msg.text.body.split('\n').map(l => l.trim());
      const data = {};
      lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          data[key.trim().toLowerCase()] = value.trim();
        }
      });

      const chrono = require('chrono-node');
      const Fuse = require('fuse.js');
      const eventTypes = ['Birthday', 'Wedding/Marriage', 'Engagement', 'Corporate Event', 'Others'];
      const fuse = new Fuse(eventTypes, { threshold: 0.4 });

      let matchedEventType = 'Others';
      const match = fuse.search(data['event type']);
      if (match.length > 0) {
        matchedEventType = match[0].item;
      }

      const dateTimeString = `${data['event date']} ${data['event time']}`;
      const eventDateTimeIST = chrono.parseDate(dateTimeString);
      const eventDateUTC = new Date(eventDateTimeIST.getTime() - 5.5 * 60 * 60 * 1000);

      const sessionToken = crypto.randomBytes(16).toString('hex');

      const newLead = new Lead({
        phone: from,
        name: data['name'],
        contactNumber: Number(data['contact number']),
        eventType: matchedEventType,
        eventDate: eventDateUTC,
        numberOfGuests: Number(data['number of guests']),
        location: data['location'],
        sessionToken
      });

      await newLead.save();

      const link = `${process.env.CLIENT_URL}/quote-editor/${sessionToken}`;
      await sendReply(from, `✅ Thanks! Your event has been saved.\n\nPlease select your menu here:\n${link}`);
    }
  }

  res.sendStatus(200);
});


module.exports = router;
