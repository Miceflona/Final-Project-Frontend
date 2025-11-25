// src/pages/CheckoutPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { OrderContext } from '../context/OrderContext';
import { ProductContext } from '../context/ProductContext';

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, fetchCart, clearCart } = useContext(CartContext);
  const { createOrder } = useContext(OrderContext);
  const { products } = useContext(ProductContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState(null);
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    phone: ''
  });

  const [cartDetails, setCartDetails] = useState([]);
  const [paymentProofFile, setPaymentProofFile] = useState(null);

  // Fetch cart items saat component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchCart(user.id);

        // Pre-fill form dengan data user
        setShippingDetails({
          fullName: user.fullName || '',
          address: user.address || '',
          phone: user.phone || ''
        });
      } catch (err) {
        setError('Gagal memuat data checkout');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  // Gabungkan data cart dengan product details
  useEffect(() => {
    const userCart = cartItems.filter(item => item.userId === user?.id);
    const details = userCart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return {
        ...cartItem,
        product,
        subtotal: product ? product.price * cartItem.quantity : 0
      };
    });
    setCartDetails(details);
  }, [cartItems, products, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPaymentProofFile(e.target.files[0]);
  };

  const calculateTotal = () => {
    return cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartDetails.length === 0) {
      alert('Keranjang Anda kosong');
      return;
    }

    if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
      alert('Lengkapi semua data pengiriman');
      return;
    }
    
    if (!paymentProofFile) {
      alert('Mohon unggah bukti pembayaran');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Simulate file upload, in a real app, you would upload to a server
      // and get a URL back. Here we'll just use a placeholder.
      const paymentProofUrl = `https://placehold.co/600x400.png?text=Bukti+Pembayaran`;

      const orderData = {
        userId: user.id,
        items: cartDetails.map(item => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: calculateTotal(),
        date: new Date().toISOString(),
        status: 'pending',
        shippingDetails: shippingDetails,
        paymentProof: paymentProofUrl, // Add the proof URL
      };

      // POST - Create order
      await createOrder(orderData);

      // DELETE - Clear cart after order
      await clearCart(user.id);

      alert('Pesanan berhasil dibuat! Anda akan dialihkan ke halaman Laporan Transaksi.');
      navigate('/transaction-report');
    } catch (err) {
      setError('Gagal membuat pesanan: ' + err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen mt-16">Loading...</div>;
  }

  if (error && cartDetails.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 mt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <button
            onClick={() => navigate('/catalogue')}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Kembali ke Toko
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Details Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Informasi Pembeli</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-lg sticky top-28">
              <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b pb-4">Ringkasan Pesanan</h2>
              <div className="space-y-4 mb-6">
                {cartDetails.length > 0 ? (
                  cartDetails.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-gray-600">
                      <span className="font-medium">
                        {item.product?.name} <span className="text-sm">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold">
                        Rp {(item.product?.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Keranjang kosong</p>
                )}
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-lg text-gray-700">
                  <span>Subtotal</span>
                  <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl text-gray-800">
                  <span>Total</span>
                  <span className="text-orange-600">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="mt-6 border-t pt-4">
                <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-600 mb-2">
                  Unggah Bukti Pembayaran
                </label>
                <input
                  type="file"
                  name="paymentProof"
                  id="paymentProof"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  accept="image/png, image/jpeg, image/jpg"
                  required
                />
                {paymentProofFile && <p className="text-xs text-gray-500 mt-1">File: {paymentProofFile.name}</p>}
              </div>
              
              <button
                type="submit"
                disabled={cartDetails.length === 0 || isPlacingOrder}
                className="w-full mt-8 bg-orange-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? 'Memproses...' : 'Pesan Sekarang'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
