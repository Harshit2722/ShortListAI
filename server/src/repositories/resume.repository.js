const ResumeSubmission = require("../models/resumeSubmission.model");

class ResumeSubmissionRepository{

    async createResume(resumeData){
        return await ResumeSubmission.create(resumeData)
    }

    async findResumeWithHash(jobId,hash){
        return await ResumeSubmission.findOne({
            job:jobId,
            fileHash:hash
        }).select("-__v")
    }

    async findResumeById(id){
        return await ResumeSubmission.findById(id).select("-__v")
    }

    async getResumesByJob(jobId){
        return await ResumeSubmission.find({job:jobId}).select("-__v")
    }

}

module.exports = new ResumeSubmissionRepository();