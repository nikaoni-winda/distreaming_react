import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Admin Route
export const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />; // Redirect to home instead of login
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Guest Route
export const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (user) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
    }

    return children;
};
