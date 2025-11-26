import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductContext = createContext();

const API_URL = 'http://localhost:3000';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET - Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      return response.data;
    } catch (err) {
      const message = 'Gagal mengambil data produk';
      setError(message);
      console.error(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // GET - Fetch single product by ID
  const fetchProductById = async (id) => {
    try {
      setError(null);
      const targetId = String(id);
      const response = await axios.get(`${API_URL}/products/${targetId}`);
      return response.data;
    } catch (err) {
      const message = 'Produk tidak ditemukan';
      setError(message);
      throw new Error(message);
    }
  };

  // POST - Add new product
  const addProduct = async (productData) => {
    try {
      setError(null);
      const newProduct = {
        id: `prod_${Date.now()}`,
        ...productData,
        createdAt: new Date().toISOString()
      };
      const response = await axios.post(`${API_URL}/products`, newProduct);
      setProducts([...products, response.data]);
      return response.data;
    } catch (err) {
      const message = 'Gagal menambah produk';
      setError(message);
      throw new Error(message);
    }
  };

  // PUT - Update product
  const updateProduct = async (id, updates) => {
    try {
      setError(null);
      const targetId = String(id);
      const response = await axios.put(`${API_URL}/products/${targetId}`, updates);
      setProducts(products.map(p => String(p.id) === targetId ? response.data : p));
      return response.data;
    } catch (err) {
      const message = 'Gagal mengubah produk';
      setError(message);
      throw new Error(message);
    }
  };

  // DELETE - Remove product
  const deleteProduct = async (id) => {
    try {
      setError(null);
      const targetId = String(id);
      await axios.delete(`${API_URL}/products/${targetId}`);
      setProducts(products.filter(p => String(p.id) !== targetId));
      return true;
    } catch (err) {
      const message = 'Gagal menghapus produk';
      setError(message);
      throw new Error(message);
    }
  };

  // GET - Filter products by category
  const fetchProductsByCategory = async (category) => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/products?category=${category}`);
      return response.data;
    } catch (err) {
      const message = 'Gagal mengambil produk berdasarkan kategori';
      setError(message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProductsByCategory
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
