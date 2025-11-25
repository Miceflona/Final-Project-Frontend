// src/pages/CartPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ProductContext } from '../context/ProductContext';

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, fetchCart, updateCartItem, removeFromCart, loading } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState([]);

  // Fetch cart items saat component mount
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user]);

  // Gabungkan data cart dengan product details
  useEffect(() => {
    const userCart = cartItems.filter(item => item.userId === user?.id);
    const details = userCart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return {
        ...cartItem,
        product,
        subtotal: product ? product.price * cartItem.quantity : 0
      };
    });
    setCartDetails(details);
  }, [cartItems, products, user]);

  // Handle quantity change
  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) return;
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (err) {
      alert('Gagal mengubah quantity: ' + err.message);
    }
  };

  // Handle remove item
  const handleRemove = async (cartItemId) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await removeFromCart(cartItemId);
      } catch (err) {
        alert('Gagal menghapus: ' + err.message);
      }
    }
  };

  const totalPrice = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen mt-16">Loading...</div>;
  }

  if (cartDetails.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 mt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Keranjang Kosong</h1>
          <p className="text-gray-600 mb-8">Mulai belanja sekarang!</p>
          <Link
            to="/catalogue"
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {cartDetails.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  {item.product && (
                    <>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-orange-600 font-semibold">
                          Rp {item.product.price.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Kategori: {item.product.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
                        >
                          -
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </p>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm mt-2 font-semibold transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkir</span>
                  <span>Rp 0</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span className="text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Lanjut Checkout
              </button>

              <Link
                to="/catalogue"
                className="block text-center text-orange-600 mt-4 font-semibold hover:underline"
              >
                Lanjut Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
