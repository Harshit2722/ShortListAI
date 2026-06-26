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

    const updatedUser = await UserRepository.updateRefreshToken(user._id,refreshToken);

    return {
        user:updatedUser,
        accessToken:accessToken,
        refreshToken:refreshToken
    }
}

const logout = async (id)=>{

    const updatedUser = await UserRepository.updateUser(id,{refreshToken: null})

    if(!updatedUser){
        throw new ApiError(404,"User not found");
    }

    return;
}

const generateTokens = function(user){
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return {
        accessToken:accessToken,
        refreshToken:refreshToken
    }
}

const refreshAccessToken = async (refreshToken)=>{

    if(!refreshToken){
        throw new ApiError(401,"Refresh token not found")
    }

    const decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET)

    const user = await UserRepository.findUserByIdWithRefreshToken(decoded.id);

    if(!user){
        throw new ApiError(401,"User not found")
    }
    
    if(user.refreshToken !== refreshToken){
        throw new ApiError(401,"Invalid refresh token")
    }

    const {accessToken,refreshToken: newRefreshToken} = generateTokens(user);
    
    await UserRepository.updateRefreshToken(user._id,newRefreshToken);
    
    const safeUser = await UserRepository.findUserById(user._id);

    return {
        user:safeUser,
        accessToken:accessToken,
        refreshToken:newRefreshToken
    }
    
    
}

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken
}