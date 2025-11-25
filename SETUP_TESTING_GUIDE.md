# Setup & Testing Guide

## 🎯 Quick Start

### Prerequisites
- Node.js v18+
- npm atau yarn

### Installation
```bash
cd Final-Project-Frontend
npm install
```

### Run Development Server
```bash
# Terminal 1 - Start Vite Dev Server
npm run dev
# Buka http://localhost:5173

# Terminal 2 - Start JSON Server
npx json-server --watch db.json --port 3000
```

---

## 📱 Testing Workflow

### 1. Buyer Registration & Login

#### Register Pembeli Baru
1. Buka http://localhost:5173
2. Klik "Daftar" atau akses `/register`
3. Isi form:
   - Nama: Anda Pembeli
   - Email: pembeli@toko.com
   - Password: 123
   - Role: **Pilih "Buyer"**
4. Klik "Daftar"
5. ✅ Sistem akan POST `/users` dengan data baru

#### Login Pembeli
1. Klik "Login"
2. Email: `pembeli@toko.com`
3. Password: `123`
4. ✅ Sistem akan GET `/users` dan validasi

---

### 2. Product Browsing

#### Lihat Daftar Produk (GET)
1. Dari home, scroll atau klik "Katalog"
2. ✅ Sistem GET `/products` dan tampilkan semua

#### Lihat Detail Produk (GET)
1. Klik pada kartu produk
2. ✅ Sistem GET `/products/:id`

#### Filter Produk (GET dengan query)
1. Di halaman katalog, pilih kategori
2. ✅ Sistem GET `/products?category=coffee`

---

### 3. Cart Operations

#### Tambah ke Keranjang (POST)
1. Login sebagai pembeli
2. Di halaman produk, klik "Tambah ke Keranjang"
3. ✅ Sistem POST `/cart` dengan:
   ```json
   {
     "id": "cart_xxx",
     "userId": "user_xxx",
     "productId": "prod_xxx",
     "quantity": 1
   }
   ```

#### Ubah Quantity (PUT)
1. Ke halaman "Keranjang Saya"
2. Klik `+` atau `-` pada quantity
3. ✅ Sistem PUT `/cart/:id` dengan quantity baru

#### Hapus dari Keranjang (DELETE)
1. Ke halaman "Keranjang Saya"
2. Klik tombol Hapus
3. ✅ Sistem DELETE `/cart/:id`

#### Lihat Keranjang (GET)
1. Klik ikon keranjang di navbar
2. Badge menunjukkan jumlah item
3. ✅ Sistem GET `/cart?userId=xxx`

---

### 4. Checkout & Orders

#### Checkout (POST Order + DELETE Cart)
1. Login sebagai pembeli
2. Tambah produk ke keranjang
3. Klik "Checkout"
4. Isi detail pengiriman
5. Klik "Pesan Sekarang"
6. ✅ Sistem akan:
   - POST `/orders` dengan data pesanan
   - DELETE `/cart/*` untuk setiap item keranjang
   - Redirect ke `/my-orders`

#### Lihat Pesanan Saya (GET)
1. Dari navbar, klik "Pesanan Saya"
2. ✅ Sistem GET `/orders?userId=xxx`
3. Tampil daftar pesanan terurut berdasarkan tanggah

#### Batalkan Pesanan (DELETE)
1. Di "Pesanan Saya", klik "Batalkan"
2. Konfirmasi pembatalan
3. ✅ Sistem DELETE `/orders/:id`

---

### 5. User Profile

#### Update Profil (PUT)
1. Login
2. Klik nama user → "Profil Saya"
3. Klik "Edit"
4. Ubah data (nama, alamat, foto)
5. Klik "Simpan"
6. ✅ Sistem PUT `/users/:id` dengan data baru

---

### 6. Seller Dashboard

#### Register Penjual Baru
1. Klik "Daftar"
2. Isi form:
   - Nama: Toko Anda
   - Email: penjual@toko.com
   - Password: 123
   - Role: **Pilih "Seller"**
3. ✅ Sistem POST `/users` dengan role seller

#### Login Penjual
1. Email: `penjual@toko.com`
2. Password: `123`
3. ✅ Redirect ke `/seller` (Protected Route)

