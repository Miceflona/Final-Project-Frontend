// src/pages/DetailProduct.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Cari product di ProductContext
    const found = products.find(p => p.id === parseInt(id));
    if (found) {
      setProduct(found);
      setLoading(false);
    } else {
      // Fallback ke fetch jika tidak ditemukan di context
      fetch(`http://localhost:3000/products/${id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching product:', err);
          setLoading(false);
        });
    }
  }, [id, products]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(user.id, product.id, quantity);
      setMessage('Ditambahkan ke keranjang!');
      setQuantity(1);
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage('Gagal menambah ke keranjang');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B4513]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Produk Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Maaf, produk yang Anda cari tidak tersedia.</p>
          <Link to="/catalogue" className="bg-[#8B4513] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5c2e0c] transition">
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const isSeller = user?.role === 'seller';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link to="/catalogue" className="text-[#8B4513] hover:text-orange-700 mb-8 inline-flex items-center gap-2 font-bold text-lg group">
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Katalog
        </Link>

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-10">
            
            {/* Product Image */}
            <div>
              <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                <img
                  src={product.image || 'https://via.placeholder.com/400?text=Product+Image'}
                  alt={product.name}
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Error'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="mt-6 flex gap-3">
                <span className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-lg ${
                  product.category === 'coffee' 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                }`}>
                  {product.category === 'coffee' ? '☕ Kopi' : '🥤 Non-Kopi'}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-orange-700 mb-3">{product.name}</h1>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">{formatRupiah(product.price)}</span>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl mb-6 border border-orange-200 shadow-inner">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">📝 Deskripsi:</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Rating/Review section placeholder */}
                <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-700">
                    ⭐⭐⭐⭐⭐ <span className="font-bold text-yellow-600">4.8</span> · <span className="text-gray-600">125 ulasan pelanggan</span>
                  </p>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div>
                {!user ? (
                  <Link
                    to="/login"
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-xl font-bold text-center hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 block mb-3 shadow-lg"
                  >
                    🔐 Login untuk Membeli
                  </Link>
                ) : isSeller ? (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl text-center shadow-lg">
                    <p className="text-2xl font-bold mb-2">👁️ Mode Penjual</p>
                    <p className="text-sm opacity-90">Anda sedang melihat produk ini sebagai penjual</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-800 mb-3">📦 Jumlah:</label>
                      <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl w-fit p-3 shadow-md">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="text-2xl font-bold text-orange-600 hover:text-orange-800 hover:bg-white rounded-lg px-3 py-1 transition-all"
                        >
                          −
                        </button>
                        <span className="font-bold text-2xl px-6 py-1 text-gray-800">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="text-2xl font-bold text-orange-600 hover:text-orange-800 hover:bg-white rounded-lg px-3 py-1 transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 p-6 rounded-xl mb-6 border-2 border-orange-300 shadow-lg">
                      <p className="text-sm text-gray-600 font-semibold">💰 Total Harga:</p>
                      <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">{formatRupiah(totalPrice)}</p>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none mb-3 shadow-xl"
                    >
                      {addingToCart ? '⏳ Menambahkan...' : '🛒 Tambah ke Keranjang'}
                    </button>

                    {message && (
                      <div className={`text-center text-sm p-3 rounded-lg font-bold animate-pulse shadow-md ${
                        message.includes('Gagal') 
                          ? 'bg-red-100 text-red-700 border border-red-300' 
                          : 'bg-green-100 text-green-700 border border-green-300'
                      }`}>
                        {message}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white to-orange-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-orange-100">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-bold text-[#8B4513] mb-3 text-lg">Kualitas Premium</h3>
            <p className="text-sm text-gray-600">Biji kopi pilihan dari petani terbaik Indonesia</p>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-blue-100">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-[#8B4513] mb-3 text-lg">Pengiriman Cepat</h3>
            <p className="text-sm text-gray-600">Pesanan Anda tiba dalam waktu 30 menit</p>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-green-100">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="font-bold text-[#8B4513] mb-3 text-lg">Pembayaran Aman</h3>
            <p className="text-sm text-gray-600">Berbagai metode pembayaran terpercaya</p>
          </div>
        </div>
      </div>
    </div>
  );
}