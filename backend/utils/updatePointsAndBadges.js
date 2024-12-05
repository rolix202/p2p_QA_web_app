import User from "../models/userModel.js"

export const updatePoints = async (userId, points) => {
    const user = await User.findById(userId)

    if (user){
        user.points += points
        await user.save()
    }
}

export const checkAndAssignBadge = async (userId, badgeName, condition) => {
    const user = await User.findById(userId);

    if (user && condition){
        if (!user.badges.includes(badgeName)){
            user.badges.push(badgeName)
            await user.save()
        }
    }
}