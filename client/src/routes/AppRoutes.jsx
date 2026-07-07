import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "../pages/landing/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../pages/dashboard/Dashboard";

function AppRoutes(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<PublicRoute><Login/></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;