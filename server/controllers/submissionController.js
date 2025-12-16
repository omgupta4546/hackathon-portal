const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Round = require('../models/Round');

const submitWork = async (req, res) => {
    const { roundId, description, githubLink, driveLink } = req.body;
    const userId = req.user._id;

    // Check Phase 1 status
    const round1 = await Round.findOne({ roundId: 'round1' });
    const now = new Date();

    const team = await Team.findOne({ 'members.userId': userId });
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    // Check if team is disqualified (didn't select problem OR has < 2 members in Phase 1)
    if (round1 && now > new Date(round1.endAt)) {
        if (!team.problemId) {
            return res.status(403).json({ message: 'Round 2 is locked. You did not select a problem statement in Phase 1.' });
        }
        if (team.members.length < 2) {
            return res.status(403).json({ message: 'Round 2 is locked. Minimum 2 team members required.' });
        }
    }

    if (team.leaderUserId.toString() !== userId.toString()) {
        return res.status(401).json({ message: 'Only team leader can submit' });
    }

    const submission = await Submission.create({
        teamId: team._id,
        roundId,
        description,
        githubLink,
        driveLink,
        files: []
    });

    res.status(201).json(submission);
};

const getSubmissions = async (req, res) => {
    // Admin gets all, user gets theirs
    if (req.user.role === 'admin') {
        const submissions = await Submission.find({}).populate('teamId');
        res.json(submissions);
    } else {
        const team = await Team.findOne({ 'members.userId': req.user._id });
        if (!team) return res.json([]);
        const submissions = await Submission.find({ teamId: team._id });
        res.json(submissions);
    }
};

module.exports = { submitWork, getSubmissions };
