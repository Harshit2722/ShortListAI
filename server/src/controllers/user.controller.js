const { BASE_COOKIE_OPTIONS } = require("../constants/cookie.constants")
const UserService = require("../services/user.service")
const ApiResponse = require("../utils/ApiResponse")

const updateProfile = async (req,res) => {
    const data = req.body
    const userId = req.user._id;

    const updatedUser = await UserService.updateProfile(userId,data);

    return res.status(200).json(new ApiResponse(200,updatedUser,"Profile updated successfully"))
}

const requestEmailChange = async (req,res) => {
    const {newEmail,password} = req.body;
    const userId = req.user._id

    const {message,email} = await UserService.requestEmailChange(userId,password,newEmail);

    return res.status(200).json(new ApiResponse(200,{email},message))
}

const verifyEmailChange = async (req,res) => {
    const {otp} = req.body;
    const userId = req.user._id;

    const {message} = await UserService.verifyEmailChange(userId,otp);

    return res.status(200).json(new ApiResponse(200,null,message))
}

const updatePassword = async (req,res) => {
    const {currentPassword,newPassword} = req.body;
    const userId = req.user._id

    const updatedUser = await UserService.updatePassword(userId,currentPassword,newPassword);

    res.clearCookie("refreshToken",BASE_COOKIE_OPTIONS)
    res.clearCookie("accessToken",BASE_COOKIE_OPTIONS)

    return res.status(200).json(new ApiResponse(200,updatedUser,"Password updated successfully"))
}

const deleteUser = async (req,res) => {
    const userId = req.user._id
    const password = req.body.password

    const deletedUser = await UserService.deleteUser(userId,password);

    res.clearCookie("refreshToken",BASE_COOKIE_OPTIONS)
    res.clearCookie("accessToken",BASE_COOKIE_OPTIONS)

    return res.status(200).json(new ApiResponse(200,deletedUser,"Account deleted successfully."))
}

const getCurrentUser = async (req,res)=>{

    return res.status(200).json(new ApiResponse(200,req.user,"User Info sent successfully"))
}

const uploadAvatar = async (req,res) => {

    const image = req.file;
    const userId = req.user._id;

    const updatedUser = await UserService.uploadAvatar(userId,image);

    return res.status(200).json(new ApiResponse(200,updatedUser,"Avatar updated successfully"))
}

const deleteAvatar = async (req,res) => {

    const userId = req.user._id;

    const updatedUser = await UserService.deleteAvatar(userId);

    return res.status(200).json(new ApiResponse(200,updatedUser,"Avatar deleted successfully"))
}


module.exports = {
    getCurrentUser,
    updateProfile,
    requestEmailChange,
    verifyEmailChange,
    updatePassword,
    deleteUser,
    uploadAvatar,
    deleteAvatar
}