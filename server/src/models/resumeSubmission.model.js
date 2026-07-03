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
        },
        skills: {
            type: [{
                type: String,
                trim: true
            }]
        },
        education: {
            type: [{
                type: String,
                trim: true
            }]
        },
        experience: {
            type: [{
                type: String,
                trim: true
            }]
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
    },
    analysis: {
        score: {
            type: Number,
            min: [0,"Score cannot be negative"],
            max: [10,"Maximum score recruiter can give is 10"]
        },
        recommendation: {
            type: String,
            enum: ["Strong Match","Good Match","Average Match","Poor Match"]
        },
        summary: {
            type: String,
            trim: true
        },
        strengths: {
            type: [{
                type: String,
                trim: true
            }]
        },
        weaknesses: {
            type: [{
                type: String,
                trim: true
            }]
        },
        missingSkills: {
            type: [{
                type: String,
                trim: true
            }],
            default: []
        }
    }
},{timestamps:true})

resumeSchema.index({job:1,fileHash:1},{unique:true})

module.exports = mongoose.model("ResumeSubmission",resumeSchema);