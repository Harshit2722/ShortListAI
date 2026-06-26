class ApiError extends Error{
    constructor(statusCode,message,errors=[]){
        super(message)
        this.success = false
        this.statusCode = statusCode
        this.errors = errors

        Error.captureStackTrace(this,this.constructor)
    }
}   

module.exports = ApiError
