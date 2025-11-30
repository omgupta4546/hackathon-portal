const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        default: "Welcome to the Hackathon! Please read the rules carefully."
    }
}, { timestamps: true });

module.exports = mongoose.model('Instruction', instructionSchema);
