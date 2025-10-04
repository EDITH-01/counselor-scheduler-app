import React, { useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useRouter } from '@hooks/useRouter'
import LoginPage from '@pages/LoginPage'
import StudentDashboard from '@pages/StudentDashboard'
import CounselorDashboard from '@pages/CounselorDashboard'
import AdminDashboard from '@pages/AdminDashboard'
import LoadingSpinner from '@components/common/LoadingSpinner'

const AppRouter = () => {
  const { user, loading } = useAuth()
  const { currentRoute, navigate } = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user && currentRoute !== '/login') {
        navigate('/login')
      } else if (user && (currentRoute === '/login' || currentRoute === '/')) {
        const dashboardRoute =
          user.role === 'student'
            ? '/student'
            : user.role === 'counselor'
            ? '/counselor'
            : '/admin'
        navigate(dashboardRoute)
      }
    }
  }, [user, loading, currentRoute, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const hasAccess = (route) => {
    if (!user) return false
    if (route.startsWith('/student') && user.role !== 'student') return false
    if (route.startsWith('/counselor') && user.role !== 'counselor') return false
    if (route.startsWith('/admin') && user.role !== 'admin') return false
    return true
  }

  const renderRoute = () => {
    if (!user) return <LoginPage />

    if (!hasAccess(currentRoute)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }

    switch (currentRoute) {
      case '/login':
        return <LoginPage />
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

export default AppRouter
