const UserRepository = require("../repositories/user.repository")
const ApiError = require("../utils/ApiError")
const JobRepository = require("../repositories/job.repository");
const { deleteResume: deleteResumeFromCloudinary, deleteAvatar: deleteAvatarFromCloudinary,uploadAvatar: uploadAvatarToCloudinary } = require("../utils/cloudinary");
const ResumeRepository = require("../repositories/resume.repository");
const hashValue = require("../utils/hash");
const generateOTP = require("../utils/generateOTP");
const EmailService = require("./emailService")

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const updateProfile = async (userId, updateData) => {

    const updatedUser = await UserRepository.updateUser(userId, updateData);

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    return updatedUser
}

const requestEmailChange = async (userId,password,newEmail) => {
    const user = await UserRepository.findUserByIdWithPassword(userId);

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const isPasswordValid = await user.comparePassword(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password")
    }

    if(user.email===newEmail){
        throw new ApiError(400,"Current email and new email cannot be same")
    }

    const emailExists = await UserRepository.existsByEmail(newEmail);
    if(emailExists){
        throw new ApiError(409,"Email already exists");
    }

    const emailChangeOTP = generateOTP();
    const hashedOTP = hashValue(emailChangeOTP);

    await UserRepository.updateUser(userId,{
        "verification.emailChangeOTP": hashedOTP,
        "verification.emailChangeOTPExpiry": new Date(Date.now() + OTP_EXPIRY_MS),
        "verification.pendingEmail": newEmail
    })

    try{
        await EmailService.sendEmailChangeVerificationOTP(emailChangeOTP,user.name,newEmail);
        return {
            message: "Email change verification OTP sent. Please check your inbox for the OTP.",
            email: newEmail
        };
    }
    catch (err) {
        console.error("Email change send error:", err);
        await UserRepository.updateUser(user._id,{
            "verification.emailChangeOTP": null,
            "verification.emailChangeOTPExpiry": null,
            "verification.pendingEmail": null
        })
        throw new ApiError(500,"Failed to send email change verification OTP")
    }
}

const verifyEmailChange = async (userId,otp) => {
    const user = await UserRepository.findUserById(userId);

    if(!user){
        throw new ApiError(404,"User not found")
    }

    if(!user.verification?.emailChangeOTP || !user.verification?.pendingEmail){
        throw new ApiError(400,"No email change request found")
    }

    if(user.verification.emailChangeOTPExpiry < new Date()){
        await UserRepository.updateUser(user._id, {
            "verification.emailChangeOTP": null,
            "verification.emailChangeOTPExpiry": null,
            "verification.pendingEmail": null
        })
        throw new ApiError(400,"Email change OTP has expired")
    }

    const hashedOTP = hashValue(otp.trim());

    if(user.verification.emailChangeOTP!==hashedOTP){
        throw new ApiError(400,"Invalid email change OTP")
    }

    const emailExists = await UserRepository.existsByEmail(user.verification.pendingEmail);

    if(emailExists){
        await UserRepository.updateUser(user._id, {
            "verification.emailChangeOTP": null,
            "verification.emailChangeOTPExpiry": null,
            "verification.pendingEmail": null
        })
        throw new ApiError(409,"Email already exists. Please try again with a different email.");
    }


    await UserRepository.updateUser(user._id, {
        "verification.emailChangeOTP": null,
        "verification.emailChangeOTPExpiry": null,
        email: user.verification.pendingEmail,
        "verification.pendingEmail": null
    })

    return {
        message: "Email updated successfully."
    }
}


const updatePassword = async (userId, currentPassword, newPassword) => {

    const user = await UserRepository.findUserByIdWithPassword(userId);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.comparePassword(currentPassword)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid current password")
    }

    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
        throw new ApiError(400, "New password cannot be same as current password")
    }

    user.password = newPassword;
    user.refreshToken = null;

    await user.save();

    const safeUser = await UserRepository.findUserById(user._id);

    return safeUser;

}

const deleteUser = async (userId, password) => {

    const user = await UserRepository.findUserByIdWithPassword(userId);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Account deletion failed due to invalid password")
    }

    const avatarPublicId = user.avatar?.publicId;

    const jobs = await JobRepository.findJobIdsByUserId(userId);
    const jobIds = jobs.map(job => job._id);

    const resumes = await ResumeRepository.findResumesByJobIds(jobIds);

    let deletedUser;

    try{
        await ResumeRepository.deleteResumesByJobIds(jobIds);
        await JobRepository.deleteJobsByUserId(userId);
        deletedUser = await UserRepository.deleteUser(userId);
    }
    catch (error) {
        console.error("Failed to delete user account:", error);
        throw new ApiError(500, "Failed to delete account");
    }

    if (avatarPublicId) {
        try {
            await deleteAvatarFromCloudinary(avatarPublicId);
        } catch (error) {
            console.error("Failed to delete avatar from Cloudinary:", error.message);
        }
    }
    
    for (const resume of resumes) {
        if(resume.resume?.publicId){

            try {
                await deleteResumeFromCloudinary(resume.resume.publicId);
            } catch (error) {
                console.error("Failed to delete resume from Cloudinary:", error.message);
            }
        }
    }

    return deletedUser
}

const uploadAvatar = async (userId,image) => {

    if(!image || !image.buffer){
        throw new ApiError(400,"Avatar image is required")
    }

    const user = await UserRepository.findUserById(userId);

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const buffer = image.buffer;

    const result = await uploadAvatarToCloudinary(buffer);

    const oldAvatarPublicId = user.avatar?.publicId;

    try{
        const updatedUser = await UserRepository.updateUser(userId,{
            avatar:{
                url:result.url,
                publicId:result.publicId
            }
        })

        if (oldAvatarPublicId){
            try{
                await deleteAvatarFromCloudinary(oldAvatarPublicId);
            }
            catch(error){
                console.error("Failed to delete previous avatar from Cloudinary:", error.message);
            }
        }
    
        return updatedUser;
    }
    catch(err){
        try{
            await deleteAvatarFromCloudinary(result.publicId);
        }
        catch(error){
            console.error("Failed to cleanup uploaded avatar:", error.message);
        }
        console.error("Failed to update avatar in MongoDB:", err);
        throw new ApiError(500,"Failed to update avatar in MongoDB");
    }

}

const deleteAvatar = async (userId) => {

    const user = await UserRepository.findUserById(userId);

    if(!user){
        throw new ApiError(404,"User not found")
    }

    if(!user.avatar?.publicId){
        throw new ApiError(400,"User does not have an avatar to delete")
    }

    const avatarPublicId = user.avatar?.publicId;

    try{
        const updatedUser = await UserRepository.updateUser(userId,{
            avatar:{
                url:null,
                publicId:null
            }
        })
        
        if(avatarPublicId){
            try{
                await deleteAvatarFromCloudinary(avatarPublicId);
            }
            catch(error){
                console.error("Failed to delete previous avatar from Cloudinary:", error.message);
            }
        }
    
        return updatedUser;

    }
    catch(err){
        console.error("Failed to delete avatar in MongoDB",err);
        throw new ApiError(500, "Failed to delete avatar");
    }
        
}

module.exports = {
    updateProfile,
    requestEmailChange,
    verifyEmailChange,
    updatePassword,
    deleteUser,
    uploadAvatar,
    deleteAvatar

}