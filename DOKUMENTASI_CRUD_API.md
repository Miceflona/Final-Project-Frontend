# Dokumentasi Lengkap - Implementasi CRUD API

## 📋 Ringkasan Implementasi

Aplikasi AM-PM Coffee telah diimplementasikan dengan **fitur CRUD lengkap** menggunakan React Context API dan JSON Server. Berikut adalah dokumentasi lengkap untuk semua operasi CRUD (CREATE, READ, UPDATE, DELETE).

---

## 🏗️ Struktur Arsitektur

### Context Providers (Pengganti Redux)
```
src/context/
├── AuthContext.jsx      → Mengelola autentikasi (login/register/logout)
├── ProductContext.jsx   → CRUD Produk (GET, POST, PUT, DELETE)
├── CartContext.jsx      → CRUD Keranjang (GET, POST, PUT, DELETE)
└── OrderContext.jsx     → CRUD Pesanan (GET, POST, PUT, DELETE)
```

### Alur Data:
```
User Interface (Components)
          ↓
   React Context (Business Logic)
          ↓
    Axios API Calls
          ↓
    JSON Server (API Backend)
          ↓
    db.json (Database)
```

---

## 🔐 1. AUTHENTIKASI (AuthContext.jsx)

### 1.1 GET - Mengambil Data User
**File:** `src/context/AuthContext.jsx` (fungsi `login`)

```javascript
// GET - Validasi Login
const login = async (email, password) => {
  const response = await axios.get(`${API_URL}/users`);
  const users = response.data;
  const foundUser = users.find(u => u.email === email && u.password === password);
  
  if (!foundUser) throw new Error('Email atau password salah');
  
  localStorage.setItem('user', JSON.stringify(foundUser));
  setUser(foundUser);
  return foundUser;
};
```

**Implementasi di:** `src/pages/Auth/LoginPage.jsx`

```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    await login(email, password);
    navigate('/');
  } catch (err) {
    setError(err.message || 'Email atau Password salah!');
  } finally {
    setLoading(false);
  }
};
```

### 1.2 POST - Membuat Akun Baru
**File:** `src/context/AuthContext.jsx` (fungsi `register`)

```javascript
// POST - Create new user
const register = async (fullName, email, password, role = 'buyer') => {
  // Validasi email belum terdaftar
  const checkResponse = await axios.get(`${API_URL}/users`);
  const emailExists = checkResponse.data.some(u => u.email === email);
  
  if (emailExists) throw new Error('Email sudah terdaftar');

  const newUser = {
    id: `user_${Date.now()}`,
    fullName, email, password, role,
    avatar: 'https://placehold.co/100',
    address: '-'
  };

  const response = await axios.post(`${API_URL}/users`, newUser);
  setUser(response.data);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};
```

**Implementasi di:** `src/pages/Auth/RegisterPage.jsx`

### 1.3 PUT - Update Profil User
**File:** `src/context/AuthContext.jsx` (fungsi `updateProfile`)

```javascript
// PUT - Update user profile
const updateProfile = async (userId, updates) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, updates);
  setUser(response.data);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};
```

**Implementasi di:** `src/pages/Auth/UserProfile.jsx`

```javascript
const handleSave = async (e) => {
  e.preventDefault();
  try {
    await updateProfile(user.id, formData);
    alert('Profil berhasil diperbarui!');
    setIsEditing(false);
  } catch (error) {
    alert('Gagal mengupdate profil: ' + error.message);
  }
};
```

---

## 📦 2. PRODUK (ProductContext.jsx)

### 2.1 GET - Mengambil Semua Produk
**File:** `src/context/ProductContext.jsx`

```javascript
// GET - Fetch all products
const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  setProducts(response.data);
  return response.data;
};
```

**Digunakan di:**
- `src/pages/CataloguePage.jsx` - Menampilkan daftar produk
- `src/pages/Seller/MyProducts.jsx` - Dashboard penjual

### 2.2 GET - Mengambil Produk Berdasarkan ID
**File:** `src/context/ProductContext.jsx`

```javascript
// GET - Fetch single product by ID
const fetchProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};
```

**Digunakan di:** 
- `src/pages/DetailProduct.jsx` - Halaman detail produk
- `src/pages/Seller/EditProduct.jsx` - Edit produk

### 2.3 POST - Membuat Produk Baru
**File:** `src/context/ProductContext.jsx`

```javascript
// POST - Add new product
const addProduct = async (productData) => {
  const newProduct = {
    id: `prod_${Date.now()}`,
    ...productData,
    createdAt: new Date().toISOString()
  };
  const response = await axios.post(`${API_URL}/products`, newProduct);
  setProducts([...products, response.data]);
  return response.data;
};
```

