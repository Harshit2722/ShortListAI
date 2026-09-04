const Job = require("../models/job.model");

class JobRepository {

    async createJob(jobData) {
        return await Job.create(jobData)
    }

    async findJobById(id) {
        return await Job.findById(id).select("-__v")
    }

    async updateJob(id, updateData) {
        return await Job.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true }).select("-__v")
    }

    async getAllJobs(recruiterId, page, limit, sortField, sortOrder, status, search, employmentType, workMode) {

        const filters = {
            createdBy: recruiterId
        }

        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ]
        }

        if (status) {
            filters.status = status
        }

        if (workMode) {
            filters.workMode = workMode
        }

        if (employmentType) {
            filters.employmentType = employmentType
        }

        const skip = (page - 1) * limit;

        const sortOptions = {};
        if (sortField && sortOrder) {
            sortOptions[sortField] = sortOrder;
        }

        const [jobs, total] = await Promise.all([
            Job.find(filters)
               .sort(sortOptions)
               .skip(skip)
               .limit(limit)
               .select("-__v"),

            Job.countDocuments(filters)
        ])

        return {
            jobs,
            total
        };
    }

    async deleteJob(id) {
        return await Job.findByIdAndDelete(id)
    }

    async deleteJobsByUserId(userId) {
        return await Job.deleteMany({ createdBy: userId })
    }

    async findJobIdsByUserId(userId) {
        return await Job.find({ createdBy: userId }).select("_id");
    }
}

module.exports = new JobRepository()