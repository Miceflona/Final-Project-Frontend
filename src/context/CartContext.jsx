import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

const API_URL = 'http://localhost:3000';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET - Fetch cart items for user
  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/cart?userId=${userId}`);
      setCartItems(response.data);
      return response.data;
    } catch (err) {
      const message = 'Gagal mengambil data keranjang';
      setError(message);
      console.error(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // POST - Add item to cart
  const addToCart = async (userId, productId, quantity = 1) => {
    try {
      setError(null);
      const existingItem = cartItems.find(
        item => item.userId === userId && item.productId === productId
      );

      if (existingItem) {
        // Update quantity if item already in cart
        return updateCartItem(existingItem.id, existingItem.quantity + quantity);
      }

      const newCartItem = {
        id: `cart_${Date.now()}`,
        userId,
        productId,
        quantity
      };
      const response = await axios.post(`${API_URL}/cart`, newCartItem);
      setCartItems([...cartItems, response.data]);
      return response.data;
    } catch (err) {
      const message = 'Gagal menambah ke keranjang';
      setError(message);
      throw new Error(message);
    }
  };

  // PUT - Update cart item quantity
  const updateCartItem = async (cartItemId, quantity) => {
    try {
      setError(null);
      if (quantity <= 0) {
        return removeFromCart(cartItemId);
      }
      const response = await axios.put(`${API_URL}/cart/${cartItemId}`, { quantity });
      setCartItems(cartItems.map(item => item.id === cartItemId ? response.data : item));
      return response.data;
    } catch (err) {
      const message = 'Gagal mengubah keranjang';
      setError(message);
      throw new Error(message);
    }
  };

  // DELETE - Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/cart/${cartItemId}`);
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      return true;
    } catch (err) {
      const message = 'Gagal menghapus dari keranjang';
      setError(message);
      throw new Error(message);
    }
  };

  // Clear cart for user
  const clearCart = async (userId) => {
    try {
      setError(null);
      const userCart = cartItems.filter(item => item.userId === userId);
      await Promise.all(userCart.map(item => axios.delete(`${API_URL}/cart/${item.id}`)));
      setCartItems(cartItems.filter(item => item.userId !== userId));
      return true;
    } catch (err) {
      const message = 'Gagal mengosongkan keranjang';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    cartItems,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartTotal: cartItems.length,
    getCartByUser: (userId) => cartItems.filter(item => item.userId === userId)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
