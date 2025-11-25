
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const { orders, fetchOrders } = useContext(OrderContext);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders().then(() => setLoading(false));
    }
  }, [user, fetchOrders]);

  useEffect(() => {
    if (user && orders.length > 0) {
      const filteredOrders = orders.filter(order => order.userId === user.id);
      setUserOrders(filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, [user, orders]);

  const openProofModal = (proofUrl) => {
    setSelectedProof(proofUrl);
  };

  const closeProofModal = () => {
    setSelectedProof(null);
  };

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Riwayat Pesanan Saya</h1>
        {loading ? (
          <p className="text-center text-gray-500">Memuat riwayat pesanan...</p>
        ) : userOrders.length > 0 ? (
          <div className="space-y-6">
            {userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Pesanan #{order.id}</h2>
                      <p className="text-sm text-gray-500">Tanggal: {new Date(order.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="text-lg font-bold text-blue-600">{formatToRupiah(order.total)}</p>
                       <Link 
                        to={`/transaction-report/${order.id}`} 
                        className="text-sm text-blue-500 hover:text-blue-700 font-semibold mt-1"
                      >
                        Lihat Detail Pesanan
                      </Link>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Bukti Pembayaran:</h3>
                    {order.paymentProof ? (
                      <button
                        onClick={() => openProofModal(order.paymentProof)}
                        className="text-blue-500 hover:underline"
                      >
                        Lihat Bukti Pembayaran
                      </button>
                    ) : (
                      <p className="text-sm text-gray-400">Bukti tidak tersedia</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">Anda belum memiliki riwayat pesanan.</p>
          </div>
        )}
      </main>
      <Footer />

      {selectedProof && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeProofModal}
        >
          <div className="relative p-4 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <img src={selectedProof} alt="Bukti Pembayaran" className="max-w-full h-auto max-h-[80vh]"/>
            <button
              onClick={closeProofModal}
              className="absolute top-0 right-0 mt-2 mr-2 text-white bg-gray-800 rounded-full p-1 leading-none hover:bg-gray-600"
              aria-label="Tutup"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
