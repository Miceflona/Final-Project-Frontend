// src/pages/Auth/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  
  // State untuk menampung input user
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (formData.password.length < 3) {
      setError('Password minimal 3 karakter');
      return;
    }

    setLoading(true);

    try {
      // 2. Panggil fungsi register dari AuthContext (POST)
      await register(formData.fullName, formData.email, formData.password, formData.role);

      alert('Registrasi Berhasil! Silakan Login.');
      navigate('/login');

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat registrasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-50 py-10 px-4 mt-16">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#8B4513] mb-2">Join AM-PM Coffee</h2>
        <p className="text-center text-gray-500 mb-6">Buat akun untuk mulai berbelanja atau berjualan</p>
        
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
              disabled={loading}
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
              disabled={loading}
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
              placeholder="Minimal 3 karakter"
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Tipe Akun</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#8B4513]"
              disabled={loading}
            >
              <option value="buyer">Pembeli</option>
              <option value="seller">Penjual</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#8B4513] text-white py-2 rounded hover:bg-[#A0522D] transition font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
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