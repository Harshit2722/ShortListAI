const ApiResponse = require("../utils/ApiResponse");
const AuthService = require("../services/auth.service");
const { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS, BASE_COOKIE_OPTIONS } = require("../constants/cookie.constants");

const register = async (req,res)=>{

    const {user,accessToken,refreshToken} = await AuthService.register(req.body);

    res.cookie("accessToken",accessToken,ACCESS_COOKIE_OPTIONS)
    res.cookie("refreshToken",refreshToken,REFRESH_COOKIE_OPTIONS)

    res.status(201).json(new ApiResponse(201, user,"User registered successfully"))
}

const login = async (req,res)=>{

    const {user,accessToken,refreshToken} = await AuthService.login(req.body);

    res.cookie("accessToken",accessToken,ACCESS_COOKIE_OPTIONS)
    res.cookie("refreshToken",refreshToken,REFRESH_COOKIE_OPTIONS)

    res.status(200).json(new ApiResponse(200,user,"User logged in successfully"))
}

const getCurrentUser = async (req,res)=>{

    return res.status(200).json(new ApiResponse(200,req.user,"User Info sent successfully"))
}

const logout = async (req,res)=>{

    await AuthService.logout(req.user._id);

    res.clearCookie("refreshToken",BASE_COOKIE_OPTIONS);
    res.clearCookie("accessToken",BASE_COOKIE_OPTIONS);

    return res.status(200).json(new ApiResponse(200,null,"User logged out successfully"));
}

module.exports = {
    register,
    login,
    getCurrentUser,
    logout
}   