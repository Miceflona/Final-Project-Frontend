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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <img
          src={product.image || 'https://via.placeholder.com/300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Error'; }}
        />
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product.id}`} className="flex-grow block">
          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
            product.category === 'coffee' 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {product.category === 'coffee' ? '☕ Kopi' : '🥤 Non-Kopi'}
          </span>
          <h3 className="font-bold text-lg mt-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
          <p className="font-semibold text-lg text-orange-600 mt-3">{formatRupiah(product.price)}</p>
        </Link>
        
        {/* Add to cart button - hanya untuk user yang login */}
        {user && (
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Menambahkan...' : 'Tambah ke Keranjang'}
            </button>
            {message && (
              <p className={`text-center text-sm mt-2 ${message.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        )}

        {/* Message untuk user yang belum login */}
        {!user && (
          <Link
            to="/login"
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold text-center hover:bg-gray-400 transition-colors mt-4 inline-block"
          >
            Login untuk Membeli
          </Link>
        )}
      </div>
    </div>
  );
}