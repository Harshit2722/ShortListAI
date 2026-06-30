const Job = require("../models/job.model");

class JobRepository{

    async createJob(jobData){
        return await Job.create(jobData)
    }

    async findJobById(id){
        return await Job.findById(id).select("-__v")
    }

    async updateJob(id,updateData){
        return await Job.findByIdAndUpdate(id,updateData,{returnDocument: "after",runValidators:true}).select("-__v")
    }

    async getAllJobs(filters = {}){
        return await Job.find(filters).select("-__v")
    }

    async deleteJob(id){
        return await Job.findByIdAndDelete(id)
    }
}

module.exports = new JobRepository()