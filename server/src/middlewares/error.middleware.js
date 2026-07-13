const {ZodError} = require("zod")

const errorMiddleware = (err,req,res,next)=>{

    const isProduction = process.env.NODE_ENV === "production";

    let statusCode = err.statusCode || 500;

    let message = statusCode===500 && isProduction ? "Internal Server Error" : err.message || "Something went wrong";
    
    let validationErrors = err.errors || [];


    if(err instanceof ZodError){
        validationErrors = err.issues.map(issue=> ({
            field: issue.path.join("."),
            message: issue.message
        }))

        statusCode = 400
        message = "Validation error"
    }

    else if(err.name === "ValidationError"){
        validationErrors = Object.values(err.errors).map(error=> ({
            field: error.path,
            message: error.message
        }))
        statusCode = 400
        message = "Validation error"
    }

    else if(err.code===11000){
        const field = Object.keys(err.keyValue)[0];
        statusCode=409;
        message=`${field} already exists`
    }

    else if(err.name === "CastError"){
        statusCode = 400
        message = "Invalid resource ID"
    }

    else if(err.name === "MulterError"){
        statusCode = 400
        message = err.code === "LIMIT_FILE_SIZE" ? "File size exceeds the 5MB limit" : err.message;
    }

    else if(err.name === "JsonWebTokenError"){
        statusCode = 401
        message = "Invalid token"
    }

    else if(err.name === "TokenExpiredError" ){
        statusCode=401
        message="Token has expired"
    }

    const response = {
    success: false,
    message,
    errors: validationErrors
    };

    if (!isProduction) {
        response.stack = err.stack;
    }

    return res.status(statusCode).json(response);

}

module.exports = errorMiddleware