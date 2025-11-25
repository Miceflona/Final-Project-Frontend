// src/pages/Auth/UserProfile.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    avatar: '',
    password: ''
  });

  // Initialize form dengan user data
  useEffect(() => {
    if (!user) {
      alert('Anda harus login terlebih dahulu!');
      navigate('/login');
    } else {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        address: user.address || '',
        avatar: user.avatar || '',
        password: user.password || ''
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // PUT - Update profile
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(user.id, formData);
      setIsEditing(false);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      alert('Gagal mengupdate profil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10 mt-16">Loading...</div>;

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 mt-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Header Profil */}
        <div className="bg-[#8B4513] p-6 text-center">
          {/* Foto Profil */}
          <img 
            src={user.avatar || 'https://placehold.co/150'} 
            alt="Profile" 
            className="w-32 h-32 rounded-full mx-auto border-4 border-white object-cover bg-gray-200"
          />
          <h2 className="text-2xl font-bold text-white mt-4">{user.fullName}</h2>
          <p className="text-orange-200">
            {user.role === 'seller' ? '👑 Penjual Terpercaya' : '👤 Member Setia'}
          </p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Detail Akun</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition text-sm font-semibold"
              >
                Edit Profil
              </button>
            )}
          </div>

          {/* MODE EDIT vs MODE LIHAT */}
          {isEditing ? (
            // --- MODE EDIT (FORM) ---
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  disabled
                  title="Email tidak dapat diubah"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Link Foto (Avatar)</label>
                <input 
                  type="url" 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">Masukkan URL gambar dari internet</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Pengiriman</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Ubah password (optional)"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#8B4513] text-white px-6 py-2 rounded hover:bg-[#A0522D] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            // --- MODE LIHAT (READ ONLY) ---
            <div className="space-y-4">
              <div className="border-b pb-3">
                <label className="block text-xs text-gray-500 uppercase font-bold">Nama</label>
                <p className="text-lg font-medium text-gray-800">{user.fullName}</p>
              </div>

              <div className="border-b pb-3">
                <label className="block text-xs text-gray-500 uppercase font-bold">Email</label>
                <p className="text-lg font-medium text-gray-800">{user.email}</p>
              </div>

              <div className="border-b pb-3">
                <label className="block text-xs text-gray-500 uppercase font-bold">Alamat</label>
                <p className="text-lg font-medium text-gray-800">
                  {user.address && user.address !== "-" ? user.address : <span className="text-gray-400 italic">Belum diatur</span>}
                </p>
              </div>

              <div className="border-b pb-3">
                <label className="block text-xs text-gray-500 uppercase font-bold">Tipe Akun</label>
                <span className="bg-orange-100 text-[#8B4513] px-3 py-1 rounded-full text-sm font-bold inline-block">
                  {user.role === 'seller' ? '👑 Penjual' : '👤 Pembeli'}
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