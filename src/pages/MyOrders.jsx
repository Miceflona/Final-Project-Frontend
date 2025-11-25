// src/pages/MyOrders.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const { orders, fetchOrders } = useContext(OrderContext);
  const navigate = useNavigate();
  
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);

  // Jika user belum login, redirect ke login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Ambil data order saat mount
  useEffect(() => {
    if (user) {
      fetchOrders().then(() => setLoading(false));
    }
  }, [user, fetchOrders]);

  // Filter order milik user yang sedang login
  useEffect(() => {
    if (user && orders.length > 0) {
      const filteredOrders = orders.filter(order => order.userId === user.id);
      // Urutkan dari yang terbaru
      setUserOrders(filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } else {
      setUserOrders([]);
    }
  }, [user, orders]);

  // --- FUNGSI HAPUS PESANAN ---
  const handleDeleteOrder = async (orderId) => {
    // Konfirmasi sebelum menghapus
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus riwayat pesanan ini? Data yang dihapus tidak dapat dikembalikan.");
    
    if (!confirmDelete) return;

    try {
      // Asumsi menggunakan json-server di port 3000
      const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Riwayat pesanan berhasil dihapus.");
        // Update state lokal agar hilang dari tampilan tanpa reload
        setUserOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        // Refresh data global context jika perlu
        fetchOrders(); 
      } else {
        alert("Gagal menghapus pesanan.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Terjadi kesalahan saat menghapus pesanan.");
    }
  };

  const openProofModal = (proofUrl) => {
    setSelectedProof(proofUrl);
  };

  const closeProofModal = () => {
    setSelectedProof(null);
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-orange-600 pl-4">
          Riwayat Pesanan Saya
        </h1>

        {userOrders.length > 0 ? (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100"
              >
                {/* Header Card: ID, Tanggal, dan Status */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="font-mono text-sm font-bold text-gray-500">#{order.id}</span>
                    <span className="text-sm text-gray-500">
                      📅 {new Date(order.date).toLocaleDateString('id-ID', { 
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    {/* Badge Tipe Order */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      order.orderType === 'delivery' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {order.orderType === 'delivery' ? '🛵 Delivery' : '🍽️ Dine In'}
                    </span>

                    {/* Badge Status */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status === 'pending' ? 'Menunggu Konfirmasi' : order.status}
                    </span>

                    {/* TOMBOL HAPUS */}
                    <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="ml-2 text-gray-400 hover:text-red-600 transition p-1"
                        title="Hapus Riwayat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                  </div>
                </div>

                {/* Body Card: Detail Item */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* List Produk */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Detail Item</h3>
                      <ul className="space-y-3">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-2 last:border-0">
                            <div className="flex items-center gap-3">
                                <span className="bg-orange-50 text-orange-700 font-bold px-2 py-1 rounded text-xs">x{item.quantity}</span>
                                <span className="text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Informasi Pembayaran & Pengiriman */}
                    <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg h-fit">
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                                {order.orderType === 'delivery' ? 'Alamat Pengiriman' : 'Nomor Meja'}
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                                {order.shippingDetails?.address || '-'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {order.shippingDetails?.fullName} ({order.shippingDetails?.phone})
                            </p>
                        </div>

                        <div className="border-t border-gray-200 pt-3 space-y-1">
                            {/* Menampilkan Ongkir jika ada */}
                            {order.shippingCost > 0 && (
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Ongkir</span>
                                    <span>Rp {order.shippingCost.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-bold text-gray-700">Total Bayar</span>
                                <span className="text-lg font-bold text-orange-600">
                                    Rp {order.total ? order.total.toLocaleString('id-ID') : 0}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                             {order.paymentProof ? (
                                <button
                                    onClick={() => openProofModal(order.paymentProof)}
                                    className="w-full text-xs bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2 rounded transition"
                                >
                                    📄 Lihat Bukti Bayar
                                </button>
                             ) : (
                                <span className="text-xs text-gray-400 italic">Bukti tidak tersedia</span>
                             )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🧾</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Pesanan</h2>
            <p className="text-gray-500 mb-8">Yuk, mulai pesan menu favoritmu sekarang!</p>
            <Link 
              to="/catalogue" 
              className="inline-block bg-orange-600 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Mulai Belanja
            </Link>
          </div>
        )}
      </main>
      <Footer />

      {/* Modal Bukti Pembayaran */}
      {selectedProof && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeProofModal}
        >
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Bukti Pembayaran</h3>
                <button onClick={closeProofModal} className="text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            </div>
            <div className="p-4 bg-gray-200 flex justify-center">
                <img 
                    src={selectedProof} 
                    alt="Bukti Pembayaran" 
                    className="max-h-[70vh] object-contain rounded shadow-sm"
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;