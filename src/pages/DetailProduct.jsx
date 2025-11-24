// src/pages/DetailProduct.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function DetailProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-xl text-red-600">Product not found.</h2>
        <Link to="/" className="text-amber-600 hover:underline mt-4 inline-block">← Back to Catalogue</Link>
      </div>
    );
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-amber-600 hover:underline mb-4 inline-block">← Back to Catalogue</Link>
      <div className="bg-white rounded-lg shadow p-6">
        <img
          src={product.image || 'https://via.placeholder.com/400?text=Product+Image'}
          alt={product.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <span className={`px-2 py-1 text-sm rounded-full ${
          product.category === 'coffee' 
            ? 'bg-amber-100 text-amber-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {product.category}
        </span>
        <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
        <p className="text-gray-700 mt-3">{product.description}</p>
        <p className="text-2xl font-bold text-amber-700 mt-4">{formatRupiah(product.price)}</p>
      </div>
    </div>
  );
}