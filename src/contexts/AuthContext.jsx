import React, { useState, createContext, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true

    useEffect(() => {
        // This function checks if a user session exists
        const getUser = async () => {
            try {
                const response = await fetch('/.auth/me');
                const data = await response.json();
                
                let principal = data.clientPrincipal;
                
                if (principal) {
                    // ⭐️ FIX: Extract roles from the array and assign a single 'role' property
                    const roles = principal.userRoles || []; // Ensure roles is an array
                    let primaryRole = null; 

                    // Define priority: Admin > Counselor > Student
                    if (roles.includes('admin')) {
                        primaryRole = 'admin';
                    } else if (roles.includes('counselor')) {
                        primaryRole = 'counselor';
                    } else if (roles.includes('student')) {
                        primaryRole = 'student';
                    }
                    
                    // Attach the determined primary role to the principal object
                    // AppRouter.jsx now correctly receives user.role
                    principal.role = primaryRole;
                }

                // The clientPrincipal (now with the 'role' property) is saved to state
                setUser(principal); 
            } catch (error) {
                console.error("Could not fetch user authentication status.", error);
            } finally {
                // We are done checking, so set loading to false
                setLoading(false);
            }
        };

        getUser();
    }, []); // The empty array ensures this runs only once when the app loads

    // These functions don't need async/await because they are simple redirects.
    // Azure handles the entire login/logout flow after the redirect.
    const login = (provider) => {
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
