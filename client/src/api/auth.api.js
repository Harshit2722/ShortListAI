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