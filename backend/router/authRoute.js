import { Router } from "express";
import { register } from "../controllers/authController.js";
import { login_validation, register_validation } from "../middlewares/validationMiddleware.js";
import passport from "passport";
import CustomError from "../utils/customError.js";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middlewares/authenticateMiddleware.js";
import User from "../models/userModel.js";

const router = Router()

router.post("/register", register_validation, register)
router.post("/login", login_validation, async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);

        if (!user){
            return next(new CustomError(info.message || "Authenticatin failed", 400))
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' })

        res.cookie('p_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000 // 15 minutes
        })

        req.user = user

        return res.status(200).json({
            message: "Login successful!"
        })

    })(req, res, next)
})
router.get("/current-user", isAuthenticated, async (req, res) => {
   
    const { user } = req
        
        if (!user){
            throw new CustomError("Access Denied!", 403)
        }

        res.status(200).json({
            message: "success",
            data: user
        })

    
})


export default router