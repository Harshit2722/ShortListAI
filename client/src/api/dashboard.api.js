import api from "./axios"

const getDashboard = async () => {
    const {data} = await api.get("/dashboard");

    return data;
}

export {
    getDashboard
}