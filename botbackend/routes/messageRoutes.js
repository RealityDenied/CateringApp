const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Lead = require('../models/lead');
const { sendReply } = require('../utils/metaSend');

// GET /messages/lead/:leadId
router.get('/lead/:leadId', async (req, res) => {
  const messages = await Message.find({ leadId: req.params.leadId }).sort({ timestamp: 1 });
  res.json(messages);
});

// POST /messages/send
router.post('/send', async (req, res) => {
  const { leadId, text } = req.body;
  const lead = await Lead.findById(leadId);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  // 1. Send via WhatsApp
  await sendReply(lead.phone, text);

  // 2. Save in DB
  const message = await Message.create({
    leadId,
    sender: 'chef',
    text
  });

  res.status(201).json(message);
});

module.exports = router;