**Implementasi di:** `src/pages/Seller/AddProduct.jsx`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const newProduct = {
      ...formData,
      price: Number(formData.price)
    };
    await addProduct(newProduct);
    alert('Produk berhasil ditambahkan!');
    navigate('/seller');
  } catch (err) {
    setError('Gagal menambah produk: ' + err.message);
  }
};
```

### 2.4 PUT - Mengubah Produk
**File:** `src/context/ProductContext.jsx`

```javascript
// PUT - Update product
const updateProduct = async (id, updates) => {
  const response = await axios.put(`${API_URL}/products/${id}`, updates);
  setProducts(products.map(p => p.id === id ? response.data : p));
  return response.data;
};
```

**Implementasi di:** `src/pages/Seller/EditProduct.jsx`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const updatedProduct = {
      ...formData,
      price: Number(formData.price)
    };
    await updateProduct(id, updatedProduct);
    alert('Produk berhasil diubah!');
    navigate('/seller');
  } catch (err) {
    setError('Gagal mengubah produk: ' + err.message);
  }
};
```

### 2.5 DELETE - Menghapus Produk
**File:** `src/context/ProductContext.jsx`

```javascript
// DELETE - Remove product
const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/products/${id}`);
  setProducts(products.filter(p => p.id !== id));
  return true;
};
```

**Implementasi di:** `src/pages/Seller/MyProducts.jsx`

```javascript
const handleDelete = async (id, name) => {
  if (setConfirmDelete === id) {
    try {
      await deleteProduct(id);
      alert(`Produk "${name}" berhasil dihapus`);
      setConfirmDelete(null);
    } catch (err) {
      alert('Gagal menghapus produk: ' + err.message);
    }
  }
};
```

---

## 🛒 3. KERANJANG (CartContext.jsx)

### 3.1 GET - Mengambil Cart User
**File:** `src/context/CartContext.jsx`

```javascript
// GET - Fetch cart items for user
const fetchCart = async (userId) => {
  const response = await axios.get(`${API_URL}/cart?userId=${userId}`);
  setCartItems(response.data);
  return response.data;
};
```

**Implementasi di:** `src/pages/CartPage.jsx`, `src/pages/CheckoutPage.jsx`

### 3.2 POST - Menambah Item ke Keranjang
**File:** `src/context/CartContext.jsx`

```javascript
// POST - Add item to cart
const addToCart = async (userId, productId, quantity = 1) => {
  const existingItem = cartItems.find(
    item => item.userId === userId && item.productId === productId
  );

  if (existingItem) {
    // Update quantity jika sudah ada
    return updateCartItem(existingItem.id, existingItem.quantity + quantity);
  }

  const newCartItem = {
    id: `cart_${Date.now()}`,
    userId, productId, quantity
  };
  const response = await axios.post(`${API_URL}/cart`, newCartItem);
  setCartItems([...cartItems, response.data]);
  return response.data;
};
```

**Implementasi di:** `src/components/ProductCard.jsx`

```javascript
const handleAddToCart = async (e) => {
  e.preventDefault();
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    await addToCart(user.id, product.id, 1);
    setMessage('Ditambahkan ke keranjang!');
  } catch (error) {
    setMessage('Gagal menambah ke keranjang');
  }
};
```

### 3.3 PUT - Mengubah Quantity Keranjang
**File:** `src/context/CartContext.jsx`

```javascript
// PUT - Update cart item quantity
const updateCartItem = async (cartItemId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }
  const response = await axios.put(`${API_URL}/cart/${cartItemId}`, { quantity });
  setCartItems(cartItems.map(item => item.id === cartItemId ? response.data : item));
  return response.data;
};
```

**Implementasi di:** `src/pages/CartPage.jsx`

```javascript
const handleQuantityChange = async (cartItemId, newQuantity) => {
  if (newQuantity <= 0) return;
  try {
    await updateCartItem(cartItemId, newQuantity);
  } catch (err) {
    alert('Gagal mengubah quantity: ' + err.message);
  }
};
```

### 3.4 DELETE - Menghapus Item dari Keranjang
**File:** `src/context/CartContext.jsx`

```javascript
// DELETE - Remove item from cart
const removeFromCart = async (cartItemId) => {
  await axios.delete(`${API_URL}/cart/${cartItemId}`);
  setCartItems(cartItems.filter(item => item.id !== cartItemId));
  return true;
};
```

**Implementasi di:** `src/pages/CartPage.jsx`

```javascript
const handleRemove = async (cartItemId) => {
  if (window.confirm('Yakin ingin menghapus produk ini?')) {
    try {
      await removeFromCart(cartItemId);
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  }
};
```

---

## 📋 4. PESANAN (OrderContext.jsx)

### 4.1 GET - Mengambil Semua Pesanan
**File:** `src/context/OrderContext.jsx`

```javascript
// GET - Fetch all orders
const fetchOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  setOrders(response.data);
  return response.data;
};
```

### 4.2 GET - Mengambil Pesanan Berdasarkan User
**File:** `src/context/OrderContext.jsx`

```javascript
// GET - Fetch orders by user ID
const fetchUserOrders = async (userId) => {
  const response = await axios.get(`${API_URL}/orders?userId=${userId}`);
  return response.data;
};
```

**Implementasi di:** `src/pages/MyOrders.jsx`

```javascript
const loadOrders = async () => {
  try {
    const data = await fetchUserOrders(user.id);
    const sorted = data.sort((a, b) => 
      new Date(b.orderDate) - new Date(a.orderDate)
    );
    setUserOrders(sorted);
  } catch (err) {
    console.error('Gagal memuat pesanan:', err);
  }
};
```

### 4.3 POST - Membuat Pesanan Baru
**File:** `src/context/OrderContext.jsx`

```javascript
// POST - Create new order
const createOrder = async (orderData) => {
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
};
```

**Implementasi di:** `src/pages/CheckoutPage.jsx`

```javascript
const handlePlaceOrder = async (e) => {
  e.preventDefault();
  
  const orderData = {
    userId: user.id,
    items: cartDetails.map(item => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    })),
    totalAmount: calculateTotal(),
    orderDate: new Date().toISOString(),
    status: 'pending',
    shippingDetails: shippingDetails
  };

  try {
    await createOrder(orderData);
    await clearCart(user.id);
    navigate('/my-orders');
  } catch (err) {
    setError('Gagal membuat pesanan: ' + err.message);
  }
};
```

### 4.4 PUT - Mengubah Status Pesanan
**File:** `src/context/OrderContext.jsx`

```javascript
// PUT - Update order status
const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(`${API_URL}/orders/${orderId}`, {
    status,
    updatedAt: new Date().toISOString()
  });
  setOrders(orders.map(order => order.id === orderId ? response.data : order));
  return response.data;
};
```

### 4.5 DELETE - Membatalkan Pesanan
**File:** `src/context/OrderContext.jsx`

```javascript
// DELETE - Cancel/delete order
const cancelOrder = async (orderId) => {
  await axios.delete(`${API_URL}/orders/${orderId}`);
  setOrders(orders.filter(order => order.id !== orderId));
  return true;
};
```

**Implementasi di:** `src/pages/MyOrders.jsx`

```javascript
const handleCancelOrder = async (orderId) => {
  if (window.confirm('Yakin ingin membatalkan pesanan ini?')) {
    try {
      await cancelOrder(orderId);
      setUserOrders(userOrders.filter(order => order.id !== orderId));
      alert('Pesanan berhasil dibatalkan');
    } catch (err) {
      alert('Gagal membatalkan pesanan: ' + err.message);
    }
  }
};
```

---

## 📊 API Endpoints Reference

### Users (Autentikasi)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users` | Mengambil semua users |
| GET | `/users/:id` | Mengambil user berdasarkan ID |
| POST | `/users` | Membuat user baru |
| PUT | `/users/:id` | Mengubah data user |
| DELETE | `/users/:id` | Menghapus user |

