class ApiResponse{
    constructor(statusCode,data,message){
        this.success = true
        this.statusCode = statusCode
        this.data = data
        this.message = message
    }
}

module.exports = ApiResponse