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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-10 px-4 mt-16 relative overflow-hidden">
      {/* Coffee Bean Decorations */}
      <div className="absolute top-20 right-10 text-7xl opacity-10 animate-pulse">☕</div>
      <div className="absolute bottom-10 left-10 text-6xl opacity-10 animate-bounce">🫘</div>
      <div className="absolute top-1/2 left-20 text-5xl opacity-10">☕</div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Coffee Cup Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-br from-amber-800 to-orange-900 p-4 rounded-full shadow-2xl mb-4 animate-bounce">
            <span className="text-5xl">☕</span>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 mb-2">
            AM-PM Coffee
          </h1>
          <p className="text-gray-600 font-semibold">Bergabunglah dengan keluarga coffee lovers</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-amber-200">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-orange-600 mb-2">
            Daftar Sekarang
          </h2>
          <p className="text-center text-gray-600 mb-6 font-medium">Buat akun untuk mulai berbelanja atau berjualan</p>
          
          {error && (
            <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold shadow-lg animate-shake">
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center gap-2">
                <span>👤</span> Nama Lengkap
              </label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all bg-amber-50/50 font-medium"
                placeholder="Contoh: Budi Barista"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center gap-2">
                <span>📧</span> Email
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all bg-amber-50/50 font-medium"
                placeholder="email@contoh.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center gap-2">
                <span>🔒</span> Password
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all bg-amber-50/50 font-medium"
                placeholder="Minimal 3 karakter"
                required
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center gap-2">
                <span>🔐</span> Konfirmasi Password
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all bg-amber-50/50 font-medium"
                placeholder="Ulangi password"
                required
                disabled={loading}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center gap-2">
                <span>🎭</span> Tipe Akun
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all bg-amber-50/50 font-bold cursor-pointer"
                disabled={loading}
              >
                <option value="buyer">🛒 Pembeli (Customer)</option>
                <option value="seller">🏪 Penjual (Seller)</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 text-white py-4 rounded-xl hover:from-amber-800 hover:via-orange-800 hover:to-red-800 transition-all transform hover:scale-105 hover:shadow-2xl font-bold text-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-xl mt-2"
              disabled={loading}
            >
              {loading ? '⏳ Sedang memproses...' : '🚀 Daftar Sekarang'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 font-medium">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 font-bold hover:underline transition-all">
              Login disini →
            </Link>
          </p>
        </div>

        {/* Coffee Quote */}
        <div className="mt-6 text-center">
          <p className="text-amber-800 font-semibold italic text-sm">
            "Coffee is always a good idea" ☕✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;