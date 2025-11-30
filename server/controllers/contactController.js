const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: 1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addContact = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const newContact = new Contact({ name, phone });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
