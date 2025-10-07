import React, { useState, createContext, useEffect, useContext } from 'react';
import { Calendar, Users, Briefcase, LogOut, Loader2 } from 'lucide-react';

// =================================================================
// 1. CONTEXT & HOOKS (Recreated inside this file)
// =================================================================

// --- 1.1 Auth Context ---
export const AuthContext = createContext();

// --- 1.2 useAuth Hook ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// --- 1.3 useRouter Hook (Mock Implementation) ---
const useRouter = () => {
    // Simple state management for the current route
    const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setCurrentRoute(window.location.pathname);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setCurrentRoute(path);
    };

    return { currentRoute, navigate };
};

// =================================================================
// 2. AUTH PROVIDER (Updated with Role Mapping)
// =================================================================

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                // Fetch the user session from Azure Static Web Apps
                const response = await fetch('/.auth/me');
                const data = await response.json();
                
                let principal = data.clientPrincipal;
                
                if (principal) {
                    // ⭐️ FIX: Determine the primary role for the AppRouter
                    const roles = principal.userRoles || []; 
                    let primaryRole = null; 

                    // Define role priority: Admin > Counselor > Student
                    if (roles.includes('admin')) {
                        primaryRole = 'admin';
                    } else if (roles.includes('counselor')) {
                        primaryRole = 'counselor';
                    } else if (roles.includes('student')) {
                        primaryRole = 'student';
                    }
                    
                    // Assign the determined primary role for AppRouter to use
                    principal.role = primaryRole;
                }

                setUser(principal); 
            } catch (error) {
                console.error("Could not fetch user authentication status.", error);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []); 

    const login = (provider) => {
        // We use AAD in the example, but the function supports others
        window.location.href = `/.auth/login/${provider}`;
    };

    const logout = () => {
        window.location.href = '/.auth/logout';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


// =================================================================
// 3. COMMON COMPONENTS (MOCK)
// =================================================================

const LoadingSpinner = () => (
    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
);

// =================================================================
// 4. PAGE COMPONENTS (MOCK)
// =================================================================

const DashboardLayout = ({ title, children }) => {
    const { logout, user } = useAuth();
    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <header className="flex justify-between items-center p-4 bg-white shadow rounded-lg mb-6">
                <h1 className="text-3xl font-extrabold text-indigo-700">{title}</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600">
                        {user.userDetails} ({user.role})
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition duration-150 p-2 rounded-lg bg-red-50 hover:bg-red-100"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>
            <main className="p-6 bg-white shadow-xl rounded-xl">
                {children}
            </main>
        </div>
    );
};

const StudentDashboard = () => (
    <DashboardLayout title="Student Dashboard">
        <p className="text-lg text-gray-700">Welcome, Student! Check your schedule and course materials.</p>
        <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
            <h3 className="font-semibold text-indigo-700">Your Next Class</h3>
            <p>Mathematics - Room 301, Today at 2:00 PM</p>
        </div>
    </DashboardLayout>
);

const CounselorDashboard = () => (
    <DashboardLayout title="Counselor Portal">
        <p className="text-lg text-gray-700">Welcome, Counselor! Manage student appointments and records.</p>
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <h3 className="font-semibold text-green-700">Appointments</h3>
            <p>You have 5 appointments scheduled today.</p>
        </div>
    </DashboardLayout>
);

const AdminDashboard = () => (
    <DashboardLayout title="Administrator Panel">
        <p className="text-lg text-gray-700">Welcome, Admin! Oversee system settings and user management.</p>
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <h3 className="font-semibold text-red-700">System Alerts</h3>
            <p>Database backup overdue. Action required!</p>
        </div>
    </DashboardLayout>
);

const LoginPage = () => {
    const { login } = useAuth();
    const handleAadLogin = () => {
        if (window.location.hostname === 'localhost') {
            // NOTE: Alert replaced with console log and navigate to avoid alert() issue.
            console.log("Mock Login Success! Redirecting to dashboard...");
            // Redirecting to root will trigger the AuthProvider's logic flow
            window.location.href = '/'; 
        } else {
            // For production/deployed environment
            login('aad');
        }
    } 

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-xl">
                <div className="flex flex-col items-center">
                    <Calendar className="h-12 w-12 text-indigo-600 mb-2" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Use your organizational credentials.
                    </p>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={handleAadLogin} 
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                    >
                        <Users className="w-5 h-5 mr-3" />
                        Sign in with Microsoft (AAD)
                    </button>
                </div>
            </div>
        </div>
    )
}

// =================================================================
// 5. MAIN ROUTER COMPONENT (AppRouter.jsx Logic)
// =================================================================

const AppRouter = () => {
    // Hooks are now available as they are defined in this single file
    const { user, loading } = useAuth()
    const { currentRoute, navigate } = useRouter()

    useEffect(() => {
        if (!loading) {
            // Rule 1: Not logged in, but not on /login -> Redirect to /login
            if (!user && currentRoute !== '/login') {
                navigate('/login')
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
                        : '/login'; // Fallback if role is null/unknown
                navigate(dashboardRoute)
            }
        }
    }, [user, loading, currentRoute, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        )
    }

    // Role-Based Access Control (RBAC) Logic
    const hasAccess = (route) => {
        // If not authenticated or role is null (e.g., failed role assignment)
        if (!user || !user.role) return false
        
        // Deny access if user's role does not match the route prefix
        if (route.startsWith('/student') && user.role !== 'student') return false
        if (route.startsWith('/counselor') && user.role !== 'counselor') return false
        if (route.startsWith('/admin') && user.role !== 'admin') return false
        
        return true
    }

    const renderRoute = () => {
        // If unauthenticated, show the login page
        if (!user) return <LoginPage />

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
            )
        }

        // Render the allowed dashboard component
        switch (currentRoute) {
            case '/login':
            case '/':
                // Should have been redirected by useEffect, but render default if not
                return user.role === 'student' ? <StudentDashboard /> : user.role === 'counselor' ? <CounselorDashboard /> : <AdminDashboard />;
            case '/student':
                return <StudentDashboard />
            case '/counselor':
                return <CounselorDashboard />
            case '/admin':
                return <AdminDashboard />
            default:
                return <LoginPage />
        }
    }

    return renderRoute()
}

// =================================================================
// 6. ROOT APPLICATION WRAPPER
// =================================================================

const App = () => (
    <AuthProvider>
        <AppRouter />
    </AuthProvider>
);

export default App;
