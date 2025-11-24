// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // 🔒 Proteksi awal: cegah error jika product undefined
  if (!product) return null;

  // Format Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
        <img
          src={product.image || 'https://via.placeholder.com/300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300?text=Image+Error';
          }}
        />
        <div className="p-4 flex-grow">
          <span className={`px-2 py-1 text-xs rounded-full ${
            product.category === 'coffee' 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {product.category}
          </span>
          <h3 className="font-bold text-lg mt-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
          <p className="font-semibold text-lg mt-2">{formatRupiah(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}