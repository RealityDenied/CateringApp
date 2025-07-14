const express = require('express');
const router = express.Router();
const Lead = require('../models/lead');

// GET /api/leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate({
        path: 'quote',
        populate: [
          { path: 'tierId' },
          { path: 'selectedDishes.dishIds' },
          { path: 'selectedAddOns.dishId' } // ✅ FIXED
        ]
      })
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// PATCH /api/leads/:id/attach-quote
router.patch('/:id/attach-quote', async (req, res) => {
  const { quoteId } = req.body;

  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { quote: quoteId },
      { new: true }
    );

    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    console.error('Error attaching quote to lead:', error);
    res.status(500).json({ error: 'Failed to attach quote' });
  }
});

// GET /api/leads/by-token/:token
router.get('/by-token/:token', async (req, res) => {
  try {
    const lead = await Lead.findOne({ sessionToken: req.params.token })
      .populate({
        path: 'quote',
        populate: [
          { path: 'tierId' },
          { path: 'selectedDishes.dishIds' },
          { path: 'selectedAddOns.dishId' } // ✅ FIXED
        ]
      });

    if (!lead) return res.status(404).json({ error: 'Invalid token' });
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead by token:', error);
    res.status(500).json({ error: 'Failed to fetch lead by token' });
  }
});

module.exports = router;
