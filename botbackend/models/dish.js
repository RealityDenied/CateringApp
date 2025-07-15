const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //category: { type: String, required: true },
  category: { type: String, default: '' },

  price: { type: Number, default: 0 }, // relevant only for flexible categories
  unit: { type: String, enum: ['per guest', 'per stall'], default: 'per guest' } // relevant only for flexible categories
});

module.exports = mongoose.model('Dish', dishSchema);
