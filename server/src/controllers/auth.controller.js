const ApiResponse = require("../utils/ApiResponse");
const AuthService = require("../services/auth.service");
const { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS, BASE_COOKIE_OPTIONS } = require("../constants/cookie.constants");

const register = async (req,res)=>{

    const {message,email} = await AuthService.register(req.body);

    res.status(201).json(new ApiResponse(201, {email},message))
}

const verifyEmail = async (req,res)=>{

    const {message} = await AuthService.verifyEmail(req.body);

    res.status(200).json(new ApiResponse(200,null,message))
}

const resendOTP = async (req,res)=>{

    const {message,email} = await AuthService.resendOTP(req.body);

    res.status(200).json(new ApiResponse(200,{email},message))
}

const forgotPassword = async (req,res)=>{

    const {message,email} = await AuthService.forgotPassword(req.body);

    res.status(200).json(new ApiResponse(200,{email},message))
}

const resetPassword = async (req,res)=>{

    const {message} = await AuthService.resetPassword(req.body);

    res.status(200).json(new ApiResponse(200,null,message))
}

const login = async (req,res)=>{

    const {user,accessToken,refreshToken} = await AuthService.login(req.body);

    res.cookie("accessToken",accessToken,ACCESS_COOKIE_OPTIONS)
    res.cookie("refreshToken",refreshToken,REFRESH_COOKIE_OPTIONS)

    res.status(200).json(new ApiResponse(200,user,"User logged in successfully"))
}

const logout = async (req,res)=>{

    await AuthService.logout(req.user._id);

    res.clearCookie("refreshToken",BASE_COOKIE_OPTIONS);
    res.clearCookie("accessToken",BASE_COOKIE_OPTIONS);

    return res.status(200).json(new ApiResponse(200,null,"User logged out successfully"));
}

const refreshAccessToken = async (req,res)=>{
    
    const refreshToken = req.cookies?.refreshToken;

    const {user,accessToken,refreshToken: newRefreshToken} = await AuthService.refreshAccessToken(refreshToken);

    res.cookie("accessToken",accessToken,ACCESS_COOKIE_OPTIONS)
    res.cookie("refreshToken",newRefreshToken,REFRESH_COOKIE_OPTIONS)

    return res.status(200).json(new ApiResponse(200,user,"User refreshed access token successfully"));
}

module.exports = {
    register,
    verifyEmail,
    resendOTP,
    forgotPassword,
    resetPassword,
    login,
    logout,
    refreshAccessToken
}   