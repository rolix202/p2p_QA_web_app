import mongoose, { mongo } from "mongoose";

const AnswerSchema = new mongoose.Schema({
    answerText: {
        type: String,
        required: true
    },
    videoLink: {
        type: String, 
        trim: true
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
        upvotes: {
            type: Number,
            default: 0
        },
        downvotes: {
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Answer = mongoose.model('Answer', AnswerSchema)

export default Answer