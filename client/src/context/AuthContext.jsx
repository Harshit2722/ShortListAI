import { useState, useEffect } from "react";
import { getCurrentUser as getCurrentUserApi, register as registerApi, login as loginApi, logout as logoutApi } from "../api/auth.api.js"
import { AuthContext } from "./AuthContext.js";
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const data = await getCurrentUserApi();
            setUser(data.data);
        }
        catch (err) {
            console.error(err);
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            refreshUser();
    }, [])

    const register = async (formData) => {
        const data = await registerApi(formData);
        setUser(data.data);
        return data;
    }

    const login = async (formData) => {
        const data = await loginApi(formData);
        setUser(data.data)
        return data;
    }

    const logout = async () => {
        const data = await logoutApi();
        setUser(null);
        return data;
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}