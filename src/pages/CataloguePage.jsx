// src/pages/CataloguePage.jsx
import { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

export default function CataloguePage() {
  const { products, fetchProducts, loading, error } = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#8B4513] mb-3">Katalog Produk</h1>
          <p className="text-gray-600 text-lg">Pilih kopi dan minuman favorit Anda</p>
        </div>

        {/* --- FILTER SECTION --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'all' ? 'bg-[#8B4513] text-white shadow-lg' : 'bg-white text-[#8B4513] border-2 border-[#8B4513] hover:bg-orange-50'}`}
          >
            Semua Produk
          </button>
          <button 
            onClick={() => setSelectedCategory('coffee')}
            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'coffee' ? 'bg-[#8B4513] text-white shadow-lg' : 'bg-white text-[#8B4513] border-2 border-[#8B4513] hover:bg-orange-50'}`}
          >
            ☕ Kopi
          </button>
          <button 
            onClick={() => setSelectedCategory('non-coffee')}
            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === 'non-coffee' ? 'bg-[#8B4513] text-white shadow-lg' : 'bg-white text-[#8B4513] border-2 border-[#8B4513] hover:bg-orange-50'}`}
          >
            🥤 Non-Kopi
          </button>
        </div>

        {/* --- ERROR STATE --- */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* --- LOADING STATE --- */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B4513]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-xl">Tidak ada produk yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* --- PRODUCT COUNT --- */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>Menampilkan <span className="font-bold text-[#8B4513]">{filteredProducts.length}</span> produk</p>
          </div>
        )}
      </div>
    </div>
  );
}