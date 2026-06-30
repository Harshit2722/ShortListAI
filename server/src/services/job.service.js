const JobRepository = require("../repositories/job.repository")
const ApiError = require("../utils/ApiError")

const createJob = async (jobData,recruiterId) => {

    if(jobData.salary.min > jobData.salary.max){
        throw new ApiError(400,"Minimum salary cannot be greater than maximum salary")
    }

    if(jobData.applicationDeadline<= new Date()){
        throw new ApiError(400,"Application deadline must be in the future")
    }

    if(jobData.employmentType!=="Full-Time" && !jobData.duration){
        throw new ApiError(400,"Duration is required")
    }

    const job = await JobRepository.createJob({...jobData,createdBy:recruiterId})

    return job;
}

const updateJob = async (jobId,jobData,recruiterId) => {

    const job = await JobRepository.findJobById(jobId);

    if(!job){
        throw new ApiError(404,"Job not found")
    }

    if(job.createdBy.toString()!==recruiterId.toString()){
        throw new ApiError(403,"You can only update your own jobs")
    }
    
    if(jobData.salary){
        if(jobData.salary.min>jobData.salary.max){
            throw new ApiError(400,"Minimum salary cannot be greater than maximum salary")
        }
    }

    const finalEmploymentType = jobData.employmentType || job.employmentType;
    const finalDuration = jobData.duration !== undefined ? jobData.duration : job.duration;

    const hasDuration = finalDuration && finalDuration.value !== undefined && finalDuration.unit !== undefined;

    if(finalEmploymentType !== "Full-Time" && !hasDuration){
        throw new ApiError(400,"Duration is required")
    }

    if(finalEmploymentType==="Full-Time"){
        jobData.duration = null;
    }

    if(jobData.applicationDeadline && jobData.applicationDeadline<= new Date()){
        throw new ApiError(400,"Application deadline must be in the future")
    }

    const updatedJob = await JobRepository.updateJob(jobId,jobData);

    if(!updatedJob){
        throw new ApiError(500,"Failed to update job")
    }

    return updatedJob
}

const getJobById = async (jobId,recruiterId) => {

    const job = await JobRepository.findJobById(jobId);

    if(!job){
        throw new ApiError(404,"Job not found")
    }

    if(job.createdBy.toString()!==recruiterId.toString()){
        throw new ApiError(403,"You can only view your own jobs")
    }

    return job;
}

const getAllJobsOfARecruiter = async (recruiterId,filters)=>{

    const query = {
        ...filters,
        createdBy: recruiterId
    }
    const jobs = await JobRepository.getAllJobs(query);

    return jobs;
    
}

const deleteJob = async (jobId,recruiterId) =>{

    const job = await JobRepository.findJobById(jobId);

    if(!job){
        throw new ApiError(404,"Job not found")
    }

    if(job.createdBy.toString()!==recruiterId.toString()){
        throw new ApiError(403,"You can only delete your own jobs")
    }

    const deletedJob = await JobRepository.deleteJob(jobId);

    if(!deletedJob){
        throw new ApiError(500,"Failed to delete job")
    }

    return deletedJob
}

module.exports = {
    createJob,
    updateJob,
    getJobById,
    getAllJobsOfARecruiter,
    deleteJob
}
