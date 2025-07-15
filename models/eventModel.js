const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    name: { type: String, required: true },

});

module.exports = mongoose.model('Event', eventSchema);