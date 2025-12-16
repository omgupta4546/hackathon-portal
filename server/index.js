const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars first
// Global Error Handlers
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const startMemoryMonitor = require('./utils/memoryMonitor');

// Start memory monitoring
startMemoryMonitor();
console.log('Environment Variables Loaded. SMTP_HOST:', process.env.SMTP_HOST);
// connectDB(); // Called in startServer

const app = express();
app.enable('trust proxy'); // Required for Render/Heroku to correctly detect HTTPS

// Handle CORS - remove trailing slash if present
const clientUrl = (process.env.CLIENT_URL || '*').replace(/\/$/, '');
app.use(cors({
    origin: clientUrl,
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/rounds', require('./routes/roundRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/instructions', require('./routes/instructionRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/debug-email', require('./routes/debugRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
    try {
        await connectDB();
        server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to connect to DB:', error);
        process.exit(1);
    }
};

startServer();

const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Closing application...`);

    if (server) {
        console.log('Closing HTTP server...');
        server.close(async () => {
            console.log('HTTP server closed.');
            try {
                console.log('Closing MongoDB connection...');
                await mongoose.connection.close(false);
                console.log('MongoDB connection closed.');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });
    } else {
        console.log('Server not running, exiting...');
        process.exit(0);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
