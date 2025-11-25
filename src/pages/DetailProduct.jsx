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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link to="/catalogue" className="text-[#8B4513] hover:underline mb-6 inline-flex items-center gap-2 font-semibold">
          ← Kembali ke Katalog
        </Link>

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Product Image */}
            <div>
              <img
                src={product.image || 'https://via.placeholder.com/400?text=Product+Image'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Error'; }}
              />
              <div className="mt-4 flex gap-2">
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${
                  product.category === 'coffee' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.category === 'coffee' ? '☕ Kopi' : '🥤 Non-Kopi'}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-[#8B4513] mb-2">{product.name}</h1>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-orange-600">{formatRupiah(product.price)}</span>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Deskripsi:</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Rating/Review section placeholder */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    ⭐ <span className="font-semibold">4.8</span> · <span className="text-gray-500">125 ulasan</span>
                  </p>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div>
                {!user ? (
                  <Link
                    to="/login"
                    className="w-full bg-gray-400 text-white py-4 rounded-lg font-semibold text-center hover:bg-gray-500 transition block mb-3"
                  >
                    Login untuk Membeli
                  </Link>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah:</label>
                      <div className="flex items-center gap-3 border-2 border-gray-300 rounded-lg w-fit p-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="text-xl font-bold text-gray-600 hover:text-gray-800 px-2"
                        >
                          −
                        </button>
                        <span className="font-bold text-lg px-4 py-1">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="text-xl font-bold text-gray-600 hover:text-gray-800 px-2"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-600">Total Harga:</p>
                      <p className="text-2xl font-bold text-orange-600">{formatRupiah(totalPrice)}</p>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mb-3"
                    >
                      {addingToCart ? 'Menambahkan...' : '🛒 Tambah ke Keranjang'}
                    </button>

                    {message && (
                      <p className={`text-center text-sm p-2 rounded ${
                        message.includes('Gagal') 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {message}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-[#8B4513] mb-2">✓ Kualitas Premium</h3>
            <p className="text-sm text-gray-600">Biji kopi pilihan dari petani terbaik</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-[#8B4513] mb-2">⚡ Pengiriman Cepat</h3>
            <p className="text-sm text-gray-600">Dikirim dalam waktu 30 menit</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-[#8B4513] mb-2">💳 Pembayaran Aman</h3>
            <p className="text-sm text-gray-600">Berbagai metode pembayaran tersedia</p>
          </div>
        </div>
      </div>
    </div>
  );
}