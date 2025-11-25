import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const OrderContext = createContext();

const API_URL = 'http://localhost:3000';

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET - Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
      return response.data;
    } catch (err) {
      const message = 'Gagal mengambil data pesanan';
      setError(message);
      console.error(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // GET - Fetch orders by user ID
  const fetchUserOrders = async (userId) => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/orders?userId=${userId}`);
      return response.data;
    } catch (err) {
      const message = 'Gagal mengambil pesanan pengguna';
      setError(message);
      throw new Error(message);
    }
  };

  // GET - Fetch single order by ID
  const fetchOrderById = async (orderId) => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (err) {
      const message = 'Pesanan tidak ditemukan';
      setError(message);
      throw new Error(message);
    }
  };

  // POST - Create new order
  const createOrder = async (orderData) => {
    try {
      setError(null);
      const newOrder = {
        id: `order_${Date.now()}`,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const response = await axios.post(`${API_URL}/orders`, newOrder);
      setOrders([...orders, response.data]);
      return response.data;
    } catch (err) {
      const message = 'Gagal membuat pesanan';
      setError(message);
      throw new Error(message);
    }
  };

  // PUT - Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/orders/${orderId}`, {
        status,
        updatedAt: new Date().toISOString()
      });
      setOrders(orders.map(order => order.id === orderId ? response.data : order));
      return response.data;
    } catch (err) {
      const message = 'Gagal mengubah status pesanan';
      setError(message);
      throw new Error(message);
    }
  };

  // PUT - Update entire order
  const updateOrder = async (orderId, updates) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/orders/${orderId}`, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      setOrders(orders.map(order => order.id === orderId ? response.data : order));
      return response.data;
    } catch (err) {
      const message = 'Gagal mengubah pesanan';
      setError(message);
      throw new Error(message);
    }
  };

  // DELETE - Cancel/delete order
  const cancelOrder = async (orderId) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/orders/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId));
      return true;
    } catch (err) {
      const message = 'Gagal membatalkan pesanan';
      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const value = {
    orders,
    loading,
    error,
    fetchOrders,
    fetchUserOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    updateOrder,
    cancelOrder,
    getUserOrders: (userId) => orders.filter(order => order.userId === userId)
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
