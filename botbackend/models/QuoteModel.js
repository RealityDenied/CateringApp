const mongoose = require('mongoose');

const selectedCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  dishIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
}, { _id: false });

const quoteSchema = new mongoose.Schema({
  tierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tier', required: true },
  selectedDishes: [selectedCategorySchema],
  updatedBy: { type: String, enum: ['chef', 'lead'], required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuoteNew', quoteSchema);
