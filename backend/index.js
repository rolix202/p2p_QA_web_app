import express, { json } from "express";
const app = express()
import * as dotenv from "dotenv"
import morgan from "morgan";
import winston from "winston";
import { dbConnect } from "./config/dbConfig.js";
dotenv.config()

import authRoute from "./router/authRoute.js"
import { loginStrategy } from "./config/passportAuth.js";
import passport from "passport";

app.use(express.json())
app.use(morgan("dev"))

dbConnect()

loginStrategy()
app.use(passport.initialize())

app.get("/", (req, res) => {
    res.send("Service running successfully!")
})
app.use("/api/v1/auth", authRoute)

app.get("/error", (req, res, next) => {
    const error = new CustomError("This is a test error!", 400);
    next(error);
});


app.use((req, res, next) => {
    res.status(404).json({message: "Route not found"})
})

// Logger Setup
const logger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
})

app.use((err, req, res, next) => {
    const isDev = process.env.NODE_ENV === "development"
    const statusCode = err.status ||  500;

    if (err.isOperational){
        logger.error({
        method: req.method,
        url: req.url,
        status: statusCode,
        message: err.message,
        clientIp: req.ip,
        body: req.body,
    });
    } else {
         // For programming errors (non-operational), log the full stack
         logger.error({
            method: req.method,
            url: req.url,
            status: statusCode,
            message: err.message,
            stack: err.stack,
            clientIp: req.ip,
            body: req.body,
        });
    }
    

    res.status(statusCode).json({
        message: err.isOperational ? 
        err.message : "Internal Server Error",
        ...(isDev && { stack: err.stack })
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server connected on PORT ${PORT}`))