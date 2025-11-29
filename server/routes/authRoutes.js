const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, authUser, googleCallback, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', authUser);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;
