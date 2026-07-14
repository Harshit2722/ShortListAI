const UserRepository = require("../repositories/user.repository")
const ApiError = require("../utils/ApiError")
const JobRepository = require("../repositories/job.repository");
const { deleteResume: deleteResumeFromCloudinary, deleteAvatar: deleteAvatarFromCloudinary,uploadAvatar: uploadAvatarToCloudinary } = require("../utils/cloudinary");
const ResumeRepository = require("../repositories/resume.repository");

const updateProfile = async (userId, updateData) => {

    const updatedUser = await UserRepository.updateUser(userId, updateData);

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    return updatedUser
}

const updateEmail = async (userId, password, newEmail) => {

    const user = await UserRepository.findUserByIdWithPassword(userId);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    const formattedEmail = newEmail.trim().toLowerCase();

    if (user.email === formattedEmail) {
        throw new ApiError(400, "New email cannot be the same as your current email");
    }

    const emailExists = await UserRepository.existsByEmail(formattedEmail);

    if (emailExists) {
        throw new ApiError(409, "Email already exists");
    }

    const updatedUser = await UserRepository.updateUser(userId, { email: formattedEmail })

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    return updatedUser;
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
    updateEmail,
    updatePassword,
    deleteUser,
    uploadAvatar,
    deleteAvatar

}