
import React, { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../context/OrderContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TransactionReport = () => {
  const { orders, fetchOrders } = useContext(OrderContext);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders().then(() => setLoading(false));
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    if (startDate && new Date(startDate) > orderDate) {
      return false;
    }
    if (endDate && new Date(endDate) < orderDate) {
      return false;
    }
    return true;
  });

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-3xl font-bold text-gray-800">Laporan Transaksi</h1>
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cetak Laporan
          </button>
        </div>
        <div className="flex justify-end space-x-4 mb-6 no-print">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Mulai Tanggal</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Memuat laporan transaksi...</p>
        ) : filteredOrders.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
                <p className="text-3xl font-bold text-green-600">{formatToRupiah(filteredOrders.reduce((acc, order) => acc + order.total, 0))}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700">Total Transaksi</h2>
                <p className="text-3xl font-bold text-blue-600">{filteredOrders.length}</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Semua Transaksi</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bukti Pembayaran
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatToRupiah(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ul>
                          {order.items.map(item => (
                            <li key={item.id}>{item.name} (x{item.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.paymentProof ? (
                          <button
                            onClick={() => openProofModal(order.paymentProof)}
                            className="text-blue-500 hover:underline"
                          >
                            Lihat Bukti
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">Tidak ada transaksi yang ditemukan untuk rentang tanggal yang dipilih.</p>
          </div>
        )}
      </main>
      <Footer />

      {selectedProof && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-print"
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

export default TransactionReport;