### Products
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/products` | Mengambil semua produk |
| GET | `/products/:id` | Mengambil produk berdasarkan ID |
| GET | `/products?category=coffee` | Filter produk per kategori |
| POST | `/products` | Membuat produk baru |
| PUT | `/products/:id` | Mengubah data produk |
| DELETE | `/products/:id` | Menghapus produk |

### Cart
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/cart?userId=xxx` | Mengambil keranjang user |
| POST | `/cart` | Menambah item ke keranjang |
| PUT | `/cart/:id` | Mengubah quantity item |
| DELETE | `/cart/:id` | Menghapus item dari keranjang |

### Orders
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/orders` | Mengambil semua pesanan |
| GET | `/orders?userId=xxx` | Mengambil pesanan user |
| GET | `/orders/:id` | Mengambil pesanan berdasarkan ID |
| POST | `/orders` | Membuat pesanan baru |
| PUT | `/orders/:id` | Mengubah status pesanan |
| DELETE | `/orders/:id` | Membatalkan pesanan |

---

## 🔄 HTTP Methods Explanation

### GET (Read)
- **Fungsi:** Mengambil/membaca data dari server
- **Keamanan:** Safe (tidak mengubah data)
- **Contoh:** 
  - `axios.get('/products')` → Ambil semua produk
  - `axios.get('/users/123')` → Ambil user dengan ID 123

### POST (Create)
- **Fungsi:** Membuat data baru di server
- **Keamanan:** Tidak safe (mengubah data)
- **Contoh:**
  - `axios.post('/products', newProduct)` → Tambah produk baru
  - `axios.post('/orders', orderData)` → Buat pesanan baru

### PUT (Update)
- **Fungsi:** Mengubah data yang sudah ada
- **Keamanan:** Tidak safe (mengubah data)
- **Contoh:**
  - `axios.put('/products/1', updatedData)` → Update produk dengan ID 1
  - `axios.put('/users/1', newProfileData)` → Update profil user

### DELETE (Delete)
- **Fungsi:** Menghapus data dari server
- **Keamanan:** Tidak safe (mengubah data)
- **Contoh:**
  - `axios.delete('/products/1')` → Hapus produk dengan ID 1
  - `axios.delete('/cart/123')` → Hapus item dari keranjang

---

## 📁 Struktur File Penting

```
src/
├── context/
│   ├── AuthContext.jsx      ✅ CRUD Users (Login/Register/Update)
│   ├── ProductContext.jsx   ✅ CRUD Products
│   ├── CartContext.jsx      ✅ CRUD Cart
│   └── OrderContext.jsx     ✅ CRUD Orders
│
├── pages/
│   ├── Auth/
│   │   ├── LoginPage.jsx         ✅ GET + POST (login)
│   │   ├── RegisterPage.jsx      ✅ POST (create account)
│   │   └── UserProfile.jsx       ✅ GET + PUT (update profile)
│   │
│   ├── CartPage.jsx              ✅ GET + PUT + DELETE (cart)
│   ├── CheckoutPage.jsx          ✅ POST (create order)
│   ├── MyOrders.jsx              ✅ GET + DELETE (orders)
│   │
│   ├── CataloguePage.jsx         ✅ GET (products)
│   ├── DetailProduct.jsx         ✅ GET (single product)
│   │
│   └── Seller/
│       ├── MyProducts.jsx        ✅ GET + DELETE
│       ├── AddProduct.jsx        ✅ POST
│       └── EditProduct.jsx       ✅ GET + PUT
│
├── components/
│   ├── Navbar.jsx                ✅ Integrasi dengan AuthContext
│   ├── ProductCard.jsx           ✅ POST (add to cart)
│   └── ProtectedRoute.jsx        ✅ Route protection
│
└── App.jsx                         ✅ Provider setup
```

---

## 🚀 Testing CRUD Operations

### 1. Test Login (GET)
1. Klik "Login"
2. Email: `test@toko.com`, Password: `123`
3. Sistem akan GET `/users` dan validasi

### 2. Test Create Order (POST)
1. Login sebagai Pembeli
2. Tambah produk ke keranjang (POST)
3. Ke checkout
4. Isi data pengiriman
5. Klik "Pesan Sekarang" → POST `/orders`

### 3. Test Update Produk (PUT)
1. Login sebagai Penjual
2. Ke Dashboard → Produk Saya
3. Klik Edit pada produk
4. Ubah data → Klik Simpan
5. Sistem PUT `/products/:id` dengan data baru

### 4. Test Delete (DELETE)
1. Login sebagai Penjual
2. Ke Dashboard → Produk Saya
3. Klik Hapus pada produk
4. Konfirmasi → DELETE `/products/:id`

---

## ✅ Checklist Implementasi

- ✅ **GET** - Mengambil data (Users, Products, Cart, Orders)
- ✅ **POST** - Membuat data baru (Register, Add Product, Add to Cart, Create Order)
- ✅ **PUT** - Mengubah data (Update Profile, Update Product, Update Cart Quantity, Update Order)
- ✅ **DELETE** - Menghapus data (Delete Product, Delete Cart Item, Cancel Order)
- ✅ Context API untuk State Management
- ✅ Error Handling di setiap operasi
- ✅ Loading States
- ✅ Protected Routes based on Role
- ✅ Local Storage untuk Session Persistence

---

## 📞 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Seller | test@toko.com | 123 |
| Buyer | c@toko.com | 123 |

---

**Dokumentasi dibuat pada: November 25, 2025**
