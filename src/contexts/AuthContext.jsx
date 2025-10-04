import React, { useState, createContext, useEffect } from 'react';
// Assuming your api.js exports both the 'api' object and a new 'setAuthToken' function
import { api, setAuthToken } from '../api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // 1. Set Auth Header when session is restored
      setAuthToken(token); 
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Renamed 'credentials' to 'providerOrCredentials' to hint at its dual use
  // as either an AAD provider identifier OR a username/password object.
  const login = async (providerOrCredentials) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // The API layer will decide how to handle the input (e.g., if 'aad', initiate redirect)
      const response = await api.login(providerOrCredentials); 
      
      // If the API call returns successfully (e.g., after a direct login or a token exchange)
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 2. Set Auth Header immediately after successful login
      setAuthToken(token); 
      setUser(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 3. Clear Auth Header on logout
    setAuthToken(null); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};