import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy } from "passport-jwt";
import User from "../models/userModel.js";

export const loginStrategy = () => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email }).select("+password");
                if (!user) {
                    return done(null, false, { message: "Incorrect email or password!" });
                }

                const isPasswordValid = await user.comparePassword(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, { message: "Incorrect email or password!" });
                }
    
                user.password = undefined;
    
                return done(null, user);
            } catch (error) {
                console.error("Error in LocalStrategy:", error);
                return done(new Error("An unexpected error occurred. Please try again."));
            }
        })
    );
    
}