// botbackend/models/lead.js
const mongoose = require('mongoose');
const crypto = require('crypto'); // Add this if you want to generate token server-side

const leadSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    name: String,
    contactNumber: Number,
    eventType: { type: String, enum: ['Birthday', 'Wedding/Marriage', 'Engagement', 'Corporate Event', 'Others'] },
    eventDate: Date,
    numberOfGuests: Number,
    location: String,
    quote: { type: mongoose.Schema.Types.ObjectId, ref: 'QuoteNew' },

    sessionToken: { type: String, unique: true }, // ✅ New field

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
