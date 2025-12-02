const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, authUser, googleCallback, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', authUser);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(err.message)}`);
        }
        if (!user) {
            const message = info && info.message ? info.message : 'Authentication failed';
            return res.redirect(`${process.env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`);
        }
        req.user = user;
        next();
    })(req, res, next);
}, googleCallback);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;
