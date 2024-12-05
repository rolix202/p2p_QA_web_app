import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import CustomError from "../utils/customError.js"

export const register = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body)

    if (!user){
        throw new CustomError("Failed to create user. Please try again.", 500)
    }

    res.status(201).json({
        message: "User created successfully"
    })
})