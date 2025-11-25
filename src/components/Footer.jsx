// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1a0f08] via-[#2D1B0E] to-[#3d2415] text-white pt-16 pb-8 mt-auto border-t-4 border-amber-700 shadow-2xl relative overflow-hidden">
      {/* Coffee Bean Background Pattern */}
      <div className="absolute top-0 right-0 text-9xl opacity-5">☕</div>
      <div className="absolute bottom-0 left-0 text-9xl opacity-5">☕</div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Kolom 1: Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-3 rounded-full shadow-xl">
                <span className="text-3xl">☕</span>
              </div>
              <h2 className="text-3xl font-extrabold">
                AM-PM <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">COFFEE</span>
              </h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-md">
              Menyajikan kopi premium dari biji pilihan terbaik petani lokal Indonesia. 
              Teman setia produktivitas Anda dari pagi hingga malam hari. ☕✨
            </p>
            <p className="text-amber-400 font-semibold italic text-sm">
              "Where every cup tells a story"
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 flex items-center gap-2">
              <span>🔗</span> Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Home
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Catalogue
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span> Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Contact */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 flex items-center gap-2">
              <span>📞</span> Hubungi Kami
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start gap-3 hover:text-amber-400 transition-colors">
                <span className="text-xl">📍</span>
                <span>Jl. Sudirman No. 123,<br/>Jakarta Pusat 10110</span>
              </li>
              <li className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <span className="text-xl">📱</span>
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <span className="text-xl">✉️</span>
                <span>hello@ampmcoffee.com</span>
              </li>
              <li className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <span className="text-xl">🕐</span>
                <span>Setiap hari, 06:00 - 23:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Coffee Quote */}
        <div className="border-t border-amber-900/30 pt-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <a href="#" className="bg-amber-800/50 hover:bg-amber-700 p-3 rounded-full transition-all transform hover:scale-110 shadow-lg">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="bg-amber-800/50 hover:bg-amber-700 p-3 rounded-full transition-all transform hover:scale-110 shadow-lg">
                <span className="text-xl">📷</span>
              </a>
              <a href="#" className="bg-amber-800/50 hover:bg-amber-700 p-3 rounded-full transition-all transform hover:scale-110 shadow-lg">
                <span className="text-xl">🐦</span>
              </a>
            </div>
            <p className="text-amber-400 font-bold text-sm">
              ☕ Follow us for daily coffee inspiration!
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-amber-900/30 pt-6 text-center">
          <p className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} <span className="text-amber-500 font-bold">AM-PM Coffee</span>. All rights reserved. 
            <span className="hidden md:inline"> | Crafted with ❤️ and ☕</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;