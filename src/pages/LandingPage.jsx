// src/pages/LandingPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const isSeller = user?.role === 'seller';

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div 
        className="relative h-[600px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop')" }}
      >
        {/* Overlay Gelap agar tulisan terbaca */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative container mx-auto px-6 text-white text-center md:text-left z-10">
          {isSeller ? (
            <>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in">
                Selamat Datang, <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Penjual AM-PM!</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed">
                Kelola produk Anda dengan mudah. Tambahkan produk baru, edit informasi, 
                dan pantau penjualan Anda di satu tempat.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/seller/myproducts" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-2xl"
                >
                  📦 Kelola Produk
                </Link>
                <Link 
                  to="/seller/add-product" 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-2xl"
                >
                  ➕ Tambah Produk
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in">
                Start Your Day with <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">AM-PM Coffee</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed">
                Rasakan kenikmatan biji kopi pilihan yang diseduh dengan hati. 
                Siap menemani produktivitasmu dari pagi hingga malam.
              </p>
              <Link 
                to="/catalogue" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-2xl inline-block"
              >
                ☕ Pesan Sekarang
              </Link>
            </>
          )}
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-orange-700 mb-16">
            {isSeller ? '🎯 Fitur untuk Penjual' : '✨ Kenapa AM-PM?'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {isSeller ? (
              <>
                {/* Seller Feature 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="text-6xl mb-6">📊</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Dashboard Lengkap</h3>
                  <p className="text-gray-600 leading-relaxed">Pantau semua produk Anda dalam satu dashboard yang mudah digunakan.</p>
                </div>
                
                {/* Seller Feature 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="text-6xl mb-6">✏️</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit Mudah</h3>
                  <p className="text-gray-600 leading-relaxed">Update informasi produk kapan saja dengan interface yang intuitif.</p>
                </div>
                
                {/* Seller Feature 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Manajemen Cepat</h3>
                  <p className="text-gray-600 leading-relaxed">Tambah, edit, dan hapus produk hanya dalam hitungan detik.</p>
                </div>
              </>
            ) : (
              <>
                {/* Buyer Feature 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="text-6xl mb-6">☕</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Biji Kopi Premium</h3>
                  <p className="text-gray-600 leading-relaxed">Diambil langsung dari petani lokal terbaik untuk rasa otentik.</p>
                </div>
                
                {/* Buyer Feature 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Pengiriman Cepat</h3>
                  <p className="text-gray-600 leading-relaxed">Kopi hangat sampai di tangan Anda dalam hitungan menit.</p>
                </div>
                
                {/* Buyer Feature 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className="text-6xl mb-6">❤️</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Dibuat dengan Cinta</h3>
                  <p className="text-gray-600 leading-relaxed">Barista kami menyajikan setiap cangkir dengan detail sempurna.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="py-16 bg-gradient-to-r from-[#8B4513] to-orange-700 text-white text-center">
        <div className="container mx-auto px-6">
          {isSeller ? (
            <>
              <h2 className="text-4xl font-extrabold mb-6">Siap Mengelola Produk?</h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto">Mulai kelola inventori Anda dan tingkatkan penjualan hari ini</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/seller/myproducts" 
                  className="bg-white text-[#8B4513] hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-xl inline-block"
                >
                  📋 Lihat Produk Saya
                </Link>
                <Link 
                  to="/catalogue" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-xl inline-block"
                >
                  👁️ Lihat Katalog
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-extrabold mb-6">Mulai Memesan Sekarang</h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto">Jelajahi berbagai pilihan kopi dan minuman kami yang lezat</p>
              <Link 
                to="/catalogue" 
                className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-xl inline-block"
              >
                🍵 Lihat Menu Lengkap
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;