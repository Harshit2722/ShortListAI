const JobRepository = require("../repositories/job.repository");
const ResumeSubmissionRepository = require("../repositories/resume.repository");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const {uploadResume,deleteResume: deleteResumeFromCloudinary} = require("../utils/cloudinary")
const {extractTextFromPDF} = require("../utils/pdfParser")
const {analyzeResume: analyzeResumeWithAI} = require("../services/ai/index")
const {determineSeniority} = require("../utils/seniority")
const {getScoringWeights} = require("../utils/scoringWeights")

const createResume = async (jobId,recruiterId,resumeFile) => {

    if(!resumeFile){
        throw new ApiError(400,"Resume File not uploaded")
    }

    const job = await verifyRecruiterOwnsJob(jobId,recruiterId);

    const applicationDeadline = job.applicationDeadline;

    if(applicationDeadline.getTime()< Date.now()){
        throw new ApiError(400,"Application deadline has passed. Cannot upload resume now");
    }

    const buffer = resumeFile.buffer;
    const hash = crypto.createHash("sha256").update(buffer).digest("hex")

    const existingResume = await ResumeSubmissionRepository.findResumeWithHash(jobId,hash);

    if(existingResume){
        throw new ApiError(409,"This resume is already uploaded for this job")
    }
    
    const resumeText = await extractTextFromPDF(buffer);

    const {url,publicId} = await uploadResume(buffer);

    const resumeData = {
        job: jobId,
        resume: {
            url,
            publicId
        },
        resumeText,
        fileHash:hash
    }

    try{
        const resume = await ResumeSubmissionRepository.createResume(resumeData);
        return resume;
    }
    catch(err){
        await deleteResumeFromCloudinary(publicId);
        throw new ApiError(500,"Failed to create resume");
    }
}

const getResumeById = async (resumeId,recruiterId,jobId) => {

    await verifyRecruiterOwnsJob(jobId,recruiterId);

    const resume = await ResumeSubmissionRepository.findResumeById(resumeId);

    if(!resume){
        throw new ApiError(404,"Resume not found")
    }

    if(resume.job.toString()!==jobId.toString()){
        throw new ApiError(404,"Resume not found")
    }

    return resume;
}

const getResumesByJob = async (jobId,recruiterId) => {

    await verifyRecruiterOwnsJob(jobId,recruiterId);

    const resumes = await ResumeSubmissionRepository.getResumesByJob(jobId);

    return resumes;
}

const deleteResume = async (resumeId,recruiterId,jobId) => {

    await verifyRecruiterOwnsJob(jobId,recruiterId);

    const resume = await ResumeSubmissionRepository.findResumeById(resumeId);

    if(!resume){
        throw new ApiError(404,"Resume not found")
    }

    if(resume.job.toString()!==jobId.toString()){
        throw new ApiError(404,"Resume not found")
    }
    
    await deleteResumeFromCloudinary(resume.resume.publicId);
    
    await resume.deleteOne();

    return resume;

}

const analyzeResume = async (resumeId,jobId,recruiterId) => {

    const job = await verifyRecruiterOwnsJob(jobId,recruiterId);

    const resume = await ResumeSubmissionRepository.findResumeById(resumeId);

    if(!resume){
        throw new ApiError(404,"Resume not found")
    }

    if(resume.job.toString()!==jobId.toString()){
        throw new ApiError(404,"Resume not found")
    }

    if(job.status==="Closed"){
        throw new ApiError(403,"Job is closed. Cannot analyze resume")
    }

    if(resume.status==="Completed"){
        throw new ApiError(409,"Resume already analyzed")
    }

    if(resume.status === "Processing"){
        throw new ApiError(409,"Resume analysis is already in progress");
    }

    await ResumeSubmissionRepository.updateResume(resumeId,{status: "Processing"});

    const seniority = determineSeniority(job.title,job.experience);
    
    try{
        const analysis = await analyzeResumeWithAI({
            resumeText: resume.resumeText,
            jobDescription: job.description,
            jobTitle: job.title,
            requiredSkills: job.requiredSkills,
            requiredExperience: job.experience,
            seniority: seniority
        })

        const weights = getScoringWeights(seniority);

        const overallScore = (
            analysis.analysis.skillsScore * weights.skills +
            analysis.analysis.experienceScore * weights.experience +
            analysis.analysis.projectsScore * weights.projects +
            analysis.analysis.educationScore * weights.education +
            analysis.analysis.resumeScore * weights.resume
        ).toFixed(1);

        analysis.analysis.overallScore = overallScore;

        if (overallScore >= 9) {
            analysis.analysis.recommendation = "Strong Match";
        } else if (overallScore >= 7) {
            analysis.analysis.recommendation = "Good Match";
        } else if (overallScore >= 5) {
            analysis.analysis.recommendation = "Average Match";
        } else {
            analysis.analysis.recommendation = "Poor Match";
        }

        const updatedResume = await ResumeSubmissionRepository.updateResume(resumeId,{
            candidate: analysis.candidate,
            analysis: analysis.analysis,
            status: "Completed"
        })
        
        return updatedResume
    }
    catch(error){
        await ResumeSubmissionRepository.updateResume(resumeId,{
            status: "Failed"
        })
        console.error(error);
        throw new ApiError(500,"Failed to analyze resume");
    }

}


const verifyRecruiterOwnsJob = async (jobId, recruiterId) => {
    const job = await JobRepository.findJobById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.createdBy.toString() !== recruiterId.toString()) {
        throw new ApiError(403,"You are not authorized to access this job");
    }

    return job;
};

module.exports = {
    createResume,
    getResumesByJob,
    getResumeById,
    deleteResume,
    analyzeResume
}