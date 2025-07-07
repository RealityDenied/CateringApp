const express = require('express');
const router = express.Router();
const Quote = require('../models/QuoteModel');

// Create a new quote
router.post('/', async (req, res) => {
  const { tierId, selectedDishes, updatedBy } = req.body;
  const quote = new Quote({ tierId, selectedDishes, updatedBy });
  await quote.save();
  res.status(201).json(quote);
});

// Update a quote
router.put('/:id', async (req, res) => {
  const { selectedDishes, updatedBy } = req.body;
  const quote = await Quote.findByIdAndUpdate(
    req.params.id,
    {
      selectedDishes,
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
    .populate('selectedDishes.dishIds');
  res.json(quote);
});

module.exports = router;
