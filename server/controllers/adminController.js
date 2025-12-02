const Team = require('../models/Team');
const Submission = require('../models/Submission');

const User = require('../models/User');
const { sendMail } = require('../utils/mail');

const getAllTeams = async (req, res) => {
    const teams = await Team.find({}).populate('problemId');
    res.json(teams);
};

const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const team = await Team.findById(id);
        if (team) {
            // Send email notification to leader
            const leader = await User.findById(team.leaderUserId);
            if (leader && leader.email) {
                await sendMail({
                    to: leader.email,
                    subject: `Team Removal Notification`,
                    html: `
                        <h3>Hello ${leader.name},</h3>
                        <p>Your team <strong>${team.name}</strong> has been removed from the hackathon by the administrator.</p>
                        <p>If you believe this is a mistake, please contact the support team.</p>
                        <br/>
                        <p>Best Regards,<br/>Hackathon Admin Team</p>
                    `,
                });
            }
        }

        await Team.findByIdAndDelete(id);
        // Also delete submissions
        await Submission.deleteMany({ teamId: id });
        res.json({ message: 'Team removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting team' });
    }
};

const updateSubmissionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await Submission.findById(id).populate('teamId');
    if (submission) {
        submission.status = status;
        await submission.save();

        // Send email notification
        if (submission.teamId && submission.teamId.leaderUserId) {
            const leader = await User.findById(submission.teamId.leaderUserId);
            if (leader && leader.email) {
                await sendMail({
                    to: leader.email,
                    subject: `Update on your Hackathon Submission`,
                    html: `
                        <h3>Hello ${leader.name},</h3>
                        <p>Your team <strong>${submission.teamId.name}</strong> has been marked as <strong>${status}</strong> for <strong>${submission.roundId}</strong>.</p>
                        <p>Check your dashboard for more details.</p>
                        <br/>
                        <p>Best Regards,<br/>Hackathon Admin Team</p>
                    `,
                });
            }
        }

        res.json(submission);
    } else {
        res.status(404).json({ message: 'Submission not found' });
    }
};

const setWinner = async (req, res) => {
    const { teamId, rank } = req.body;

    // If rank is 0, remove winner status
    const team = await Team.findById(teamId);
    if (team) {
        team.winningRank = rank;
        await team.save();
        res.json(team);
    } else {
        res.status(404).json({ message: 'Team not found' });
    }
};

const getWinners = async (req, res) => {
    const winners = await Team.find({ winningRank: { $gt: 0 } })
        .sort({ winningRank: 1 })
        .populate('problemId');
    res.json(winners);
};

const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send email notification
        if (user.email) {
            await sendMail({
                to: user.email,
                subject: 'Account Deletion Notification',
                html: `
                    <h3>Hello ${user.name},</h3>
                    <p>Your account has been deleted by the administrator.</p>
                    <p>If you believe this is a mistake, please contact support.</p>
                    <br/>
                    <p>Best Regards,<br/>Hackathon Admin Team</p>
                `,
            });
        }

        await User.findByIdAndDelete(id);
        // Optional: Remove from teams if they are a member
        // This is complex as it involves updating Team documents. 
        // For now, we just delete the user.
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = { getAllTeams, deleteTeam, updateSubmissionStatus, setWinner, getWinners, getAllUsers, deleteUser };
