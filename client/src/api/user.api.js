import api from "./axios";

export const getCurrentUser = async () => {
    const {data} = await api.get("/users/me");
    return data;
}

