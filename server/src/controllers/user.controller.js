const { BASE_COOKIE_OPTIONS } = require("../constants/cookie.constants")
const UserService = require("../services/user.service")
const ApiResponse = require("../utils/ApiResponse")

const updateProfile = async (req,res) => {
    const data = req.body
    const userId = req.user._id;

    const updatedUser = await UserService.updateProfile(userId,data);

    return res.status(200).json(new ApiResponse(200,updatedUser,"Profile updated successfully"))
}

const updateEmail = async (req,res) => {
    const {newEmail,password} = req.body;
    const userId = req.user._id

    const updatedUser = await UserService.updateEmail(userId,password,newEmail);

    return res.status(200).json(new ApiResponse(200,updatedUser,"Email updated successfully"))
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


module.exports = {
    getCurrentUser,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser
}