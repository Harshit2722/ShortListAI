const ResumeSubmission = require("../models/resumeSubmission.model");

class ResumeSubmissionRepository{

    async createResume(resumeData){
        return await ResumeSubmission.create({
            ...resumeData
        }).select("-_v")
    }

    async findResumeWithHash(jobId,hash){
        return await ResumeSubmission.findOne({
            job:jobId,
            fileHash:hash
        }).select("-_v")
    }

    async findResumeById(id){
        return await ResumeSubmission.findById(id).select("-_v")
    }

    async getResumesByJob(jobId){
        return await ResumeSubmission.find({job:jobId}).select("-_v")
    }

    async deleteResume(id){
        return await ResumeSubmission.findByIdAndDelete(id);
    }
}

module.exports = new ResumeSubmissionRepository();