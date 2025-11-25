// src/components/ProductCard.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!product) return null;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // POST - Add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await addToCart(user.id, product.id, 1);
      setMessage('Ditambahkan ke keranjang!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setMessage('Gagal menambah ke keranjang');
    } finally {
      setLoading(false);
    }
  };

  const isSeller = user?.role === 'seller';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border border-gray-100">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden group">
        <img
          src={product.image || 'https://via.placeholder.com/300?text=No+Image'}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Error'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      <div className="p-5 flex-grow flex flex-col">
        <Link to={`/product/${product.id}`} className="flex-grow block">
          <span className={`px-3 py-1.5 text-xs rounded-full font-bold inline-block shadow-sm ${
            product.category === 'coffee' 
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' 
              : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
          }`}>
            {product.category === 'coffee' ? '☕ Kopi' : '🥤 Non-Kopi'}
          </span>
          <h3 className="font-bold text-xl mt-3 text-gray-800 hover:text-[#8B4513] transition-colors">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">{formatRupiah(product.price)}</p>
          </div>
        </Link>
        
        {/* Add to cart button - hanya untuk pembeli yang login, tidak untuk penjual */}
        {user && !isSeller && (
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-md"
            >
              {loading ? '⏳ Menambahkan...' : '🛒 Tambah ke Keranjang'}
            </button>
            {message && (
              <p className={`text-center text-sm mt-2 font-semibold animate-pulse ${message.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        )}

        {/* Message untuk user yang belum login */}
        {!user && (
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg font-bold text-center hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 mt-4 inline-block shadow-md"
          >
            🔐 Login untuk Membeli
          </Link>
        )}
      </div>
    </div>
  );
}