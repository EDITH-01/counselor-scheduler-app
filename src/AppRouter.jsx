// src/AppRouter.jsx

import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth'; // Import from AuthProvider
import {useRouter} from './hooks/useRouter'; // Import from useRouter
import LoadingSpinner from './components/common/LoadingSpinner'; // Import common components

// Import Page Components
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import AdminDashboard from './pages/AdminDashboard';

const AppRouter = () => {
    const { user, loading } = useAuth();
    const { currentRoute, navigate } = useRouter();

    useEffect(() => {
        if (!loading) {
            // Rule 1: Not logged in, but not on /login -> Redirect to /login
            if (!user && currentRoute !== '/login') {
                navigate('/login');
            } 
            // Rule 2: Logged in, currently on / or /login -> Redirect to appropriate dashboard
            else if (user && (currentRoute === '/login' || currentRoute === '/')) {
                const dashboardRoute =
                    user.role === 'student'
                        ? '/student'
                        : user.role === 'counselor'
                        ? '/counselor'
                        : user.role === 'admin'
                        ? '/admin'
                        : '/login'; 
                navigate(dashboardRoute);
            }
        }
    }, [user, loading, currentRoute, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    // Role-Based Access Control (RBAC) Logic
    const hasAccess = (route) => {
        // If not authenticated or role is null
        if (!user || !user.role) return false;
        
        // Deny access if user's role does not match the route prefix
        if (route.startsWith('/student') && user.role !== 'student') return false;
        if (route.startsWith('/counselor') && user.role !== 'counselor') return false;
        if (route.startsWith('/admin') && user.role !== 'admin') return false;
        
        return true;
    };

    const renderRoute = () => {
        // If unauthenticated, show the login page
        if (!user) return <LoginPage />;

        // If authenticated but lacks access to the current route
        if (!hasAccess(currentRoute)) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-8 bg-white shadow-xl rounded-xl">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition duration-150 shadow-md"
                        >
                            Go to Your Home Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        // Render the allowed dashboard component
        switch (currentRoute) {
            case '/login':
            case '/':
                // After redirection, render based on the user's determined role
                if (user.role === 'student') return <StudentDashboard />;
                if (user.role === 'counselor') return <CounselorDashboard />;
                if (user.role === 'admin') return <AdminDashboard />;
                return <LoginPage />; // Fallback
            case '/student':
                return <StudentDashboard />;
            case '/counselor':
                return <CounselorDashboard />;
            case '/admin':
                return <AdminDashboard />;
            default:
                // For any other undefined route while logged in, redirect to home
                navigate('/');
                return <LoadingSpinner />; // Show spinner while redirecting
        }
    };

    return renderRoute();
};

export default AppRouter;