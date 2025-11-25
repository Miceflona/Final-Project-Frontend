// src/pages/Seller/MyProducts.jsx
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';

export default function MyProducts() {
  const { products, fetchProducts, deleteProduct, loading } = useContext(ProductContext);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (setConfirmDelete === id) {
      try {
        await deleteProduct(id);
        alert(`Produk "${name}" berhasil dihapus`);
        setConfirmDelete(null);
      } catch (err) {
        alert('Gagal menghapus produk: ' + err.message);
      }
    } else {
      setConfirmDelete(id);
    }
  };

  if (loading) {
    return <div className="p-8 text-center mt-16">Loading seller dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Produk Saya</h1>
        <Link
          to="/seller/add"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          + Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600 mb-4">Belum ada produk. Tambahkan produk pertama Anda!</p>
          <Link
            to="/seller/add"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Tambah Produk
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left font-semibold">Gambar</th>
                <th className="py-3 px-4 text-left font-semibold">Nama Produk</th>
                <th className="py-3 px-4 text-left font-semibold">Kategori</th>
                <th className="py-3 px-4 text-left font-semibold">Harga</th>
                <th className="py-3 px-4 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.category === 'coffee' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-orange-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/seller/edit/${product.id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className={`px-3 py-1 rounded text-sm font-semibold transition ${
                          confirmDelete === product.id
                            ? 'bg-red-700 text-white'
                            : 'bg-red-100 text-red-600 hover:bg-red-700 hover:text-white'
                        }`}
                      >
                        {confirmDelete === product.id ? 'Yakin?' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}