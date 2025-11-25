// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div 
        className="relative h-[500px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop')" }}
      >
        {/* Overlay Gelap agar tulisan terbaca */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative container mx-auto px-6 text-white text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Start Your Day with <br /> 
            <span className="text-orange-400">AM-PM Coffee</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg">
            Rasakan kenikmatan biji kopi pilihan yang diseduh dengan hati. 
            Siap menemani produktivitasmu dari pagi hingga malam.
          </p>
          <Link 
            to="/catalogue" 
            className="bg-[#8B4513] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="py-16 bg-orange-50 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#8B4513] mb-12">Kenapa AM-PM?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-bold mb-2">Biji Kopi Premium</h3>
              <p className="text-gray-600">Diambil langsung dari petani lokal terbaik untuk rasa otentik.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Pengiriman Cepat</h3>
              <p className="text-gray-600">Kopi hangat sampai di tangan Anda dalam hitungan menit.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold mb-2">Dibuat dengan Cinta</h3>
              <p className="text-gray-600">Barista kami menyajikan setiap cangkir dengan detail sempurna.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-12 bg-[#8B4513] text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Mulai Memesan Sekarang</h2>
          <p className="text-lg mb-8">Jelajahi berbagai pilihan kopi dan minuman kami yang lezat</p>
          <Link 
            to="/catalogue" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg inline-block"
          >
            Lihat Menu Lengkap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;