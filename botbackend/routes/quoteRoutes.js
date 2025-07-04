const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');

// GET quote by lead ID
router.get('/:leadId', async (req, res) => {
  try {
    const quote = await Quote.findOne({ leadId: req.params.leadId }).populate({
      path: 'selectedDishes.dishes',
      model: 'Dish'
    });

    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    res.json(quote);
  } catch (err) {
    console.error('Error fetching quote:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
