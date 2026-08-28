const Job = require("../models/job.model");
const ResumeSubmission = require("../models/resumeSubmission.model");

class DashboardRepository {

    async getJobStats(recruiterId) {

        const [totalJobs, openJobs, closedJobs] = await Promise.all([
            Job.countDocuments({ createdBy: recruiterId }),
            Job.countDocuments({ createdBy: recruiterId, status: "Open" }),
            Job.countDocuments({ createdBy: recruiterId, status: "Closed" })
        ]);

        return {
            totalJobs,
            openJobs,
            closedJobs
        };
    }

    async getResumeStats(jobIds) {

        const [
            totalCandidates,
            completedAnalysis,
            pendingAnalysis,
            processingAnalysis,
            failedAnalysis
        ] = await Promise.all([
            ResumeSubmission.countDocuments({ job: { $in: jobIds } }),
            ResumeSubmission.countDocuments({
                job: { $in: jobIds },
                status: "Completed"
            }),
            ResumeSubmission.countDocuments({
                job: { $in: jobIds },
                status: "Pending"
            }),
            ResumeSubmission.countDocuments({
                job: { $in: jobIds },
                status: "Processing"
            }),
            ResumeSubmission.countDocuments({
                job: { $in: jobIds },
                status: "Failed"
            })
        ]);

        return {
            totalCandidates,
            completedAnalysis,
            pendingAnalysis,
            processingAnalysis,
            failedAnalysis
        };
    }

    async getRecentJobs(recruiterId){
        return await Job.aggregate([
            {
                $match : {
                    createdBy: recruiterId
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "resumesubmissions",
                    localField: "_id",
                    foreignField: "job",
                    as: "resumes"                
                }
            },
            {
                $project: {
                    title: 1,
                    status: 1,
                    location: 1,
                    workMode: 1,
                    createdAt: 1,
                    candidateCount: {
                        $size: "$resumes"
                    }
                }
            }
        ])
    }

    async getTopCandidates(jobIds) {
        return await ResumeSubmission.find({
            job: { $in: jobIds },
            status: "Completed",
            "analysis.overallScore": { $exists: true }
        })
            .select("candidate job analysis.overallScore analysis.recommendation")
            .populate("job", "title")
            .sort({ "analysis.overallScore": -1 })
            .limit(5);
    }
}

module.exports = new DashboardRepository();