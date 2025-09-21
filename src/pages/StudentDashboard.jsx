import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Notification from '../components/common/Notification';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CalendarView from '../components/dashboard/CalendarView';
import BookingForm from '../components/dashboard/BookingForm';
import { Calendar, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, counselorsRes] = await Promise.all([
          api.getAppointments(user.id, 'student'),
          api.getCounselors()
        ]);
        
        setAppointments(appointmentsRes.data);
        setCounselors(counselorsRes.data);
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to load data. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleBookAppointment = async (appointmentData) => {
    try {
      const response = await api.bookAppointment({
        ...appointmentData,
        studentId: user.id,
        studentName: user.name
      });
      
      setAppointments(prev => [...prev, response.data]);
      setNotification({
        type: 'success',
        message: 'Appointment booked successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to book appointment. Please try again.'
      });
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(`${apt.date}T${apt.time}`) > new Date())
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="border-l-4 border-blue-400 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{appointment.type}</h3>
                        <p className="text-sm text-gray-600">
                          with {appointment.counselorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Counselors</h2>
            <div className="space-y-3">
              {counselors.filter(c => c.available).map(counselor => (
                <div key={counselor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{counselor.name}</h3>
                    <p className="text-sm text-gray-600">{counselor.specialization}</p>
                  </div>
                  <div className="text-green-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <CalendarView appointments={appointments} />
        </div>
      </div>
      
      <BookingForm
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        counselors={counselors}
        onSubmit={handleBookAppointment}
      />
    </div>
  );
};

export default StudentDashboard;