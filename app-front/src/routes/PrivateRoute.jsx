import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/auth/sign-up" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;