// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-amber-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">AM-PM COFFE</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Catalogue</Link>
          <Link to="/seller" className="hover:underline">Seller Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}