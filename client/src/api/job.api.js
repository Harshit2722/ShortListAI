
import api from "./axios";

export const getJobs = async (params = {}) => {
    const { data } = await api.get("/jobs", {params,});
    return data;
};

export const getJobById = async (jobId) => {
    const {data} = await api.get(`/jobs/${jobId}`);
    return data;
}

export const createJob = async (jobData) => {
    const {data} = await api.post("/jobs",jobData);
    return data;
}

export const updateJob = async (jobId,jobData) => {
    const {data} = await api.patch(`/jobs/${jobId}`,jobData);
    return data;
}

export const updateJobStatus = async (jobId,status) => {
    const {data} = await api.patch(`/jobs/${jobId}/status`,{status});
    return data;
}

export const deleteJob = async (jobId) => {
    const {data} = await api.delete(`/jobs/${jobId}`);
    return data;
}