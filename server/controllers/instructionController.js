const Instruction = require('../models/Instruction');

const getInstructions = async (req, res) => {
    try {
        let instruction = await Instruction.findOne();
        if (!instruction) {
            instruction = await Instruction.create({ content: "Welcome to the Hackathon! Please read the rules carefully." });
        }
        res.json(instruction);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching instructions' });
    }
};

const updateInstructions = async (req, res) => {
    const { content } = req.body;
    try {
        let instruction = await Instruction.findOne();
        if (!instruction) {
            instruction = await Instruction.create({ content });
        } else {
            instruction.content = content;
            await instruction.save();
        }
        res.json(instruction);
    } catch (error) {
        res.status(500).json({ message: 'Error updating instructions' });
    }
};

module.exports = { getInstructions, updateInstructions };
