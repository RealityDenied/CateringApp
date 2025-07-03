const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');

// Create a new menu
router.post('/', async (req, res) => {
  try {
    const menu = new Menu(req.body);
    const savedMenu = await menu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all menus with dish details
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find().populate('dishes');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a menu
router.delete('/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a dish to a menu
router.post('/:id/add-dish', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    menu.dishes.push(req.body.dishId);
    menu.updatedAt = Date.now();
    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a dish from a menu
router.post('/:id/remove-dish', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    menu.dishes = menu.dishes.filter(id => id.toString() !== req.body.dishId);
    menu.updatedAt = Date.now();
    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
