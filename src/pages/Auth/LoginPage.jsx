// src/pages/Auth/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Email atau Password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 mt-16 relative overflow-hidden">
      {/* Coffee Bean Decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">☕</div>
      <div className="absolute bottom-20 right-20 text-8xl opacity-10 animate-pulse delay-700">☕</div>
      <div className="absolute top-1/3 right-10 text-5xl opacity-10 animate-bounce">🫘</div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Coffee Cup Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-br from-amber-800 to-orange-900 p-4 rounded-full shadow-2xl mb-4 animate-bounce">
            <span className="text-5xl">☕</span>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 mb-2">
            AM-PM Coffee
          </h1>
          <p className="text-gray-600 font-medium">Masuk untuk menikmati kopi terbaik</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-amber-200">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-orange-600 mb-6">
            Selamat Datang
          </h2>
          
          {error && (
            <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-400 text-red-800 text-center p-4 rounded-xl mb-6 font-semibold shadow-lg animate-shake">
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-800 font-bold mb-2 flex items-center gap-2">
                <span>📧</span> Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all bg-amber-50/50 font-medium"
                placeholder="nama@email.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-800 font-bold mb-2 flex items-center gap-2">
                <span>🔒</span> Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition-all bg-amber-50/50 font-medium"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-800 hover:via-orange-800 hover:to-red-800 transition-all transform hover:scale-105 hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
              disabled={loading}
            >
              {loading ? '⏳ Sedang masuk...' : '☕ Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 font-medium">
              Belum punya akun?{' '}
              <Link to="/register" className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 font-bold hover:underline transition-all">
                Daftar Sekarang →
              </Link>
            </p>
          </div>
        </div>

        {/* Coffee Quote */}
        <div className="mt-6 text-center">
          <p className="text-amber-800 font-semibold italic text-sm">
            "Life begins after coffee" ☕
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;