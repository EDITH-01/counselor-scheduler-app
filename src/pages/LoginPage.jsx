// src/pages/LoginPage.jsx

import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Import useAuth

const LoginPage = () => {
    const { login } = useAuth();
    
    const handleAadLogin = () => {
        if (window.location.hostname === 'localhost') {
            console.log("Mock Login Success! Redirecting to dashboard...");
            // Mocking a successful login to trigger AuthProvider's logic flow
            // In a real local setup, you'd use a mock user or the SWA CLI.
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

export default LoginPage;