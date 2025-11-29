const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                return done(null, user);
            }

            // If not, create new user
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                passwordHash: '', // No password for Google users
                role: 'participant'
            });

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

module.exports = passport;
