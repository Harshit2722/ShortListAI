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
        select: false
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    },
    company: {
        type: String,
        trim: true,
        required: [true, "Company is required"]
    },
    designation: {
        type: String,
        trim: true,
        required: [true, "Designation is required"]
    },
    avatar: {
        url: {
            type: String,
            default: null,
        },
        publicId: {
            type: String,
            default: null,
        },
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verification: {
        emailOTP: {
            type: String,
            default: null
        },
        emailOTPExpiry: {
            type: Date,
            default: () => new Date(Date.now() + 10 * 60 * 1000)
        },
        emailChangeOTP: {
            type: String,
            default: null
        },
        emailChangeOTPExpiry: {
            type: Date,
            default: () => new Date(Date.now() + 10 * 60 * 1000)
        },
        pendingEmail: {
            type: String,
            default: null
        },
        forgotPasswordOTP: {
            type: String,
            default: null
        },
        forgotPasswordOTPExpiry: {
            type: Date,
            default: null
        }
    }
}, { timestamps: true });


userSchema.pre("save", async function () {
    const user = this;

    if (!user.isModified("password")) return;

    user.password = await bcrypt.hash(user.password, 10);
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.generateAccessToken = function () {
    const payload = {
        id: this._id
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY })
}

userSchema.methods.generateRefreshToken = function () {
    const payload = {
        id: this._id
    }

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRY })
}

module.exports = mongoose.model("User", userSchema)