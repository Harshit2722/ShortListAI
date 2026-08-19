const ApiResponse = require("../utils/ApiResponse");
const ResumeService = require("../services/resume.service");

const createResume = async (req,res) => {

    const resume = await ResumeService.createResume(req.params.jobId,req.user._id,req.file)

    return res.status(201).json(new ApiResponse(201,resume,"Resume uploaded successfully"))
}

const getResumeById = async (req,res) => {

    const resume = await ResumeService.getResumeById(req.params.resumeId,req.user._id,req.params.jobId);

    return res.status(200).json(new ApiResponse(200,resume,"Resume fetched successfully"));
}

const getResumesByJob = async (req,res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const search = req.query.search || "";

    const status = req.query.status;
    const recommendation = req.query.recommendation;

    const minScore = req.query.minScore !== undefined
        ? Number(req.query.minScore)
        : undefined;

    const maxScore = req.query.maxScore !== undefined
        ? Number(req.query.maxScore)
        : undefined;

    const result = await ResumeService.getResumesByJob(req.params.jobId,req.user._id,page,limit,sort,order,search,status,recommendation,minScore,maxScore);

    return res.status(200).json(new ApiResponse(200,result,"Resumes fetched successfully"));
}

const deleteResume = async (req,res) => {

    const resume = await ResumeService.deleteResume(req.params.resumeId,req.user._id,req.params.jobId);

    return res.status(200).json(new ApiResponse(200,resume,"Resume deleted successfully"));
}

const analyzeResume = async (req,res) => {
    const resume = await ResumeService.analyzeResume(req.params.resumeId,req.params.jobId,req.user._id);
    return res.status(200).json(new ApiResponse(200,resume,"Resume analyzed successfully"));
}

module.exports = {
    createResume,
    getResumeById,
    getResumesByJob,
    deleteResume,
    analyzeResume
}