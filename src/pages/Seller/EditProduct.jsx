// src/pages/Seller/EditProduct.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductContext } from '../../context/ProductContext';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, updateProduct } = useContext(ProductContext);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'coffee',
    image: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // GET - Fetch product by ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setFormData({
          name: data.name,
          price: data.price.toString(),
          category: data.category,
          image: data.image || '',
          description: data.description
        });
        setError('');
      } catch (err) {
        setError('Gagal memuat produk: ' + err.message);
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // PUT - Update product
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

    setSaving(true);

    try {
      const updatedProduct = {
        ...formData,
        price: Number(formData.price)
      };
      await updateProduct(id, updatedProduct);
      alert('Produk berhasil diubah!');
      navigate('/seller');
    } catch (err) {
      setError('Gagal mengubah produk: ' + err.message);
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center mt-16">Loading produk...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Produk</h1>

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
            rows="4"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
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