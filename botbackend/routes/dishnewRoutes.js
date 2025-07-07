const express = require('express');
const router = express.Router();
const Tier = require('../models/Tier');
const Dish = require('../models/dish');


// 🔐 Optional middleware
// const { verifyChef } = require('../middleware/auth');
// router.use(verifyChef);

// Get all tiers
router.get('/', async (req, res) => {
  const tiers = await Tier.find().populate('categories.dishIds');
  res.json(tiers);
});

router.get('/categories', async (req, res) => {
  const categories = await Dish.distinct('category');
  res.json(categories);
});

// Create a new tier
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const tier = new Tier({ name, description, categories: [] });
  await tier.save();
  res.status(201).json(tier);
});

// Add or update a categoryConfig in a tier
router.put('/:id/categories', async (req, res) => {
  const { category, maxSelectable, dishIds } = req.body;
  const tier = await Tier.findById(req.params.id);

  const index = tier.categories.findIndex(c => c.category === category);
  if (index !== -1) {
    // Update
    tier.categories[index] = { category, maxSelectable, dishIds };
  } else {
    // Add new
    tier.categories.push({ category, maxSelectable, dishIds });
  }

  await tier.save();
  res.json(tier);
});

// Delete a tier
router.delete('/:id', async (req, res) => {
  await Tier.findByIdAndDelete(req.params.id);
  res.json({ message: 'Tier deleted' });
});

// Remove a category block from a tier
router.put('/:id/categories/remove', async (req, res) => {
  const { category } = req.body;
  const tier = await Tier.findById(req.params.id);

  tier.categories = tier.categories.filter(c => c.category !== category);
  await tier.save();
  res.json(tier);
});

// Edit maxSelectable for a category in a tier
router.put('/:id/categories/edit', async (req, res) => {
  const { category, maxSelectable } = req.body;
  const tier = await Tier.findById(req.params.id);

  const config = tier.categories.find(c => c.category === category);
  if (config) config.maxSelectable = maxSelectable;

  await tier.save();
  res.json(tier);
});

module.exports = router;
