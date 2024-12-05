import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
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


    let cookieExtractor = function(req){
        let token = null;
        if (req && req.cookies){
            token = req.cookies.p_token
        }

        return token;
    }

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
    }

    passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await User.findById(payload.id);

            if (user){
                return done(null, user)
            } else {
                return done(null, false, { message: "User not found!" })
            }
            
        } catch (error) {
            return done(error, false, { message: "Authentication error!" })
        }
    }))

    
}