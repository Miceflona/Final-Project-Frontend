// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // State untuk menampung input user
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validasi Password
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    try {
      // 2. Cek apakah email sudah terdaftar sebelumnya (GET)
      const checkUser = await axios.get(`http://localhost:3000/users?email=${formData.email}`);
      
      if (checkUser.data.length > 0) {
        setError('Email sudah terdaftar! Silakan gunakan email lain.');
        return;
      }

      // 3. Siapkan data user baru
      // Kita beri default role "seller" agar Anda bisa langsung tes halaman Dashboard
      const newUser = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "seller", 
        avatar: "https://placehold.co/100", // Avatar default
        address: "-"
      };

      // 4. Kirim ke Database (POST)
      await axios.post('http://localhost:3000/users', newUser);

      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');

    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat registrasi.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-50 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#8B4513] mb-2">Join AM-PM Coffee</h2>
        <p className="text-center text-gray-500 mb-6">Buat akun untuk mulai berjualan</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#8B4513]"
              placeholder="Contoh: Budi Barista"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#8B4513]"
              placeholder="email@contoh.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#8B4513]"
              placeholder="******"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Konfirmasi Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#8B4513]"
              placeholder="Ulangi password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#8B4513] text-white py-2 rounded hover:bg-[#A0522D] transition font-bold"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#8B4513] font-bold hover:underline">
            Login disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;