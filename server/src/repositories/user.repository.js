
const User = require("../models/user.model");

class UserRepository{

async createUser({name,email,password,company,designation,avatar}){

    const user = await User.create({
        name,
        email,
        password,
        company,
        designation,
        avatar
    })

    return user
}

async findUserByEmail(email){
    return await User.findOne({email}).select("-__v -createdAt -updatedAt")
}

async findUserByEmailWithPassword(email) {
    return await User.findOne({ email }).select("+password -__v -createdAt -updatedAt")
}

async findUserWithoutPassword(id){
    return await User.findById(id).select("-__v -createdAt -updatedAt")
}

async existsByEmail(email){
    return await User.exists({
        email
    });
}

async updateRefreshToken(userId,refreshToken){
    return await User.findByIdAndUpdate(userId,{refreshToken},{new:true,runValidators:true}).select("-__v -createdAt -updatedAt")
}

async findUserById(id){
    return await User.findById(id).select("-__v -createdAt -updatedAt")
}

async findUserByIdWithRefreshToken(id){
    return await User.findById(id).select("+refreshToken -__v -createdAt -updatedAt")
}

async updateUser(id,updateData){
    return await User.findByIdAndUpdate(id,updateData,{new:true,runValidators:true}).select("-__v -createdAt -updatedAt")
}

async deleteUser(id){
    return await User.findByIdAndDelete(id).select("-__v -createdAt -updatedAt")
}

}

module.exports = new UserRepository()