import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    answerBody: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    votes: {
        upvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }],
        downvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
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

const Answer = mongoose.model('Answer', AnswerSchema);

export default Answer;
