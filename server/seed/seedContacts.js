const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Contact = require('../models/Contact');
const connectDB = require('../config/db');

dotenv.config();

const seedContacts = async () => {
    try {
        await connectDB();

        const contacts = [
            {
                name: "Prateek Singhal",
                phone: "8440079089"
            },
            {
                name: "Gargi Goyal",
                phone: "8619628819"
            }
        ];

        await Contact.deleteMany({}); // Clear existing contacts
        await Contact.insertMany(contacts);

        console.log('Contacts Seeded!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedContacts();
