// src/pages/Seller/AddProduct.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';

export default function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'coffee',
    image: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (!formData.name || !formData.price || !formData.description) {
      setError('Lengkapi semua field yang wajib');
      return;
    }

    if (formData.price < 1) {
      setError('Harga harus lebih dari 0');
      return;
    }

    setLoading(true);

    try {
      const newProduct = {
        ...formData,
        price: Number(formData.price)
      };
      await addProduct(newProduct);
      alert('Produk berhasil ditambahkan!');
      navigate('/seller');
    } catch (err) {
      setError('Gagal menambah produk: ' + err.message);
      console.error('Add failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Nama Produk *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Contoh: Espresso Arabika"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Kategori *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          >
            <option value="coffee">☕ Kopi</option>
            <option value="non-coffee">🥤 Non-Kopi</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Harga (Rp) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Contoh: 25000"
            min="1"
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">URL Gambar</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Deskripsi *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Jelaskan detail produk Anda..."
            rows="4"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/seller')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}