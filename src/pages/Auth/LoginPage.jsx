// src/pages/Auth/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Pastikan install axios: npm install axios

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mencari user di db.json yang cocok
      const res = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`);
      
      if (res.data.length > 0) {
        // Login Berhasil
        const userData = res.data[0];
        localStorage.setItem('user', JSON.stringify(userData));
        alert('Login Berhasil!');
        navigate('/seller'); // Redirect ke halaman Anggota A
        window.location.reload(); // Reload agar Navbar mendeteksi perubahan
      } else {
        setError('Email atau Password salah!');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#8B4513] mb-6">Login AM-PM</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#8B4513]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#8B4513]"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#8B4513] text-white py-2 rounded hover:bg-[#A0522D] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;