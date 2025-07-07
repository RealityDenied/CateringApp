// botbackend/models/Tier.js
const mongoose = require('mongoose');

const categoryConfigSchema = new mongoose.Schema({
  category: { type: String, required: true },
  maxSelectable: { type: Number, required: true },
  dishIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
}, { _id: false });

const tierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  categories: [categoryConfigSchema]
});

module.exports = mongoose.model('Tier', tierSchema);
