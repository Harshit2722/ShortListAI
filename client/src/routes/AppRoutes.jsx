import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "../pages/landing/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import ErrorPage from "../components/ui/ErrorPage";
import RecruiterLayout from "../layouts/RecruiterLayout";
import Jobs from "../pages/dashboard/Jobs";
import Candidates from "../pages/dashboard/Candidates";

function AppRoutes(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<PublicRoute><Login/></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />

            <Route path="/dashboard" element={<ProtectedRoute><RecruiterLayout><Dashboard/></RecruiterLayout></ProtectedRoute>} />

            <Route path="/jobs" element={<ProtectedRoute><RecruiterLayout><Jobs/></RecruiterLayout></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute><RecruiterLayout><Candidates/></RecruiterLayout></ProtectedRoute>} />

            <Route path="*" element={<ErrorPage />} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;