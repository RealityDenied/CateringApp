const express = require('express');
const router = express.Router();
const Quote = require('../models/QuoteModel');

// Create a new quote
router.post('/', async (req, res) => {
  const { tierId, selectedDishes, selectedAddOns = [], updatedBy } = req.body;
  const quote = new Quote({ tierId, selectedDishes, selectedAddOns, updatedBy });
  await quote.save();
  res.status(201).json(quote);
});

// Update a quote
router.put('/:id', async (req, res) => {
  const { selectedDishes, selectedAddOns = [], updatedBy } = req.body;
  const quote = await Quote.findByIdAndUpdate(
    req.params.id,
    {
      selectedDishes,
      selectedAddOns,
      updatedBy,
      updatedAt: new Date()
    },
    { new: true }
  );
  res.json(quote);
});

// Get a quote with full tier + dishes
router.get('/:id', async (req, res) => {
  const quote = await Quote.findById(req.params.id)
    .populate('tierId')
    .populate('selectedDishes.dishIds')
    .populate('selectedAddOns.dishId');
  res.json(quote);
});

// PATCH: Add a new add-on dish to the quote
router.patch('/:id/add-addon', async (req, res) => {
  const { dishId, unit } = req.body;

  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });

    quote.selectedAddOns = quote.selectedAddOns || [];
    quote.selectedAddOns.push({ dishId, unit });
    await quote.save();

    res.json(quote);
  } catch (error) {
    console.error('Error adding add-on to quote:', error);
    res.status(500).json({ error: 'Failed to add add-on' });
  }
});




module.exports = router;
