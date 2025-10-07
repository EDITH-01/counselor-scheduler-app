import React from 'react'
import { Calendar } from 'lucide-react'
// import { useAuth } from '../hooks/useAuth' <-- No longer needed for login

const LoginPage = () => {
  // const { login } = useAuth() <-- No longer needed

  // New function: redirects the browser to the SWA built-in login endpoint
 const handleAadLogin = () => {
  if (window.location.hostname === 'localhost') {
    // ⚠️ For local testing only: Mock a successful login here.
    // In a real app, you would set some local state or cookie.
    alert("Mock Login Success! Redirecting to dashboard...");
    window.location.href = '/'; 
  } else {
    // For production/deployed environment
    window.location.href = '/.auth/login/aad';
  }
} 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-xl">
        {/* ... (rest of the UI structure) ... */}

        <div className="space-y-4">
          <button
            // UPDATE: Calls the redirect function instead of the custom hook
            onClick={handleAadLogin} 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          >
            Sign in with Microsoft (AAD)
          </button>
        </div>

        {/* ... (rest of the UI structure) ... */}
      </div>
    </div>
  )
}

export default LoginPage