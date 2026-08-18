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

    async getResumesByJob(jobId,page,limit){

        const skip = (page-1)*limit;

        const filter = {job: jobId};

        const [resumes,total] = await Promise.all([
            ResumeSubmission.find(filter)
                                     .select("-__v")
                                     .skip(skip)
                                     .limit(limit)
            ,
            ResumeSubmission.countDocuments(filter)
        ]);
        
        return {resumes,total};
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