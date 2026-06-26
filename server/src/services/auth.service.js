const UserRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");

const register = async ({name,email,password,company,designation,avatar})=>{

    const existingUser = await UserRepository.existsByEmail(email);
    if(existingUser){
        throw new ApiError(409,"User already exists");
    }

    const user = await UserRepository.createUser({name,email,password,company,designation,avatar});

    const {accessToken,refreshToken} = generateTokens(user);

    const finalUser = await UserRepository.findUserWithoutPassword(user._id);

    return {
        user:finalUser,
        accessToken:accessToken,
        refreshToken:refreshToken
    }

}

const login = async ({email,password})=>{
    const user = await UserRepository.findUserByEmailWithPassword(email);
    if(!user){
        throw new ApiError(401,"Invalid credentials");
    }
    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials");
    }

    const {accessToken,refreshToken} = generateTokens(user);

    const finalUser = await UserRepository.findUserWithoutPassword(user._id);

    return {
        user:finalUser,
        accessToken:accessToken,
        refreshToken:refreshToken
    }
}

const generateTokens = function(user){
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return {
        accessToken:accessToken,
        refreshToken:refreshToken
    }
}

module.exports = {
    register,
    login
}