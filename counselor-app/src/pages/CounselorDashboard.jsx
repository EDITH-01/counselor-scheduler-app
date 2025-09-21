import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Notification from '../components/common/Notification';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CalendarView from '../components/dashboard/CalendarView';

const CounselorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.getAppointments(user.id, 'counselor');
        setAppointments(response.data);
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to load appointments. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user.id]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await api.updateAppointmentStatus(appointmentId, status);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );
      setNotification({
        type: 'success',
        message: `Appointment ${status} successfully!`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update appointment. Please try again.'
      });
    }
  };

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Counselor Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pending Appointments ({pendingAppointments.length})
            </h2>
            {pendingAppointments.length === 0 ? (
              <p className="text-gray-500">No pending appointments</p>
            ) : (
              <div className="space-y-4">
                {pendingAppointments.map(appointment => (
                  <div key={appointment.id} className="border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.studentName}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pending
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(appointment.id, 'rejected')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmed Appointments ({confirmedAppointments.length})
            </h2>
            {confirmedAppointments.length === 0 ? (
              <p className="text-gray-500">No confirmed appointments</p>
            ) : (
              <div className="space-y-4">
                {confirmedAppointments.map(appointment => (
                  <div key={appointment.id} className="border-l-4 border-green-400 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.studentName}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                      <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Confirmed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <CalendarView appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;