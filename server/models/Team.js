const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    leaderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        email: String
    }],
    inviteCode: { type: String, unique: true },
    logoUrl: { type: String },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    maxMembers: { type: Number, default: 4 },
    status: { type: String, default: 'active' },
    winningRank: { type: Number, default: 0 } // 0 = No rank, 1 = 1st, 2 = 2nd, 3 = 3rd
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
