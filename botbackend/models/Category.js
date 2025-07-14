const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isFlexible: { type: Boolean, default: false } // for flexible categories
});

module.exports = mongoose.model('Category', categorySchema);
