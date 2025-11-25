// src/pages/CataloguePage.jsx
import { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function CataloguePage() {
  const { products, fetchProducts, loading, error } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isSeller = user?.role === 'seller';
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-orange-700 mb-4">
            {isSeller ? '📦 Katalog Produk - Mode Penjual' : '☕ Katalog Produk'}
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            {isSeller 
              ? 'Lihat semua produk yang tersedia di toko. Anda dapat mengelola produk Anda di halaman "Produk Saya"' 
              : 'Pilih kopi dan minuman favorit Anda dari koleksi premium kami'}
          </p>
        </div>

        {/* --- FILTER SECTION --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-8 py-3.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-[#8B4513] to-orange-700 text-white shadow-xl scale-105' 
                : 'bg-white text-[#8B4513] border-2 border-[#8B4513] hover:bg-orange-50'
            }`}
          >
            🌟 Semua Produk
          </button>
          <button 
            onClick={() => setSelectedCategory('coffee')}
            className={`px-8 py-3.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              selectedCategory === 'coffee' 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl scale-105' 
                : 'bg-white text-amber-700 border-2 border-amber-600 hover:bg-amber-50'
            }`}
          >
            ☕ Kopi
          </button>
          <button 
            onClick={() => setSelectedCategory('non-coffee')}
            className={`px-8 py-3.5 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              selectedCategory === 'non-coffee' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl scale-105' 
                : 'bg-white text-green-700 border-2 border-green-600 hover:bg-green-50'
            }`}
          >
            🥤 Non-Kopi
          </button>
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
          <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-400 text-red-800 px-8 py-6 rounded-2xl mb-8 text-center shadow-lg">
            <p className="font-bold text-lg">⚠️ {error}</p>
          </div>
        )}

        {/* --- LOADING STATE --- */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#8B4513] mb-6"></div>
            <p className="text-gray-600 text-lg font-semibold">Memuat produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
            <div className="text-6xl mb-6">📭</div>
            <p className="text-gray-600 text-2xl font-semibold">Tidak ada produk yang tersedia.</p>
            <p className="text-gray-500 mt-3">Coba filter kategori lain atau kembali lagi nanti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* --- PRODUCT COUNT --- */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 px-8 py-4 rounded-full shadow-lg border-2 border-orange-300">
              <p className="text-gray-700 font-bold text-lg">
                Menampilkan <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-orange-700">{filteredProducts.length}</span> produk
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}