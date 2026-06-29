const ApiError = require("../utils/ApiError")

const authorize = (...roles)=> (req,res,next) => {

    if(!req.user){
        throw new ApiError(401,"Unauthorized")
    }

    const isAllowed = roles.includes(req.user.role)

    if(!isAllowed){
        throw new ApiError(403,"You are not allowed to access this endpoint")
    }

    next()
}

module.exports = authorize