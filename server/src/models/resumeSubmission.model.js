const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: [true,"Job is required"]
    },
    candidate: {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true
        }
    },
    resume: {
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    fileHash: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending","Processing","Failed","Completed"],
        default: "Pending"
    }
},{timestamps:true})

resumeSchema.index({job:1,fileHash:1},{unique:true})

module.exports = mongoose.model("ResumeSubmission",resumeSchema);