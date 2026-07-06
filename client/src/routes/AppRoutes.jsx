import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "../pages/landing/Home";

function AppRoutes(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<h1>Login Page</h1>} />
            <Route path="/register" element={<h1>Register Page</h1>} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;