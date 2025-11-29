const Round = require('../models/Round');
const Score = require('../models/Score');

const getRounds = async (req, res) => {
    const rounds = await Round.find({});
    res.json(rounds);
};

const createRound = async (req, res) => {
    const { roundId, name, description, startAt, endAt, isOffline, scheduleInfo } = req.body;
    const round = await Round.create({ roundId, name, description, startAt, endAt, isOffline, scheduleInfo });
    res.status(201).json(round);
};

const updateRound = async (req, res) => {
    const { id } = req.params;
    const round = await Round.findOneAndUpdate({ roundId: id }, req.body, { new: true });
    res.json(round);
};

const uploadScores = async (req, res) => {
    const { scores } = req.body; // Array of { teamId, score, remarks }
    const { id: roundId } = req.params;

    const savedScores = [];
    for (const s of scores) {
        const score = await Score.create({
            teamId: s.teamId,
            roundId,
            score: s.score,
            remarks: s.remarks,
            judge: req.user.name
        });
        savedScores.push(score);
    }
    res.json(savedScores);
};

module.exports = { getRounds, createRound, updateRound, uploadScores };
