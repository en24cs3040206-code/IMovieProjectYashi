import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('imovies_token');
      const savedUser = localStorage.getItem('imovies_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Validate token with server
          const res = await authService.getMe();
          if (res.data && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('imovies_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data && res.data.success) {
      const { token, user: loggedUser } = res.data;
      localStorage.setItem('imovies_token', token);
      localStorage.setItem('imovies_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data && res.data.success) {
      const { token, user: newUser } = res.data;
      localStorage.setItem('imovies_token', token);
      localStorage.setItem('imovies_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.data && res.data.success) {
      const updatedUser = res.data.data;
      localStorage.setItem('imovies_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
    throw new Error(res.data?.message || 'Update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
