import api from "./axios";

export const getCurrentUser = async () => {
    const { data } = await api.get("/users/me");
    return data;
};

export const updateProfile = async (profileData) => {
    const { data } = await api.patch("/users/profile", profileData);
    return data;
};

export const uploadAvatar = async (formData) => {
    const { data } = await api.post("/users/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

export const deleteAvatar = async () => {
    const { data } = await api.delete("/users/avatar");
    return data;
};

export const requestEmailChange = async (payload) => {
    const { data } = await api.patch("/users/request-email-change", payload);
    return data;
};

export const verifyEmailChange = async (payload) => {
    const { data } = await api.patch("/users/verify-email-change", payload);
    return data;
};

export const updatePassword = async (payload) => {
    const { data } = await api.patch("/users/password", payload);
    return data;
};

export const deleteAccount = async (payload) => {
    const { data } = await api.delete("/users", {
        data: payload,
    });
    return data;
};
