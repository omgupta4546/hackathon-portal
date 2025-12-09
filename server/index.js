const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars first
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const passport = require('./config/passport');
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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to connect to DB:', error);
        process.exit(1);
    }
};

startServer();
