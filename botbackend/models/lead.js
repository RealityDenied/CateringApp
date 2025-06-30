const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    name: String,
    contactNumber: Number,
    eventType: { type: String, enum: ['Birthday', 'Wedding/Marriage', 'Engagement', 'Corporate Event', 'Others'] },
    eventDate: Date, // parsed full datetime with chrono
    numberOfGuests: Number,
    location: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
