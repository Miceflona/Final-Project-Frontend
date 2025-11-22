// src/pages/Seller/MyProducts.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          setProducts(products.filter(p => p.id !== id));
        })
        .catch(err => console.error('Delete failed:', err));
    }
  };

  if (loading) {
    return <div className="p-8">Loading seller dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link
          to="/seller/add"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p>No products yet. Add your first product!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Image</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="text-center">
                  <td className="py-2 px-4 border">
                    <img
                      src={product.image || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="w-12 h-12 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border">{product.name}</td>
                  <td className="py-2 px-4 border">{product.category}</td>
                  <td className="py-2 px-4 border">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(product.price)}
                  </td>
                  <td className="py-2 px-4 border space-x-2">
                    <Link
                      to={`/seller/edit/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline ml-2"
                    >
                      Delete
                    </button>
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