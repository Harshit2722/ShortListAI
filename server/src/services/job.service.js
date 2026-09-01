const JobRepository = require("../repositories/job.repository")
const ApiError = require("../utils/ApiError")
const ResumeRepository = require("../repositories/resume.repository")
const { deleteResume: deleteResumeFromCloudinary } = require("../utils/cloudinary")

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

const updateJobStatus = async (jobId,status,recruiterId) => {

    const job = await JobRepository.findJobById(jobId);

    if(!job){
        throw new ApiError(404,"Job not found")
    }

    if(job.createdBy.toString()!==recruiterId.toString()){
        throw new ApiError(403,"You can only update your own jobs")
    }

    const updatedJob = await JobRepository.updateJob(jobId,{"status":status});

    if(!updatedJob){
        throw new ApiError(500,"Failed to update job status")
    }

    return updatedJob;
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

const getAllJobsOfARecruiter = async (recruiterId,query)=>{

    const {
        page,
        limit,
        sort,
        order,
        search,
        status,
        workMode,
        employmentType
    } = query;

    const allowedSortFields = {
        createdAt: "createdAt",
        applicationDeadline: "applicationDeadline",
        title: "title",
        salaryMin: "salary.min",
        salaryMax: "salary.max",
        experience: "experience"
    };

    const sortField = allowedSortFields[sort] || "createdAt";

    const sortOrder = order==="asc" ? 1 : -1;

    const {jobs,total} = await JobRepository.getAllJobs(recruiterId,page,limit,sortField,sortOrder,status,search,employmentType,workMode);

    const totalPages = Math.ceil(total/limit);

    return {
        jobs,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
    
}

const deleteJob = async (jobId,recruiterId) =>{

    const job = await JobRepository.findJobById(jobId);

    if(!job){
        throw new ApiError(404,"Job not found")
    }

    if(job.createdBy.toString()!==recruiterId.toString()){
        throw new ApiError(403,"You can only delete your own jobs")
    }

    const resumes = await ResumeRepository.getResumesByJob(jobId);
    let deletedJob;

    try{
        await ResumeRepository.deleteResumesByJob(jobId);
        deletedJob = await JobRepository.deleteJob(jobId);

    }
    catch(error){
        console.error("Failed to delete job",error.message);
        throw new ApiError(500,"Failed to delete job")
    }

    for(const resume of resumes){
        if (resume.resume?.publicId){
            try{
                await deleteResumeFromCloudinary(resume.resume.publicId);
            }
            catch(err){
                console.error("Failed to delete resume from cloudinary",err.message);
            }
        }
    }
    

    return deletedJob
}

module.exports = {
    createJob,
    updateJob,
    updateJobStatus,
    getJobById,
    getAllJobsOfARecruiter,
    deleteJob
}
