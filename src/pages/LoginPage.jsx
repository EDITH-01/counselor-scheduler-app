import React from 'react'
import { useAuth } from '@hooks/useAuth'
import { Calendar } from 'lucide-react'

const LoginPage = () => {
  const { login } = useAuth()

  const handleAadLogin = () => {
    login('aad')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-xl">
        <div>
          <div className="flex justify-center">
            <Calendar className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Counselor Scheduler
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You must sign in securely to access the system.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleAadLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          >
            Sign in with Microsoft (AAD)
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 border-t pt-4">
          <p className="font-semibold text-gray-700 mb-1">Testing Roles Assigned:</p>
          <p>Admin: {`220701230@...`} (Current User)</p>
          <p className="text-sm">Deployment will redirect this user to the Admin Dashboard upon login.</p>
        </div>
      </div>
    </div>
  )  
}

export default LoginPage
