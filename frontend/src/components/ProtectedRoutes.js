import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        // Save the attempted location
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
    }

    if (!user.isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const PublicOnlyRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (user) {
        return <Navigate to={location.state?.from || '/'} replace />;
    }

    return children;
};
