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
}

module.exports = new DashboardRepository();