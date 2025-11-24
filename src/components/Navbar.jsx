// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  // State untuk Menu Mobile & Profile Dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Cek Login saat halaman dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload(); 
    navigate('/login');
  };

  // Helper untuk class active link
  const isActive = (path) => {
    // Jika aktif teks oranye, jika tidak putih
    return location.pathname === path ? "text-orange-400 font-bold" : "text-white hover:text-orange-200 transition";
  };

  return (
    // PERUBAHAN DISINI: 
    // Hapus logic transparan. Kita kunci warnanya jadi bg-[#5c2e0c] (Cokelat Tua)
    // Tambahkan shadow-md agar ada bayangan sedikit
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#5c2e0c] shadow-md py-4 transition-all duration-300">
      
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold text-white tracking-wider flex items-center gap-2">
          ☕ AM-PM <span className="text-orange-400">COFFEE</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/catalogue" className={isActive('/catalogue')}>Catalogue</Link>
          
          {/* LOGIC AUTH */}
          {user ? (
            <div className="relative">
              {/* Profile Trigger */}
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-white hover:text-orange-200 focus:outline-none"
              >
                <img 
                  src={user.avatar || "https://placehold.co/100"} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border-2 border-orange-400 object-cover"
                />
                <span className="font-medium max-w-[100px] truncate">{user.fullName}</span>
                {/* Icon Panah Bawah */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800 animate-fade-in-down border border-gray-100">
                  <div className="px-4 py-2 border-b text-xs text-gray-500">Halo, {user.role}</div>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-orange-50 hover:text-[#8B4513]">My Profile</Link>
                  {user.role === 'seller' && (
                    <Link to="/seller" className="block px-4 py-2 hover:bg-orange-50 hover:text-[#8B4513]">Seller Dashboard</Link>
                  )}
                  <div className="border-t my-1"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-orange-200 font-medium">Login</Link>
              <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-bold transition transform hover:scale-105 shadow-lg text-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#4a250a] border-t border-orange-900/30 px-6 py-4 space-y-4 shadow-xl">
          <Link to="/" className="block text-white hover:text-orange-400 font-medium">Home</Link>
          <Link to="/catalogue" className="block text-white hover:text-orange-400 font-medium">Catalogue</Link>
          
          {user ? (
            <>
              <div className="border-t border-white/20 pt-4 mt-2">
                <div className="flex items-center gap-3 mb-3">
                    <img src={user.avatar} className="w-8 h-8 rounded-full"/>
                    <p className="text-sm text-gray-300">Logged in as {user.fullName}</p>
                </div>
                <Link to="/profile" className="block text-white font-semibold py-2 hover:text-orange-300">My Profile</Link>
                {user.role === 'seller' && (
                    <Link to="/seller" className="block text-white font-semibold py-2 hover:text-orange-300">Seller Dashboard</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left text-red-400 font-bold py-2 mt-2">Logout</button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <Link to="/login" className="block text-center text-white border border-white py-2 rounded hover:bg-white hover:text-[#5c2e0c] transition">Login</Link>
              <Link to="/register" className="block text-center bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;