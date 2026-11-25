
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "@/context/useAuth";

function PrivateRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/sign-up" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;
