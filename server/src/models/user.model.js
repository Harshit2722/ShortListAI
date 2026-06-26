const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"], 
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"], 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"],
        maxLength: [16, "Password must be at most 16 characters long"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/,
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
        ],
        select: false
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    },
    company: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: null,
    },
}, { timestamps: true });


userSchema.pre("save",async function(){
    const user = this;

    if(!user.isModified("password")) return;

    user.password = await bcrypt.hash(user.password,10);
})

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.generateAccessToken = function(){
    const payload = {
        id: this._id
    }

    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
}

userSchema.methods.generateRefreshToken = function(){
    const payload = {
        id: this._id
    }

    return jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.JWT_REFRESH_EXPIRY})
}

module.exports = mongoose.model("User",userSchema)