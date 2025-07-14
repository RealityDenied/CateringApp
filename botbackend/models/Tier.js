const mongoose = require('mongoose');

const categoryConfigSchema = new mongoose.Schema({
  category: { type: String, required: true },
  maxSelectable: { type: Number }, // null for flexible category
  dishIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
}, { _id: false });

const tierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pricePerPlate: { type: Number, default: 0 }, // 🆕 per plate cost
  categories: [categoryConfigSchema]
});

module.exports = mongoose.model('Tier', tierSchema);
