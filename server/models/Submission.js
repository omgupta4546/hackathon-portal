const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    roundId: { type: String, required: true }, // 'round1', 'round2', 'round3'
    files: [{
        url: String,
        filename: String
    }],
    driveLink: { type: String },
    githubLink: { type: String },
    description: { type: String },
    status: { type: String, enum: ['submitted', 'shortlisted', 'rejected'], default: 'submitted' },
    score: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
