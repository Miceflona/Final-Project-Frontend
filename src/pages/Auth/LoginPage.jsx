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
    <div className="flex justify-center items-center min-h-screen bg-orange-50 px-4 mt-16">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-6">Login</h2>
        
        {error && <p className="bg-red-100 text-red-700 text-center p-3 rounded-lg mb-4">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-[#8B4513] text-white py-3 rounded-lg font-semibold hover:bg-[#A0522D] transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#8B4513] hover:underline font-semibold">
            Daftar di sini
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold text-blue-900 mb-2">Demo Credentials:</p>
          <p className="text-blue-800"><strong>Seller:</strong> test@toko.com / 123</p>
          <p className="text-blue-800"><strong>Buyer:</strong> c@toko.com / 123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;