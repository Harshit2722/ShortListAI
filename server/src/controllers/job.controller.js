const JobService = require("../services/job.service")
const ApiResponse = require("../utils/ApiResponse");

const createJob = async (req,res) => {

    const job = await JobService.createJob(req.body,req.user._id)

    return res.status(201).json(new ApiResponse(201,job,"Job created successfully"))
}

const updateJob = async (req,res) => {

    const job = await JobService.updateJob(req.params.jobId,req.body,req.user._id);

    return res.status(200).json(new ApiResponse(200,job,"Job updated successfully"))
}

const deleteJob = async (req,res) => {

    const job = await JobService.deleteJob(req.params.jobId,req.user._id);

    return res.status(200).json(new ApiResponse(200,job,"Job deleted successfully"))
}

const getJobById = async (req,res) => {

    const job = await JobService.getJobById(req.params.jobId,req.user._id);

    return res.status(200).json(new ApiResponse(200,job,"Job fetched successfully"))
}

const getAllJobsOfARecruiter = async (req,res) => {

    const jobs = await JobService.getAllJobsOfARecruiter(req.user._id,req.query)

    return res.status(200).json(new ApiResponse(200,jobs,"Jobs fetched successfully"))
}

module.exports = {
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    getAllJobsOfARecruiter
}