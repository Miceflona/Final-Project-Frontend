// src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { getCartByUser } = useContext(CartContext);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = user ? getCartByUser(user.id).length : 0;

  const isActive = (path) => {
    return location.pathname === path ? "text-orange-400 font-bold" : "text-white hover:text-orange-200 transition";
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };
  
  const handleLogoutClick = () => {
    logout();
    closeAllMenus();
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#5c2e0c] shadow-md py-4 transition-all duration-300">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        <Link to="/" onClick={closeAllMenus} className="text-2xl font-extrabold text-white tracking-wider flex items-center gap-2">
          ☕ AM-PM <span className="text-orange-400">COFFEE</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/catalogue" className={isActive('/catalogue')}>Catalogue</Link>
          
          {user && (
            <Link to="/cart" className={`relative ${isActive('/cart')}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 text-white hover:text-orange-200 focus:outline-none">
                <img src={user.avatar || "https://placehold.co/100"} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-orange-400 object-cover"/>
                <span className="font-medium max-w-[100px] truncate">{user.fullName}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800 animate-fade-in-down border border-gray-100">
                  <div className="px-4 py-2 border-b text-xs text-gray-500">
                    {user.role === 'seller' ? '👑 Penjual' : '👤 Pembeli'}
                  </div>
                  <Link to="/profile" onClick={closeAllMenus} className="block px-4 py-2 hover:bg-orange-50 hover:text-[#8B4513] font-medium">
                    👤 Profil Saya
                  </Link>
                  <Link to="/my-orders" onClick={closeAllMenus} className="block px-4 py-2 hover:bg-orange-50 hover:text-[#8B4513] font-medium">
                    📦 Pesanan Saya
                  </Link>
                  {user.role === 'seller' && (
                    <Link to="/seller" onClick={closeAllMenus} className="block px-4 py-2 hover:bg-orange-50 hover:text-[#8B4513] font-medium">
                      🏪 Dashboard Penjual
                    </Link>
                  )}
                  <div className="border-t my-1"></div>
                  <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium">
                    🚪 Logout
                  </button>
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

        {/* MOBILE HAMBURGER BUTTON & ICONS */}
        <div className="md:hidden flex items-center space-x-4">
          {user && (
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="relative text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#4a250a] border-t border-orange-900/30 px-6 py-4 space-y-4 shadow-xl">
          <Link to="/" onClick={closeAllMenus} className="block text-white hover:text-orange-400 font-medium">Home</Link>
          <Link to="/catalogue" onClick={closeAllMenus} className="block text-white hover:text-orange-400 font-medium">Catalogue</Link>
          
          {user ? (
            <div className="border-t border-white/20 pt-4 mt-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={user.avatar} className="w-10 h-10 rounded-full" alt="Avatar"/>
                <div>
                  <p className="text-sm font-semibold text-white">{user.fullName}</p>
                  <p className="text-xs text-gray-300">{user.role === 'seller' ? '👑 Penjual' : '👤 Pembeli'}</p>
                </div>
              </div>
              <Link to="/profile" onClick={closeAllMenus} className="block text-white font-semibold py-2 hover:text-orange-300">👤 Profil</Link>
              <Link to="/my-orders" onClick={closeAllMenus} className="block text-white font-semibold py-2 hover:text-orange-300">📦 Pesanan</Link>
              {user.role === 'seller' && (
                <Link to="/seller" onClick={closeAllMenus} className="block text-white font-semibold py-2 hover:text-orange-300">🏪 Dashboard</Link>
              )}
              <button onClick={handleLogoutClick} className="block w-full text-left text-red-400 font-bold py-2 mt-2">🚪 Logout</button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
              <Link to="/login" onClick={closeAllMenus} className="block text-center text-white border border-white py-2 rounded hover:bg-white hover:text-[#5c2e0c] transition font-semibold">Login</Link>
              <Link to="/register" onClick={closeAllMenus} className="block text-center bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition font-semibold">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;