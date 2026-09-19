import api from './axios'

export const register = async(userData)=>{
    const { data } = await api.post("/auth/register", userData)
    return data;
}

export const login = async (userData) => {
    const { data } = await api.post("/auth/login", userData)
    return data;
}

export const logout = async () => {
    const { data } = await api.post("/auth/logout")
    return data;
}

export const refreshAccessToken = async () => {
    const { data } = await api.post("/auth/refresh")
    return data;
}

export const verifyEmail = async (verificationData) => {
    const { data } = await api.post("/auth/verify-email", verificationData);
    return data;
};

export const resendOtp = async (dataPayload) => {
    const { data } = await api.post("/auth/resend-otp", dataPayload);
    return data;
};

export const forgotPassword = async (dataPayload) => {
    const { data } = await api.post("/auth/forgot-password", dataPayload);
    return data;
};

export const verifyResetOtp = async (dataPayload) => {
    const { data } = await api.post("/auth/verify-reset-otp", dataPayload);
    return data;
};

export const resetPassword = async (resetData) => {
    const { data } = await api.post("/auth/reset-password", resetData);
    return data;
};