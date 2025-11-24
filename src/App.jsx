// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <--- 1. Import Footer

// --- PAGES ---
import LandingPage from './pages/LandingPage'; // <--- 2. Import Landing Page
import CataloguePage from './pages/CataloguePage';
import DetailProduct from './pages/DetailProduct';

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
    // Flex-col dan min-h-screen agar Footer selalu di bawah (sticky bottom)
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Navbar />
      
      {/* Content wrapper yang akan membesar (flex-grow) mengisi ruang kosong */}
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} /> {/* <--- 3. Root sekarang Landing Page */}
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/product/:id" element={<DetailProduct />} />
          
          {/* Seller Routes */}
          <Route path="/seller" element={<MyProducts />} />
          <Route path="/seller/add" element={<AddProduct />} />
          <Route path="/seller/edit/:id" element={<EditProduct />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>

      <Footer /> {/* <--- 4. Pasang Footer disini */}
      
    </div>
  );
}