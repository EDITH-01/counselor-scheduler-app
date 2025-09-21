// Mock API service
export const api = {
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = {
      'student1': { role: 'student', name: 'John Doe', id: 1 },
      'counselor1': { role: 'counselor', name: 'Dr. Smith', id: 2 },
      'admin1': { role: 'admin', name: 'Admin User', id: 3 }
    };
    
    if (users[credentials.username] && credentials.password === 'password') {
      return { data: { user: users[credentials.username], token: 'mock-token' } };
    }
    throw new Error('Invalid credentials');
  },
  
  getAppointments: async (userId, role) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const appointments = [
      {
        id: 1,
        studentName: 'John Doe',
        counselorName: 'Dr. Smith',
        date: '2025-09-25',
        time: '10:00',
        status: 'confirmed',
        type: 'Academic Counseling'
      },
      {
        id: 2,
        studentName: 'Jane Smith',
        counselorName: 'Dr. Johnson',
        date: '2025-09-26',
        time: '14:00',
        status: 'pending',
        type: 'Career Guidance'
      }
    ];
    
    return { data: appointments };
  },
  
  getCounselors: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: [
        { id: 2, name: 'Dr. Smith', specialization: 'Academic & Career', available: true },
        { id: 3, name: 'Dr. Johnson', specialization: 'Personal Development', available: true }
      ]
    };
  },
  
  bookAppointment: async (appointmentData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, you'd find the counselor name from the ID
    const counselorName = appointmentData.counselorId === '2' ? 'Dr. Smith' : 'Dr. Johnson';
    return { data: { id: Date.now(), ...appointmentData, counselorName, status: 'pending' } };
  },
  
  updateAppointmentStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { id, status } };
  },
  
  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      data: {
        totalBookings: 156,
        pendingAppointments: 23,
        counselorWorkload: [
          { name: 'Dr. Smith', appointments: 45 },
          { name: 'Dr. Johnson', appointments: 38 }
        ]
      }
    };
  }
};