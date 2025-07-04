const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], required: true },

  selectedDishes: [
    {
      category: String,
      dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
    }
  ],

  additionalRequests: [String],

  lastEditedBy: { type: String, enum: ['lead', 'chef'], required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);
