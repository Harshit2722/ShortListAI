import api from "./axios";

export const getJobCandidates = async (jobId, params = {}) => {
    const { data } = await api.get(`/jobs/${jobId}/resumes`, { params });
    return data;
};

export const getCandidateById = async (jobId, candidateId) => {
    const { data } = await api.get(`/jobs/${jobId}/resumes/${candidateId}`);
    return data;
};
