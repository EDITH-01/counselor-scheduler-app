// Internal storage for the mock token, simulating an Authorization header
let currentAuthToken = null;

// Utility function required by AuthContext to set/clear the token
export const setAuthToken = (token) => {
  currentAuthToken = token;
  // This console log helps you track when the token is being set/cleared
  console.log(`[API MOCK] Auth token set to: ${token ? 'PRESENT' : 'NULL'}`);
};

// Mock API service object
export const api = {

  // ------------------------------------------------
  // AUTHENTICATION
  // ------------------------------------------------
  login: async (credentials) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 1. Logic to handle the 'aad' provider string from the LoginPage
    if (credentials === 'aad') {
        // Mock a successful AAD login for the test user (Admin)
        const user = { role: 'admin', name: 'AAD Admin User', id: '220701230' };
        const token = 'mock-aad-token-' + user.id;
        console.log(`[API MOCK] Mock AAD login successful for ${user.name}`);
        return { data: { user: user, token: token } };
    }
    
    // 2. Logic for traditional username/password login
    const users = {
      // Mock Users: password is 'password' for all
      'student1': { role: 'student', name: 'John Doe', id: 1 },
      'counselor1': { role: 'counselor', name: 'Dr. Smith', id: 2 },
      'admin1': { role: 'admin', name: 'Admin User', id: 3 }
    };
    
    // Ensure credentials is an object with username property for the lookup
    if (credentials && credentials.username) {
        if (users[credentials.username] && credentials.password === 'password') {
            const mockToken = `mock-token-${credentials.username}`;
            console.log(`[API MOCK] Login successful for ${credentials.username}`);
            return { data: { user: users[credentials.username], token: mockToken } };
        }
    }
    
    console.error(`[API MOCK] Login failed.`);
    throw new Error('Invalid credentials');
  },
  
  // ------------------------------------------------
  // DATA FETCHES & MUTATIONS (Original Mock Functions)
  // ------------------------------------------------
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