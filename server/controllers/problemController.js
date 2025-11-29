const Problem = require('../models/Problem');
const Team = require('../models/Team');

const getProblems = async (req, res) => {
    const problems = await Problem.find({});
    res.json(problems);
};

const createProblem = async (req, res) => {
    const { title, category, description, difficulty, maxTeamSize } = req.body;
    const problem = new Problem({ title, category, description, difficulty, maxTeamSize });
    const createdProblem = await problem.save();
    res.status(201).json(createdProblem);
};

const updateProblem = async (req, res) => {
    const { id } = req.params;
    const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedProblem);
};

const deleteProblem = async (req, res) => {
    const { id } = req.params;
    await Problem.findByIdAndDelete(id);
    res.json({ message: 'Problem deleted' });
};

const selectProblem = async (req, res) => {
    const { problemId } = req.body;
    const userId = req.user._id;

    const team = await Team.findOne({ 'members.userId': userId });
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    }

    if (team.leaderUserId.toString() !== userId.toString()) {
        return res.status(401).json({ message: 'Only team leader can select problem' });
    }

    if (team.problemId) {
        return res.status(400).json({ message: 'Problem already selected' });
    }

    team.problemId = problemId;
    await team.save();
    res.json(team);
};

module.exports = { getProblems, createProblem, updateProblem, deleteProblem, selectProblem };
