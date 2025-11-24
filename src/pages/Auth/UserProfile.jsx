// src/pages/Auth/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  
  // State untuk data user dan mode edit
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // State untuk form edit
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    avatar: '',
    password: '' // Password disertakan jika ingin ganti pass
  });

  // 1. GET DATA (Saat halaman dibuka)
  useEffect(() => {
    // Ambil data dari LocalStorage (Session login)
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      alert("Anda harus login dulu!");
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser); // Isi form dengan data yang ada
    }
  }, [navigate]);

  // Handle perubahan input form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. PUT DATA (Simpan Perubahan)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Update ke database JSON Server
      // URL: /users/:id
      await axios.put(`http://localhost:3000/users/${user.id}`, formData);

      // Update LocalStorage agar Navbar juga berubah otomatis
      localStorage.setItem('user', JSON.stringify(formData));
      
      // Update State tampilan
      setUser(formData);
      setIsEditing(false); // Kembali ke mode "Lihat"
      alert('Profil berhasil diperbarui!');
      
      // Reload halaman agar Navbar mendeteksi nama baru
      window.location.reload(); 

    } catch (error) {
      console.error(error);
      alert('Gagal mengupdate profil.');
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Header Profil */}
        <div className="bg-[#8B4513] p-6 text-center">
            {/* Foto Profil Bulat */}
            <img 
              src={user.avatar || "https://placehold.co/150"} 
              alt="Profile" 
              className="w-32 h-32 rounded-full mx-auto border-4 border-white object-cover bg-gray-200"
            />
            <h2 className="text-2xl font-bold text-white mt-4">{user.fullName}</h2>
            <p className="text-orange-200">{user.role === 'seller' ? 'Penjual Terpercaya' : 'Member Setia'}</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Detail Akun</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition text-sm font-semibold"
              >
                Edit Profil
              </button>
            )}
          </div>

          {/* TAMPILAN MODE EDIT VS MODE LIHAT */}
          {isEditing ? (
            // --- MODE EDIT (FORM) ---
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Nama Lengkap</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Link Foto (Avatar)</label>
                <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://..." />
                <p className="text-xs text-gray-500 mt-1">Masukkan URL gambar dari internet.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Alamat Pengiriman</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" />
              </div>

              <div className="flex space-x-3 mt-4">
                <button type="submit" className="bg-[#8B4513] text-white px-6 py-2 rounded hover:bg-[#A0522D]">Simpan</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Batal</button>
              </div>
            </form>
          ) : (
            // --- MODE LIHAT (READ ONLY) ---
            <div className="space-y-4">
              <div className="border-b pb-3">
                <label className="block text-xs text-gray-500 uppercase">Email</label>
                <p className="text-lg font-medium text-gray-800">{user.email}</p>
              </div>
              <div className="border-b pb-3">
                <label className="block text-xs text-gray-500 uppercase">Alamat</label>
                <p className="text-lg font-medium text-gray-800">
                  {user.address && user.address !== "-" ? user.address : <span className="text-gray-400 italic">Belum diatur</span>}
                </p>
              </div>
              <div className="border-b pb-3">
                <label className="block text-xs text-gray-500 uppercase">Role</label>
                <span className="bg-orange-100 text-[#8B4513] px-3 py-1 rounded-full text-sm font-bold">
                  {user.role}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;