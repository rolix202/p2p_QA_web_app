class CustomError extends Error {
    constructor(message, status, isOperational = true){
        super(message)
        this.status = status || 500
        this.isOperational = isOperational
        Error.captureStackTrace(this, this.constructor)
    }
}

export default CustomError