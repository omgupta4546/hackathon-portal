const Team = require('../models/Team');
const User = require('../models/User');
const crypto = require('crypto');

const createTeam = async (req, res) => {
    const { name, maxMembers } = req.body;
    const userId = req.user._id;

    const existingTeam = await Team.findOne({ 'members.userId': userId });
    if (existingTeam) {
        return res.status(400).json({ message: 'You are already in a team' });
    }

    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const team = await Team.create({
        name,
        leaderUserId: userId,
        members: [{ userId, name: req.user.name, email: req.user.email }],
        inviteCode,
        maxMembers: maxMembers || 4,
    });

    res.status(201).json(team);
};

const joinTeam = async (req, res) => {
    const { inviteCode } = req.body;
    const userId = req.user._id;

    const existingTeam = await Team.findOne({ 'members.userId': userId });
    if (existingTeam) {
        return res.status(400).json({ message: 'You are already in a team' });
    }

    const team = await Team.findOne({ inviteCode });
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (team.members.length >= team.maxMembers) {
        return res.status(400).json({ message: 'Team is full' });
    }

    team.members.push({ userId, name: req.user.name, email: req.user.email });
    await team.save();

    res.json(team);
};

const getMyTeam = async (req, res) => {
    const team = await Team.findOne({ 'members.userId': req.user._id }).populate('problemId');
    if (!team) {
        return res.status(404).json({ message: 'No team found' });
    }
    res.json(team);
};

const leaveTeam = async (req, res) => {
    const userId = req.user._id;
    const team = await Team.findOne({ 'members.userId': userId });

    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (team.leaderUserId.toString() === userId.toString()) {
        // If leader leaves, destroy team or assign new leader? For simplicity, destroy team if only one member, else assign new leader
        if (team.members.length === 1) {
            await Team.findByIdAndDelete(team._id);
            return res.json({ message: 'Team deleted' });
        } else {
            // Assign next member as leader
            const newLeader = team.members.find(m => m.userId.toString() !== userId.toString());
            team.leaderUserId = newLeader.userId;
        }
    }

    team.members = team.members.filter(m => m.userId.toString() !== userId.toString());
    await team.save();
    res.json({ message: 'Left team' });
};

module.exports = { createTeam, joinTeam, getMyTeam, leaveTeam };
