const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Create a new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  try {
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: 'Category may already exist' });
  }
});

// Delete a category by name
router.delete('/:name', async (req, res) => {
  await Category.deleteOne({ name: req.params.name });
  res.json({ message: 'Category deleted' });
});

module.exports = router;
