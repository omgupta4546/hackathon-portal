const Submission = require('../models/Submission');
const Team = require('../models/Team');

const submitWork = async (req, res) => {
    const { roundId, description, githubLink } = req.body;
    const userId = req.user._id;

    const team = await Team.findOne({ 'members.userId': userId });
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (team.leaderUserId.toString() !== userId.toString()) {
        return res.status(401).json({ message: 'Only team leader can submit' });
    }

    const files = req.files.map(file => ({
        url: file.path, // Cloudinary returns the full URL in path
        filename: file.originalname
    }));

    const submission = await Submission.create({
        teamId: team._id,
        roundId,
        description,
        githubLink,
        files
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
