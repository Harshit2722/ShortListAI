const UserRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken")
const generateOTP = require("../utils/generateOTP")
const EmailService = require("./emailService")
const hashValue = require("../utils/hash");

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const register = async ({ name, email, password, company, designation }) => {

    const existingUser = await UserRepository.findUserByEmail(email);

    if (existingUser && existingUser.isVerified === true) {
        throw new ApiError(409, "User already verified and exists");
    }


    if (existingUser && existingUser.isVerified === false) {
        return resendOTP({email:email})
    }

    const emailOTP = generateOTP();

    const hashedOTP = hashValue(emailOTP);

    const user = await UserRepository.createUser({
        name,
        email,
        password,
        company,
        designation,
        verification: {
            emailOTP: hashedOTP,
            emailOTPExpiry: new Date(Date.now() + OTP_EXPIRY_MS)
        },
        isVerified: false
    });

    try {
        await EmailService.sendEmailVerificationOTP(user.email, emailOTP, user.name);
        return {
            message: "Verification email sent. Please check your inbox for the OTP.",
            email: user.email
        };
    }
    catch (err) {
        await UserRepository.deleteUser(user._id);
        throw new ApiError(500, "Failed to send verification email")
    }


}

const verifyEmail = async ({email, otp}) => {

    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if(user.isVerified===true){
        throw new ApiError(400,"Email is already verified.")
    }

    if (user.verification.emailOTPExpiry < new Date()) {
        throw new ApiError(400, "OTP is expired")
    }

    const hashedOTP = hashValue(otp.trim());

    if (user.verification.emailOTP !== hashedOTP) {
        throw new ApiError(400, "OTP is invalid")
    }

    await UserRepository.updateUser(user._id, {
        "verification.emailOTP": null,
        "verification.emailOTPExpiry": null,
        isVerified: true,
    });

     try{
        await EmailService.sendWelcomeEmail(user.email, user.name);
    }
    catch(err){
        console.error("Failed to send welcome email:", err);
    }

    return {
        message: "Email verification successful."
    };


}

const resendOTP = async ({email}) => {

    const user = await UserRepository.findUserByEmail(email);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    if(user.isVerified===true){
        throw new ApiError(400,"Email is already verified.");
    }

    const emailOTP = generateOTP();

    const hashedOTP = hashValue(emailOTP);

    await UserRepository.updateUser(user._id,{
        "verification.emailOTP": hashedOTP,
        "verification.emailOTPExpiry": new Date(Date.now() + OTP_EXPIRY_MS)
    })

    try{
        await EmailService.sendEmailVerificationOTP(user.email, emailOTP,user.name);
        return {
            message: "Verification email sent. Please check your inbox for the OTP.",
            email: email
        };
    }
    catch (err) {
        await UserRepository.updateUser(user._id,{
            "verification.emailOTP": null,
            "verification.emailOTPExpiry": null,
        })
        throw new ApiError(500,"Failed to send verification email")
    }
}

const forgotPassword = async ({email}) => {
    
    const user = await UserRepository.findUserByEmail(email);

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const forgotPasswordOTP = generateOTP();
    const hashedOTP = hashValue(forgotPasswordOTP);

    await UserRepository.updateUser(user._id,{
        "verification.forgotPasswordOTP": hashedOTP,
        "verification.forgotPasswordOTPExpiry": new Date(Date.now() + OTP_EXPIRY_MS)
    })

    try{
        await EmailService.sendForgotPasswordOTP(email,forgotPasswordOTP);
        return {
            message:"Forgot password OTP sent. Please check your inbox for the OTP.",
            email:email
        }
    }
    catch (err){
        await UserRepository.updateUser(user._id,{
            "verification.forgotPasswordOTP": null,
            "verification.forgotPasswordOTPExpiry": null,
        })
        throw new ApiError(500,"Failed to send forgot password OTP")
    }
}

const resetPassword = async ({email,otp,newPassword}) => {

    const user = await UserRepository.findUserByEmail(email);

    if(!user){
        throw new ApiError(404,"User not found")
    }

    if(!user.verification.forgotPasswordOTP || !user.verification.forgotPasswordOTPExpiry){
        throw new ApiError(400,"Forgot password OTP was not requested or is invalid")
    }

    if (user.verification.forgotPasswordOTPExpiry < new Date()) {
        throw new ApiError(400,"Forgot password OTP is expired")
    }

    const hashedOTP = hashValue(otp.trim());

    if(user.verification.forgotPasswordOTP !== hashedOTP){
        throw new ApiError(400,"Forgot password OTP is invalid")
    }

    user.password = newPassword;
    user.verification.forgotPasswordOTP = null;
    user.verification.forgotPasswordOTPExpiry = null;
    user.isVerified = true
    user.refreshToken = null

    await user.save();

    return {
        message:"Password reset successful"
    };
        
}

const login = async ({ email, password }) => {

    const user = await UserRepository.findUserByEmailWithPassword(email);
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    if(user.isVerified===false){
        throw new ApiError(403,"Account is not verified. Please verify your email.")
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const updatedUser = await UserRepository.updateUser(user._id, { refreshToken: refreshToken });

    return {
        user: updatedUser,
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const logout = async (id) => {

    const updatedUser = await UserRepository.updateUser(id, { refreshToken: null })

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return;
}

const generateTokens = function (user) {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const refreshAccessToken = async (refreshToken) => {

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token not found")
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const user = await UserRepository.findUserByIdWithRefreshToken(decoded.id);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token")
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    await UserRepository.updateUser(user._id, { refreshToken: newRefreshToken });

    const safeUser = await UserRepository.findUserById(user._id);

    return {
        user: safeUser,
        accessToken: accessToken,
        refreshToken: newRefreshToken
    }


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