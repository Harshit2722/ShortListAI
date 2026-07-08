import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "../pages/landing/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import ErrorPage from "../components/ui/ErrorPage";

function AppRoutes(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<PublicRoute><Login/></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />

            <Route path="*" element={<ErrorPage />} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;