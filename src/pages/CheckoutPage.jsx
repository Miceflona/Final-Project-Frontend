import React, { useState, useEffect } from 'react';
import Button from '../components/UI/Button';
import InputGroup from '../components/UI/InputGroup'; // Menggunakan komponen reusable dari Anggota C/A
import { ArrowLeft, CheckCircle } from 'lucide-react';

const CheckoutPage = ({ onBack, onOrderSuccess }) => {
  const [cartItems, setCartItems] = useState([]);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', address: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded userId for demo purpose
  const userId = 1;

  // 1. GET Summary Belanja (Ambil data terbaru dari cart), filter by userId
  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/cart?userId=${userId}`);
      if (!res.ok) throw new Error('Gagal ambil cart');
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  const isBuyerInfoValid = () => {
    return buyerInfo.name.trim() !== '' &&
           buyerInfo.address.trim() !== '' &&
           buyerInfo.phone.trim() !== '';
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Keranjang belanja kosong.");
      return;
    }

    if (!isBuyerInfoValid()) {
      alert("Mohon lengkapi data penerima dengan benar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const orderData = {
      userId,
      buyer: buyerInfo,
      items: cartItems,
      totalAmount: total,
      orderDate: new Date().toISOString(),
      status: "Pending"
    };

    try {
      const res = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Gagal buat pesanan');

      await Promise.all(cartItems.map(item =>
        fetch(`http://localhost:3000/cart/${item.id}`, { method: 'DELETE' })
      ));

      alert("Pesanan berhasil dibuat! Terima kasih.");
      setBuyerInfo({ name: '', address: '', phone: '' });
      setCartItems([]);
      onOrderSuccess();
    } catch (err) {
      setError(err.message);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={onBack} className="flex items-center text-gray-600 mb-6 hover:text-amber-700">
        <ArrowLeft size={20} className="mr-2" /> Kembali ke Keranjang
      </button>

      <h1 className="text-2xl font-bold mb-8 text-gray-800">Checkout & Pengiriman</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-amber-700" size={20}/> Data Penerima
          </h2>
          <form onSubmit={handlePlaceOrder}>
            <InputGroup 
              label="Nama Lengkap" 
              value={buyerInfo.name}
              onChange={e => setBuyerInfo({...buyerInfo, name: e.target.value})}
              required
            />
            <InputGroup 
              label="Nomor Telepon" 
              type="tel"
              value={buyerInfo.phone}
              onChange={e => setBuyerInfo({...buyerInfo, phone: e.target.value})}
              required
            />
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Alamat Lengkap</label>
              <textarea 
                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="3"
                value={buyerInfo.address}
                onChange={e => setBuyerInfo({...buyerInfo, address: e.target.value})}
                required
              ></textarea>
            </div>
            <Button 
              variant="primary" 
              className="w-full mt-4 py-3 font-bold text-lg"
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? "Memproses..." : `Bayar Rp ${total.toLocaleString()}`}
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 h-fit">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Ringkasan Pesanan</h2>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} <span className="font-bold text-xs">x{item.qty}</span></span>
                <span className="font-medium">Rp {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>PPN (11%)</span>
              <span>Rp {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-amber-800 mt-4 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