#### Tambah Produk Baru (POST)
1. Login sebagai penjual
2. Ke "Dashboard → Tambah Produk"
3. Isi form:
   - Nama Produk: Kopi Arabika Premium
   - Kategori: Coffee / Non-Coffee
   - Harga: 50000
   - Deskripsi: Lorem ipsum
   - Gambar URL: https://...
4. Klik "Tambah"
5. ✅ Sistem POST `/products`:
   ```json
   {
     "id": "prod_xxx",
     "name": "Kopi Arabika Premium",
     "category": "coffee",
     "price": 50000,
     "description": "Lorem ipsum",
     "image": "https://...",
     "createdAt": "2025-11-25T..."
   }
   ```

#### Edit Produk (GET + PUT)
1. Di "Produk Saya", klik "Edit"
2. ✅ Sistem GET `/products/:id` untuk load data
3. Ubah data (harga, deskripsi, dll)
4. Klik "Simpan"
5. ✅ Sistem PUT `/products/:id` dengan data baru

#### Hapus Produk (DELETE)
1. Di "Produk Saya", klik "Hapus"
2. Konfirmasi penghapusan
3. ✅ Sistem DELETE `/products/:id`

#### Lihat Produk Saya (GET)
1. Login penjual
2. Ke "Dashboard → Produk Saya"
3. ✅ Sistem GET `/products` (filter by seller jika ada di backend)

---

## 🐛 Debugging Tips

### Check Console Errors
1. Buka DevTools (F12)
2. Tab "Console" - lihat error messages
3. Tab "Network" - lihat API calls

### View db.json
1. Buka file `db.json` di editor
2. Verify data structure sesuai POST/PUT operations

### Check JSON Server Logs
1. Lihat terminal JSON Server
2. Setiap request akan di-log

---

## 📊 API Testing dengan Postman/Insomnia

### 1. Test Login (GET)
```bash
GET http://localhost:3000/users
```
Response: Array semua users

### 2. Test Create Product (POST)
```bash
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Test Kopi",
  "category": "coffee",
  "price": 50000,
  "description": "Test",
  "image": "https://..."
}
```

### 3. Test Update Product (PUT)
```bash
PUT http://localhost:3000/products/prod_xxx
Content-Type: application/json

{
  "name": "Test Kopi Updated",
  "price": 60000
}
```

### 4. Test Delete Product (DELETE)
```bash
DELETE http://localhost:3000/products/prod_xxx
```

---

## ✅ Verification Checklist

- [ ] npm install berhasil tanpa error
- [ ] npm run dev berjalan di localhost:5173
- [ ] JSON Server running di localhost:3000
- [ ] Bisa register pembeli baru
- [ ] Bisa login dengan pembeli
- [ ] Bisa lihat daftar produk
- [ ] Bisa tambah produk ke keranjang
- [ ] Bisa ubah quantity keranjang
- [ ] Bisa hapus dari keranjang
- [ ] Bisa checkout
- [ ] Bisa lihat pesanan saya
- [ ] Bisa batalkan pesanan
- [ ] Bisa edit profil
- [ ] Bisa register penjual baru
- [ ] Bisa login sebagai penjual
- [ ] Bisa tambah produk (seller)
- [ ] Bisa edit produk (seller)
- [ ] Bisa hapus produk (seller)
- [ ] db.json terupdate setiap operasi
- [ ] Tidak ada error di console

---

## 🔧 Troubleshooting

### Issue: "Cannot find module 'axios'"
**Solution:**
```bash
npm install axios
```

### Issue: "JSON Server not responding"
**Solution:**
```bash
# Kill existing process
# Restart JSON Server
npx json-server --watch db.json --port 3000
```

### Issue: "404 Not Found"
**Solution:**
- Pastikan JSON Server running di port 3000
- Check endpoint path di code
- Verify data structure di db.json

### Issue: "CORS Error"
**Solution:**
- JSON Server sudah support CORS by default
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📝 Notes

- Semua data disimpan di `db.json`
- ID auto-generated dengan format `type_timestamp` (contoh: `user_1700000000`)
- Password disimpan plain text (untuk development saja, jangan di production)
- Cart item tidak auto-delete jika product dihapus
- Order tidak bisa diedit setelah dibuat, hanya bisa dibatalkan

---

**Last Updated: November 25, 2025**
