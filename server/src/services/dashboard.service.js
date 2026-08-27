const DashboardRepository = require("../repositories/dashboard.repository");
const JobRepository = require("../repositories/job.repository");

const getDashboard = async (recruiterId) => {

    const jobStats = await DashboardRepository.getJobStats(recruiterId);

    const jobs = await JobRepository.findJobIdsByUserId(recruiterId);

    const jobIds = jobs.map(job => job._id);

    const resumeStats = await DashboardRepository.getResumeStats(jobIds);

    return {
        stats: {
            ...jobStats,
            ...resumeStats
        }
    };
};

module.exports = {
    getDashboard
};