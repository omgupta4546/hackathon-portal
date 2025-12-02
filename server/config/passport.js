const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true // Required for Render/Heroku to correctly generate HTTPS callback URLs
},
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        console.log('Google Auth Callback received. Profile:', email);

        if (!email) {
            return done(null, false, { message: 'No email found in Google profile' });
        }

        try {
            // Check if user already exists
            let user = await User.findOne({ email });

            if (user) {
                return done(null, user);
            }

            // If not, return error
            return done(null, false, { message: 'User not registered. Please sign up first.' });

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

module.exports = passport;
