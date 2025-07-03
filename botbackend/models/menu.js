const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({

  name: String,
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
  createdBy: { type: String, enum: ['admin', 'user'], default: 'admin' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', menuSchema);
