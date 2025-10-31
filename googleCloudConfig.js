import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import User from "./Models/user.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, 

async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // if user exists with same email but no googleId then update it
            user = await User.findOne({ email });
            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
                user = await User.create({
                    googleId: profile.id,
                    email,
                    username: profile.displayName,
                    photo: profile.photos[0].value
                });
            }
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));