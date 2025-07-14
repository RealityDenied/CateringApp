const mongoose = require('mongoose');

const selectedCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  dishIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
}, { _id: false });

const selectedAddOnSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
  unit: { type: String, enum: ['per guest', 'per stall'], required: true }
}, { _id: false });

const quoteSchema = new mongoose.Schema({
  tierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tier', required: true },
  selectedDishes: [selectedCategorySchema],
  selectedAddOns: [selectedAddOnSchema], // 🆕
  updatedBy: { type: String, enum: ['chef', 'lead'], required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuoteNew', quoteSchema);
