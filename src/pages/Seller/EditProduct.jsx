// src/pages/Seller/EditProduct.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'coffee',
    image: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name,
          price: data.price.toString(),
          category: data.category,
          image: data.image || '',
          description: data.description
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedProduct = {
      ...formData,
      price: Number(formData.price)
    };

    fetch(`http://localhost:3000/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    })
      .then(() => {
        setSaving(false);
        navigate('/seller');
      })
      .catch(err => {
        console.error('Update failed:', err);
        setSaving(false);
      });
  };

  if (loading) {
    return <div className="p-8">Loading product...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="coffee">Coffee</option>
            <option value="non-coffee">Non-Coffee</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price (Rp)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/seller')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}