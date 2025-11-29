const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    roundId: { type: String, required: true },
    judge: { type: String }, // Judge name or ID
    score: { type: Number, required: true },
    remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);
