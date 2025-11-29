const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Hardware', 'Software'], required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    maxTeamSize: { type: Number, default: 4 }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
