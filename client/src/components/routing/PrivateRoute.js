import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute = ({ children, role: requiredRole }) => {
    const { authenticated, loading, role } = useContext(AuthContext);

    console.log('PrivateRoute check:', { authenticated, loading, role, requiredRole });

    if (loading) {
        console.log('PrivateRoute: Still loading');
        return <div className="loading">Loading...</div>;
    }

    if (!authenticated) {
        console.log('PrivateRoute: Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // If role is specified and doesn't match, redirect to appropriate dashboard
    if (requiredRole && role !== requiredRole) {
        console.log('PrivateRoute: Role mismatch, redirecting');
        if (role === 'student') {
            return <Navigate to="/student/dashboard" replace />;
        } else if (role === 'teacher') {
            return <Navigate to="/teacher/dashboard" replace />;
        }
        // Fallback if role is unknown
        return <Navigate to="/" replace />;
    }

    console.log('PrivateRoute: Access granted');
    // User is authenticated and has correct role
    return children;
};

export default PrivateRoute;