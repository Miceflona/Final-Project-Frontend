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

  // --- KONFIGURASI ONGKIR ---
  const DELIVERY_FEE = 10000;

  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState(null);
  
  // State tipe pesanan (Dine In / Delivery)
  const [orderType, setOrderType] = useState('dine-in'); 
  const [showReceipt, setShowReceipt] = useState(false);
  const [finalOrderData, setFinalOrderData] = useState(null);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '', 
    phone: ''
  });

  const [cartDetails, setCartDetails] = useState([]);
  const [paymentProofFile, setPaymentProofFile] = useState(null);

  // Fetch cart items
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

  // Gabungkan cart dengan detail produk
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

  // Hitung Subtotal (Harga Barang Saja)
  const calculateSubtotal = () => {
    return cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Hitung Ongkir Berdasarkan Pilihan
  const calculateShippingCost = () => {
    return orderType === 'delivery' ? DELIVERY_FEE : 0;
  };

  // Hitung Total Akhir (Subtotal + Ongkir)
  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateShippingCost();
  };

  const generateTransactionId = () => {
    return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartDetails.length === 0) {
      alert('Keranjang Anda kosong');
      return;
    }

    if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
      alert('Lengkapi semua data pemesan');
      return;
    }
    
    if (!paymentProofFile) {
      alert('Mohon unggah bukti pembayaran');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const paymentProofUrl = `https://placehold.co/600x400.png?text=Bukti+Pembayaran`;
      const transactionId = generateTransactionId();

      const subtotal = calculateSubtotal();
      const shippingCost = calculateShippingCost();
      const grandTotal = calculateGrandTotal();

      const orderData = {
        id: transactionId, 
        userId: user.id,
        items: cartDetails.map(item => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        subtotal: subtotal,        // Simpan subtotal
        shippingCost: shippingCost, // Simpan biaya ongkir
        total: grandTotal,         // Simpan total akhir
        date: new Date().toISOString(),
        status: 'pending',
        orderType: orderType, 
        shippingDetails: {
            ...shippingDetails,
            locationType: orderType === 'dine-in' ? 'Table Number' : 'Delivery Address'
        },
        paymentProof: paymentProofUrl,
      };

      await createOrder(orderData);
      await clearCart(user.id);

      setFinalOrderData(orderData);
      setShowReceipt(true);

    } catch (err) {
      setError('Gagal membuat pesanan: ' + err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // --- RENDER ---

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen mt-16">Loading...</div>;
  }

  // --- TAMPILAN STRUK PEMBELIAN ---
  if (showReceipt && finalOrderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 mt-16">
        <div className="bg-white max-w-md w-full rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-green-500 p-6 text-center">
            <div className="mx-auto bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Pembayaran Berhasil!</h2>
            <p className="text-green-100 mt-1">Pesanan Anda sedang diproses</p>
          </div>
          
          <div className="p-6">
            <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>ID Transaksi:</span>
                    <span className="font-mono font-bold text-gray-800">{finalOrderData.id}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Tanggal:</span>
                    <span>{new Date(finalOrderData.date).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Tipe Pesanan:</span>
                    <span className="font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs uppercase">
                        {finalOrderData.orderType === 'dine-in' ? 'Makan di Tempat' : 'Delivery'}
                    </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{finalOrderData.orderType === 'dine-in' ? 'No. Meja' : 'Penerima'}:</span>
                    <span className="font-medium text-gray-800">
                        {finalOrderData.orderType === 'dine-in' 
                            ? finalOrderData.shippingDetails.address 
                            : finalOrderData.shippingDetails.fullName}
                    </span>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-700 text-sm">Detail Item:</h3>
                {finalOrderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity}x {item.name}</span>
                        <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                ))}
            </div>

            {/* Rincian Harga di Struk */}
            <div className="border-t border-gray-200 pt-3 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {finalOrderData.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ongkir</span>
                  <span>Rp {finalOrderData.shippingCost.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-700">Total Bayar</span>
                    <span className="font-bold text-xl text-orange-600">Rp {finalOrderData.total.toLocaleString('id-ID')}</span>
                </div>
            </div>

            <div className="mt-4">
                <button 
                    onClick={() => navigate('/catalogue')}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition shadow-lg"
                >
                    Belanja Lagi
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Error Keranjang Kosong
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

  // --- FORM CHECKOUT UTAMA ---
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
          
          {/* Kolom Kiri: Form Data */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Informasi Pemesanan</h2>
            
            {/* Pilihan Tipe Order */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-600 mb-3">Metode Pemesanan</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setOrderType('dine-in')}
                        className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                            orderType === 'dine-in' 
                            ? 'border-orange-500 bg-orange-50 text-orange-700' 
                            : 'border-gray-200 hover:border-orange-200 text-gray-600'
                        }`}
                    >
                        <span className="font-bold text-lg">🍽️ Makan di Tempat</span>
                        <span className="text-xs mt-1">Dine In (Ongkir Rp 0)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                            orderType === 'delivery' 
                            ? 'border-orange-500 bg-orange-50 text-orange-700' 
                            : 'border-gray-200 hover:border-orange-200 text-gray-600'
                        }`}
                    >
                        <span className="font-bold text-lg">🛵 Pesan Antar</span>
                        <span className="text-xs mt-1">Delivery (+ Rp {DELIVERY_FEE.toLocaleString('id-ID')})</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-1">
                  Nama Pemesan
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Masukkan nama lengkap anda"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
                  {orderType === 'dine-in' ? 'Nomor Meja' : 'Alamat Pengiriman Lengkap'}
                </label>
                {orderType === 'dine-in' ? (
                     <input
                        type="text"
                        name="address"
                        id="address"
                        value={shippingDetails.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition"
                        placeholder="Contoh: Meja 12"
                        required
                   />
                ) : (
                    <textarea
                        name="address"
                        id="address"
                        value={shippingDetails.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition"
                        placeholder="Masukkan alamat lengkap, patokan, dll."
                        required
                    ></textarea>
                )}
               
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan & Pembayaran */}
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
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                </div>
                
                {/* Tampilan Ongkir */}
                <div className="flex justify-between text-gray-700">
                  <span>Ongkir ({orderType === 'dine-in' ? 'Dine In' : 'Delivery'})</span>
                  <span className={orderType === 'delivery' ? "font-semibold text-orange-600" : ""}>
                    Rp {calculateShippingCost().toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-2xl text-gray-800 pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-orange-600">Rp {calculateGrandTotal().toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Upload Bukti Pembayaran */}
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
                {isPlacingOrder ? 'Memproses...' : 'Bayar & Pesan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;