import api from "./axios";

export const getJobCandidates = async (jobId, params = {}) => {
    const { data } = await api.get(`/jobs/${jobId}/resumes`, { params });
    return data;
};

export const getCandidateById = async (jobId, candidateId) => {
    const { data } = await api.get(`/jobs/${jobId}/resumes/${candidateId}`);
    return data;
};

export const uploadCandidateResume = async (jobId, resume, onUploadProgress) => {
    const formData = new FormData();
    formData.append("resume", resume);

    const { data } = await api.post(`/jobs/${jobId}/resumes`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
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
