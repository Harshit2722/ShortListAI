const ResumeSubmission = require("../models/resumeSubmission.model");

class ResumeSubmissionRepository{

    async createResume(resumeData){
        return await ResumeSubmission.create(resumeData)
    }

    async updateResume(resumeId,updateData){
        return await ResumeSubmission.findByIdAndUpdate(resumeId,updateData,{returnDocument:"after",runValidators:true}).select("-__v");
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

    async deleteResumesByJob(jobId){
        return await ResumeSubmission.deleteMany({job:jobId});
    }

    async findResumesByJobIds(jobIds){
        return await ResumeSubmission.find({
            job: {$in: jobIds}
        }).select("-__v")
    }

    async deleteResumesByJobIds(jobIds){
        return await ResumeSubmission.deleteMany({
            job: {$in: jobIds}
        })
    }

}

module.exports = new ResumeSubmissionRepository();