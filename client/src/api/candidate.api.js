import api from "./axios";

export const getJobCandidates = async (jobId, params = {}) => {
    const { data } = await api.get(`/jobs/${jobId}/resumes`, { params });
    return data;
};

export const getCandidateById = async (jobId, candidateId) => {
    const { data } = await api.get(`/jobs/${jobId}/resumes/${candidateId}`);
    return data;
};

export const deleteCandidate = async (jobId, candidateId) => {
    const { data } = await api.delete(`/jobs/${jobId}/resumes/${candidateId}`);
    return data;
};

export const analyzeCandidate = async (jobId, candidateId) => {
    const { data } = await api.post(`/jobs/${jobId}/resumes/${candidateId}/analyze`);
    return data;
};
