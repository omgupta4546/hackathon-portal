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
        await Team.deleteMany();
        await Round.deleteMany();
        const Instruction = require('../models/Instruction');
        await Instruction.deleteMany();

        await Instruction.create({
            content: `General Information: Robotics Club Internal Hackathon 2025

Welcome to the official Robotics Club Internal Hackathon, where innovation meets execution. This event is designed to challenge participants to ideate, design, and build impactful hardware or software solutions within a competitive yet collaborative environment.

Team Formation

Team Size: 1 to 4 members

Eligibility: Open to students from all branches and academic years

Interdisciplinary teams are encouraged

Participation Process
1. Registration

Participants must register on the platform and either:

Create a new team, or

Join an existing one

2. Problem Statement Selection

Navigate to the “Problems” section to explore available hardware and software challenges. Teams must select one problem statement for participation.

3. Project Submission

All project submissions must be uploaded through the “Submit” page before the stated deadline.
Submissions should strictly follow the specified format.

Submission Requirements

Presentation / Demo Video:
Upload your presentation or demonstration video to Google Drive and share a public access link.

Ensure the video clearly explains:

Problem understanding

Approach & design

Prototype / code walk-through

Final outcome

Code of Conduct

All submissions must be original.

Plagiarism, code copying, or use of pre-built solutions will lead to immediate disqualification.

Proper documentation and fair participation are mandatory.

Support & Contact

For queries, technical issues, or clarification regarding the event, participants may reach out to the student coordinators:

Prateek Singhal – 8440079089

Gargi Goyal – 8619628819

Yash Nagar – 9602230907`
        });

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
            {
                roundId: 'round1',
                name: 'Phase 1: Problem Selection',
                description: 'Select your problem statement and form your team.',
                startAt: new Date(),
                endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            },
            {
                roundId: 'round2',
                name: 'Phase 2: Idea Submission',
                description: 'Submit your idea and prototype details.',
                startAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // Starts after Round 1
                endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            },
            {
                roundId: 'round3',
                name: 'Phase 3: Presentation',
                description: 'Offline presentation of your prototype.',
                isOffline: true
            },
            {
                roundId: 'round4',
                name: 'Phase 4: Grand Finale',
                description: 'Final showdown.',
                isOffline: true
            }
        ]);
        console.log('Rounds seeded');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
