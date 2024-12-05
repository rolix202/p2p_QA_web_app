import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["AI / Machine Learning", "Animation", "Cloud Computing", "Cybersecurity", "UI/UX Design", "Data Analysis & Visualization", "Data Science", "DevOps", "Game Development", "Product Management", "Quality Assurance", "Software Development"],
        default: "General"
    },
    photo_upload: [{
        image_public_url: {
            type: String,
            trim: true
        },
        image_secure_url: {
            type: String,
            trim: true
        }
    }],
  
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
