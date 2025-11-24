// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#2D1B0E] text-white pt-12 pb-6 mt-auto border-t-4 border-[#8B4513]">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Kolom 1: Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              ☕ AM-PM <span className="text-orange-500">COFFEE</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Menyajikan kopi terbaik dari biji pilihan petani lokal. 
              Teman setia produktivitas Anda dari pagi hingga malam hari.
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-200">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/catalogue" className="hover:text-white transition">Catalogue</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Login / Register</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-orange-200">Hubungi Kami</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <span>📍</span> Jl. Sudirman No. 123, Jakarta
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> +62 812 3456 7890
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span> hello@ampmcoffee.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} AM-PM Coffee. All rights reserved. 
            <span className="hidden md:inline"> | Designed by Kelompok 3</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;