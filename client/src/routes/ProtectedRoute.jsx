import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import { Navigate} from "react-router-dom";

const ProtectedRoute = ({children}) => {

    const {loading,user} = useAuth();

    if(loading) return <div className="h-screen w-full flex items-center justify-center"><Loader size={89} /></div>

    if(!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute