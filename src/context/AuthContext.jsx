// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Buat Context
export const AuthContext = createContext();

const API_URL = 'http://localhost:3000';

// 2. Buat custom hook untuk kemudahan penggunaan
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Buat Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cek localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk login - GET request untuk validasi user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/users`);
      const users = response.data;
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Email atau password salah');
      }

      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      return foundUser;
    } catch (err) {
      const message = err.message || 'Login gagal';
      setError(message);
      throw new Error(message);
    }
  };

  // Fungsi untuk register - POST request
  const register = async (fullName, email, password, role = 'buyer') => {
    try {
      setError(null);
      
      // Cek apakah email sudah terdaftar
      const checkResponse = await axios.get(`${API_URL}/users`);
      const emailExists = checkResponse.data.some(u => u.email === email);
      
      if (emailExists) {
        throw new Error('Email sudah terdaftar');
      }

      const newUser = {
        id: `user_${Date.now()}`,
        fullName,
        email,
        password,
        role,
        avatar: 'https://placehold.co/100',
        address: '-'
      };

      const response = await axios.post(`${API_URL}/users`, newUser);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      const message = err.message || 'Registrasi gagal';
      setError(message);
      throw new Error(message);
    }
  };

  // Fungsi untuk logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // Fungsi untuk update profile - PUT request
  const updateProfile = async (userId, updates) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/users/${userId}`, updates);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      const message = 'Update profil gagal';
      setError(message);
      throw new Error(message);
    }
  };

  // Nilai yang akan disediakan oleh provider
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isSeller: user?.role === 'seller'
  };

  // Jangan render children sebelum selesai loading data dari localStorage
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
