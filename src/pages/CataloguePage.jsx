// src/pages/CataloguePage.jsx
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function CataloguePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading catalogue...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Our Coffee & Drinks</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}