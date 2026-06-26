const ApiResponse = require("../utils/ApiResponse");
const AuthService = require("../services/auth.service")

const register = async (req,res)=>{

    const {user,accessToken,refreshToken} = await AuthService.register(req.body);

    res.cookie("accessToken",accessToken,{httpOnly:true,secure:true,maxAge:60*60*1000})
    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,maxAge:60*60*24*7*1000})

    res.status(201).json(new ApiResponse(201, user,"User registered successfully"))
}

const login = async (req,res)=>{

    const {user,accessToken,refreshToken} = await AuthService.login(req.body);

    res.cookie("accessToken",accessToken,{httpOnly:true,secure: process.env.NODE_ENV === "production",sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",maxAge:60*60*1000})
    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure: process.env.NODE_ENV === "production",sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",maxAge:60*60*24*7*1000})

    res.status(200).json(new ApiResponse(200,user,"User logged in successfully"))
}

module.exports = {
    register,
    login
}   