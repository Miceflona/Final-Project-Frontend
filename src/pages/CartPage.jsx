import React, { useEffect, useState } from 'react';
import Button from '../components/UI/Button'; // Pastikan path ini sesuai dengan projectmu
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = ({ onCheckout }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded userId for demo purpose
  const userId = 1;

  // GET: Ambil data keranjang saat halaman dibuka, filter by userId
  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/cart?userId=${userId}`);
      if (!res.ok) throw new Error('Gagal load cart');
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // POST: Tambah item ke keranjang
  const addCartItem = async (product) => {
    setLoading(true);
    setError(null);
    try {
      const existingItem = cartItems.find(item => item.productId === product.id);
      if (existingItem) {
        await handleQtyChange(existingItem, 1);
      } else {
        const newItem = {
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        };
        const res = await fetch('http://localhost:3000/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (!res.ok) throw new Error('Gagal tambah item ke keranjang');
        const savedItem = await res.json();
        setCartItems(prev => [...prev, savedItem]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUT: Ubah jumlah barang (Qty)
  const handleQtyChange = async (item, change) => {
    const newQty = item.qty + change;
    if (newQty < 1) return; // Mencegah qty menjadi 0 atau minus

    setLoading(true);
    setError(null);

    try {
      const updatedItem = { ...item, qty: newQty };
      const res = await fetch(`http://localhost:3000/cart/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      if (!res.ok) throw new Error('Gagal update qty');
      setCartItems(prev => prev.map(c => c.id === item.id ? { ...c, qty: newQty } : c));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE: Hapus item dari keranjang
  const handleRemove = async (id) => {
    if(!confirm("Hapus item ini dari keranjang?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/cart/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal hapus item');
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hitung Total Harga
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Keranjang Belanja</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Error: {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Loading...</p>
        </div>
      )}

      {!loading && cartItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Keranjang kamu masih kosong.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border items-center">
              {/* Gambar Produk */}
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-gray-200" />
              
              {/* Detail Produk */}
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-amber-700 font-medium">Rp {item.price.toLocaleString()}</p>
              </div>

              {/* Kontrol Qty (+/-) */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => handleQtyChange(item, -1)}
                  disabled={item.qty <= 1 || loading}
                  className="p-1 hover:bg-white rounded shadow-sm transition disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                <button 
                  onClick={() => handleQtyChange(item, 1)}
                  disabled={loading}
                  className="p-1 hover:bg-white rounded shadow-sm transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Tombol Hapus */}
              <button 
                onClick={() => handleRemove(item.id)}
                disabled={loading}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full ml-2"
                title="Hapus Item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {/* Footer Keranjang */}
          <div className="bg-white p-6 rounded-xl border shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 text-lg">Total Pembayaran</span>
              <span className="text-2xl font-bold text-amber-800">Rp {total.toLocaleString()}</span>
            </div>
            <Button 
              onClick={onCheckout} 
              variant="primary" 
              className="w-full py-3 text-lg font-bold shadow-lg shadow-amber-700/20"
              disabled={loading || cartItems.length === 0}
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
