// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CataloguePage from './pages/CataloguePage';
import DetailProduct from './pages/DetailProduct';
import MyProducts from './pages/Seller/MyProducts';
import AddProduct from './pages/Seller/AddProduct';
import EditProduct from './pages/Seller/EditProduct';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<CataloguePage />} />
          <Route path="/product/:id" element={<DetailProduct />} />
          <Route path="/seller" element={<MyProducts />} />
          <Route path="/seller/add" element={<AddProduct />} />
          <Route path="/seller/edit/:id" element={<EditProduct />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}