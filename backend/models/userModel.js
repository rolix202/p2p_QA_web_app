import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
    communityID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6, 
        select: false
    },
    points: {
        type: Number,
        default: 0
    },
    badges: [
        {
            type: String,
            enum: ["Icebreaker", "Problem Solver", "Top Helper"], 
            default: "First Poster"
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }

})

UserSchema.pre("save", async function(next){
    try {
        if(!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password, 12)

        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.comparePassword =  async function(incomingPass, passInDB){
    return await bcrypt.compare(incomingPass, passInDB)
}

const User = mongoose.model("User", UserSchema)

export default User