import mongoose from "mongoose";

export const dbConnect = async () => {
    const db = process.env.NODE_ENV === "development" ? process.env.DB_LOCAL : process.env.DB_PROD

    try {
        const conn = await mongoose.connect(db)

        if (conn) console.log("Database connected successfully");
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}
