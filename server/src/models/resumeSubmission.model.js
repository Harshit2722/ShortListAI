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
            required: [true,"Public ID is required"]
        },
        url: {
            type: String,
            required: [true,"URL is required"]
        }
    },
    resumeText: {
        type: String,
        required: [true,"Resume text is required"]
    },
    fileHash: {
        type: String,
        required: [true,"File hash is required"]
    },
    status: {
        type: String,
        enum: ["Pending","Processing","Failed","Completed"],
        default: "Pending"
    }
},{timestamps:true})

resumeSchema.index({job:1,fileHash:1},{unique:true})

module.exports = mongoose.model("ResumeSubmission",resumeSchema);