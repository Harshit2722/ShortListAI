import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";
import { Navigate} from "react-router-dom";

const PublicRoute = ({children}) => {

    const {loading,user} = useAuth();

    if(loading) return <Loader size={150} />

    if(user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PublicRoute