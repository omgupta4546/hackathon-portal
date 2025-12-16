const Team = require('../models/Team');
const User = require('../models/User');
const Round = require('../models/Round');
const crypto = require('crypto');

const createTeam = async (req, res) => {
    const { name, maxMembers } = req.body;

    // Check if Phase 1 has ended
    const round1 = await Round.findOne({ roundId: 'round1' });
    if (round1 && round1.endAt && new Date() > round1.endAt) {
        return res.status(400).json({ message: 'Phase 1 has ended. Team formation is closed.' });
    }

    const userId = req.user._id;

    const existingTeam = await Team.findOne({ 'members.userId': userId });
    if (existingTeam) {
        return res.status(400).json({ message: 'You are already in a team' });
    }

    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Generate Team ID
    let teamId = 'RB01';
    const lastTeam = await Team.findOne({ teamId: { $exists: true } }).sort({ teamId: -1 });
    if (lastTeam && lastTeam.teamId) {
        const lastIdNum = parseInt(lastTeam.teamId.replace('RB', ''));
        if (!isNaN(lastIdNum)) {
            teamId = `RB${(lastIdNum + 1).toString().padStart(2, '0')}`;
        }
    }

    const team = await Team.create({
        name,
        leaderUserId: userId,
        members: [{ userId, name: req.user.name, email: req.user.email }],
        inviteCode,
        teamId,
        maxMembers: maxMembers || 4,
    });

    res.status(201).json(team);
};

const joinTeam = async (req, res) => {
    const { inviteCode } = req.body;

    // Check if Phase 1 has ended
    const round1 = await Round.findOne({ roundId: 'round1' });
    if (round1 && round1.endAt && new Date() > round1.endAt) {
        return res.status(400).json({ message: 'Phase 1 has ended. Team joining is closed.' });
    }

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
    if (!team.teamId) {
        const lastTeam = await Team.findOne({ teamId: { $exists: true } }).sort({ teamId: -1 });
        let newId = 'RB01';
        if (lastTeam && lastTeam.teamId) {
            const lastIdNum = parseInt(lastTeam.teamId.replace('RB', ''));
            if (!isNaN(lastIdNum)) {
                newId = `RB${(lastIdNum + 1).toString().padStart(2, '0')}`;
            }
        }
        team.teamId = newId;
        try {
            await team.save();
        } catch (error) {
            console.error("Error auto-assigning teamId:", error);
        }
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
