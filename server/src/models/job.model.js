const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Job title is required"],
        trim: true,
        maxlength: [100, "Job title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true,"Job description is required"],
        trim: true,
        minlength: [50, "Description is too short"]
    },
    location: {
        type: String,
        required: [true,"Job location is required"],
        trim: true
    },
    workMode: {
        type: String,
        enum: ["On-Site","Remote","Hybrid"],
        required: [true,"Work mode is required"]
    },
    employmentType:{
        type: String,
        enum: ["Full-Time","Internship","Contract","Part-Time"],
        required: [true,"Employment type is required"]
    },
    duration: {
        value: Number,
        unit: {
            type: String,
            enum: ["days", "weeks", "months", "years"]
        }
    },
    applicationDeadline: {
        type: Date,
        required: [true,"Application deadline is required"]
    },
    salary: {
        min: {
            type: Number,
            required: [true,"Minimum salary is required"],
            min: [0,"Salary cannot be negative"]
        },
        max: {
            type: Number,
            required: [true,"Maximum salary is required"],
            min: [0,"Salary cannot be negative"]
        },
        currency: {
            type: String,
            required: [true,"Currency is required"],
            default: "INR",
            trim: true
        }
    },
    requiredSkills: {
        type: [{
            type: String,
            trim: true
        }],
        required: [true,"Required skills are required"],
        validate: {
            validator: skills => skills.length>0,
            message: "At least one skill is required"
        }
    },
    experience: {
        type: Number,
        min: [0,"Experience cannot be negative"],
        max: [50,"Experience cannot be more than 50 years"],
        required: [true,"Experience is required"]
    },
    status: {
        type: String,
        enum: ["Open","Closed"],
        default: "Open"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Recruiter is required"]
    }
    
},{timestamps: true})


jobSchema.index({
    createdBy: 1,
    status: 1
});

module.exports = mongoose.model("Job",jobSchema)
