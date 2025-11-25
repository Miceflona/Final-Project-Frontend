// src/pages/MyOrders.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const { orders, fetchUserOrders, loading, error, cancelOrder } = useContext(OrderContext);
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders(user.id);
        // Sort by date, newest first
        const sorted = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setUserOrders(sorted);
      } catch (err) {
        console.error('Gagal memuat pesanan:', err);
      }
    };

    loadOrders();
  }, [user, navigate]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Yakin ingin membatalkan pesanan ini?')) {
      try {
        await cancelOrder(orderId);
        setUserOrders(userOrders.filter(order => order.id !== orderId));
        alert('Pesanan berhasil dibatalkan');
      } catch (err) {
        alert('Gagal membatalkan pesanan: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen mt-16">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 mt-16">
        <p className="text-lg text-gray-600 mb-4">Silakan <Link to="/login" className="text-orange-600 hover:underline font-semibold">login</Link> untuk melihat pesanan</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Riwayat Pesanan</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {userOrders.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <p className="text-lg text-gray-600 mb-4">Anda belum membuat pesanan apapun</p>
            <Link
              to="/catalogue"
              className="inline-block bg-orange-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg transition-transform hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4">
                  <div>
                    <p className="font-bold text-lg text-gray-800">Pesanan #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.orderDate || order.createdAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0 text-right">
                    <p className="font-bold text-xl text-gray-800">
                      Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                    </p>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full inline-block ${
                      order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      order.status === 'completed' ? 'bg-green-200 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {order.status === 'pending' ? 'Menunggu' :
                       order.status === 'completed' ? 'Selesai' :
                       order.status === 'cancelled' ? 'Dibatalkan' :
                       order.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <h3 className="font-semibold text-gray-700">Item Pesanan:</h3>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-600 pl-4">
                      <span>{item.name} <span className="text-sm">x{item.quantity}</span></span>
                      <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
                
                {order.shippingDetails && (
                  <div className="border-t pt-4 mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Pengiriman ke:</h3>
                    <p className="text-gray-600">{order.shippingDetails.fullName}</p>
                    <p className="text-gray-600">{order.shippingDetails.address}</p>
                    <p className="text-gray-600">{order.shippingDetails.phone}</p>
                  </div>
                )}

                {order.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Batalkan Pesanan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
