const UserRepository = require("../repositories/user.repository")
const ApiError = require("../utils/ApiError")
const JobRepository = require("../repositories/job.repository")

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

    const deletedUser = await UserRepository.deleteUser(userId);

    await JobRepository.deleteJobsByUserId(userId);

    return deletedUser
}


module.exports = {
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser

}