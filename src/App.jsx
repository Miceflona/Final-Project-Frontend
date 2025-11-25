// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// --- PAGES ---
import LandingPage from './pages/LandingPage';
import CataloguePage from './pages/CataloguePage';
import DetailProduct from './pages/DetailProduct';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrders from './pages/MyOrders';

// --- PAGES SELLER ---
import MyProducts from './pages/Seller/MyProducts';
import AddProduct from './pages/Seller/AddProduct';
import EditProduct from './pages/Seller/EditProduct';

// --- PAGES AUTH ---
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import UserProfile from './pages/Auth/UserProfile';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />

              <div className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/catalogue" element={<CataloguePage />} />
                  <Route path="/product/:id" element={<DetailProduct />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Routes - Buyer & Seller */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/profile" element={<UserProfile />} />
                  </Route>

                  {/* Protected Routes - Seller Only */}
                  <Route element={<ProtectedRoute requiredRole="seller" />}>
                    <Route path="/seller" element={<MyProducts />} />
                    <Route path="/seller/add" element={<AddProduct />} />
                    <Route path="/seller/edit/:id" element={<EditProduct />} />
                  </Route>
                </Routes>
              </div>

              <Footer />
            </div>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
