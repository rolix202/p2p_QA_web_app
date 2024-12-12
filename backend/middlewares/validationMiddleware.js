import { body, validationResult } from "express-validator";
import User from "../models/userModel.js";
import CustomError from "../utils/customError.js";

const withErrorMessage = (what_to_validate) => {
    return [
        ...what_to_validate,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessage = errors.array().map((err) => err.msg || err.message || "Validation error");
                return res.status(400).json({ error: errorMessage });
            }
            next();
        },
    ];
};

export const register_validation = withErrorMessage([
    body("communityID")
        .notEmpty()
        .withMessage("Community ID is required!")
        .matches(/^FE\/\d{2}\/\d{8}$/)
        .withMessage("CommunityID must follow the format FE/XX/YYYYYYYY")
        .trim()
        .custom(async (value) => {
            const userID = await User.findOne({ communityID: value })

            if (userID) {
                throw new CustomError("User with the community ID already exist!", 409)
            }
        }),
    body("email")
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Not a valid email address!")
        .trim()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("Email already exists!");
            }
        }),
    body("password")
        .notEmpty()
        .withMessage("Password is required!")
        .isLength({ min: 6 })
        .withMessage("Password should be atleast 6 characters long")
        .trim(),
    body("confirmPass")
        .notEmpty()
        .withMessage("Confirm password is required!")
        .isLength({ min: 6 })
        .withMessage("Password should be atleast 6 characters long")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match!");
            }
            return true;
        })
]);

export const login_validation = withErrorMessage([
    body("email")
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Not a valid email address!")
        .trim(),
    body("password")
        .notEmpty()
        .withMessage("Password is required!")
        .isLength({ min: 6 })
        .withMessage("Password should be atleast 6 characters long")
        .trim()
]);

export const question_validation = withErrorMessage([
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required."),
    body("description")
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ max: 1000 })
        .withMessage("Description must not exceed 1000 characters."),
    body("category")
        .notEmpty()
        .withMessage("Category is required.")
        .isIn([
            "AI / Machine Learning",
            "Animation",
            "Cloud Computing",
            "Cybersecurity",
            "UI/UX Design",
            "Data Analysis & Visualization",
            "Data Science",
            "DevOps",
            "Game Development",
            "Product Management",
            "Quality Assurance",
            "Software Development"
        ])
        .withMessage("Invalid category selected.")
])


