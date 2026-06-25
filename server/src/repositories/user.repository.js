
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
    const user = await User.findOne({email})
    return user
}

async findUserByEmailWithPassword(email) {
    return await User.findOne({ email })
        .select("+password");
}

async existsByEmail(email){
    return await User.exists({
        email
    });
}

async findUserById(id){
    const user = await User.findById(id)
    return user
}

async updateUser(id,updateData){
    const user = await User.findByIdAndUpdate(id,updateData,{new:true,runValidators:true,context:'query'})
    return user
}

async deleteUser(id){
    const user = await User.findByIdAndDelete(id)
    return user
}

}

module.exports = new UserRepository()