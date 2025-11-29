const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    roundId: { type: String, required: true, unique: true }, // e.g., 'round1'
    name: { type: String, required: true },
    description: String,
    startAt: Date,
    endAt: Date,
    isOffline: { type: Boolean, default: false },
    scheduleInfo: String
});

module.exports = mongoose.model('Round', roundSchema);
