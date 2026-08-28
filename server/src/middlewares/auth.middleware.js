const UserRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req,res,next)=>{

    const token = req.cookies?.accessToken;
 
    if(!token){
        throw new ApiError(401,"Access Token Missing")
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user = await UserRepository.findUserById(decoded.id);

    if(!user){
        throw new ApiError(401,"User no longer exists")
    }

    req.user = user;

    return next();
    
}

module.exports = verifyJWT