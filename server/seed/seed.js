const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Team = require('../models/Team');
const Round = require('../models/Round');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
    try {
        // Wait for database connection to be established
        await connectDB();

        await User.deleteMany();
        await Problem.deleteMany();
        await Team.deleteMany();
        await Round.deleteMany();

        // Create Users
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@hack.local',
            passwordHash: 'AdminPass123',
            role: 'admin'
        });

        const user1 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            passwordHash: 'password123',
            role: 'participant'
        });

        const user2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            passwordHash: 'password123',
            role: 'participant'
        });

        console.log('Users seeded');

        // Create Problems
        const problems = [
            { "title": "Autonomous Line-Following Drone (Hardware)", "category": "Hardware", "description": "Design a lightweight autonomous drone that follows a pre-defined colored line on the ground and avoids obstacles.", "maxTeamSize": 4 },
            { "title": "Smart Waste Segregation Bin (Hardware)", "category": "Hardware", "description": "Build a bin that automatically segregates dry and wet waste using sensors and simple actuators.", "maxTeamSize": 4 },
            { "title": "Real-Time Object Detection for Edge Devices (Software)", "category": "Software", "description": "TinyML based object detection model that can run on low-power edge devices for safety applications.", "maxTeamSize": 4 },
            { "title": "Campus Navigation App for Differently Abled (Software)", "category": "Software", "description": "Mobile/web app that helps differently-abled students navigate campus with accessible routes and audio cues.", "maxTeamSize": 4 },
            { "title": "IoT Smart Farming System (Hardware)", "category": "Hardware", "description": "Monitor soil moisture, temperature, and humidity to automate irrigation.", "maxTeamSize": 4 },
            { "title": "Gesture Controlled Robot (Hardware)", "category": "Hardware", "description": "Robot controlled by hand gestures using accelerometer sensors.", "maxTeamSize": 4 },
            { "title": "Smart Energy Meter (Hardware)", "category": "Hardware", "description": "IoT based energy meter that sends usage data to cloud.", "maxTeamSize": 4 },
            { "title": "Automated Attendance System (Software)", "category": "Software", "description": "Face recognition based attendance system for classrooms.", "maxTeamSize": 4 },
            { "title": "Blockchain Voting System (Software)", "category": "Software", "description": "Secure and transparent voting system using blockchain technology.", "maxTeamSize": 4 },
            { "title": "Health Monitoring Wearable (Hardware)", "category": "Hardware", "description": "Wearable device to monitor heart rate and temperature.", "maxTeamSize": 4 },
            { "title": "Disaster Management App (Software)", "category": "Software", "description": "App to coordinate relief efforts during natural disasters.", "maxTeamSize": 4 },
            { "title": "Smart Traffic Light Control (Hardware)", "category": "Hardware", "description": "Traffic lights that adjust timing based on traffic density.", "maxTeamSize": 4 },
            { "title": "Voice Assistant for Elderly (Software)", "category": "Software", "description": "Voice-activated assistant to help elderly with daily tasks.", "maxTeamSize": 4 },
            { "title": "Fake News Detection (Software)", "category": "Software", "description": "AI model to detect fake news articles.", "maxTeamSize": 4 },
            { "title": "Smart Parking System (Hardware)", "category": "Hardware", "description": "System to detect and display available parking spots.", "maxTeamSize": 4 },
            { "title": "E-Learning Platform (Software)", "category": "Software", "description": "Platform for online courses with video streaming and quizzes.", "maxTeamSize": 4 },
            { "title": "Home Automation System (Hardware)", "category": "Hardware", "description": "Control home appliances remotely via smartphone.", "maxTeamSize": 4 },
            { "title": "Sentiment Analysis Tool (Software)", "category": "Software", "description": "Analyze social media sentiment for brands.", "maxTeamSize": 4 },
            { "title": "Underwater Drone (Hardware)", "category": "Hardware", "description": "Drone for underwater exploration and inspection.", "maxTeamSize": 4 },
            { "title": "Personal Finance Tracker (Software)", "category": "Software", "description": "App to track expenses and manage budget.", "maxTeamSize": 4 }
        ];

        await Problem.insertMany(problems);
        console.log('Problems seeded');

        // Create Rounds
        await Round.create([
            { roundId: 'round1', name: 'Round 1: Idea Submission', description: 'Submit your idea and prototype details.', startAt: new Date(), endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
            { roundId: 'round2', name: 'Round 2: Presentation', description: 'Offline presentation of your prototype.', isOffline: true },
            { roundId: 'round3', name: 'Round 3: Grand Finale', description: 'Final showdown.', isOffline: true }
        ]);
        console.log('Rounds seeded');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
