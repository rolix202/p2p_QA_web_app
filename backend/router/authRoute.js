import { Router } from "express";
import { register } from "../controllers/authController.js";
import { login_validation, register_validation } from "../middlewares/validationMiddleware.js";
import passport from "passport";

const router = Router()

router.post("/register", register_validation, register)
router.post("/login", login_validation, async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);

        console.log(info.message);
        
        

    })(req, res, next)
})


export default router