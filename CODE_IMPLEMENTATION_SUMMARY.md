# Ringkasan Implementasi Code

## 📝 Overview

Dokumen ini berisi ringkasan code implementasi untuk setiap CRUD operation di seluruh aplikasi.

---

## 🔐 1. AUTH CONTEXT (AuthContext.jsx)

### Struktur Context
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ... methods
  
  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Method 1: LOGIN (GET)
```javascript
const login = async (email, password) => {
  setLoading(true);
  setError(null);
  
  try {
    // GET request ke /users
    const response = await axios.get(`${API_URL}/users`);
    
    // Cari user dengan email & password yang cocok
    const foundUser = response.data.find(
      u => u.email === email && u.password === password
    );
    
    if (!foundUser) {
      throw new Error('Email atau password salah');
    }
    
    // Simpan ke localStorage
    localStorage.setItem('user', JSON.stringify(foundUser));
    setUser(foundUser);
    
    return foundUser;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `LoginPage.jsx`
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await login(email, password);
    navigate('/'); // Redirect ke home
  } catch (err) {
    setError(err.message || 'Login gagal');
  }
};
```

### Method 2: REGISTER (POST)
```javascript
const register = async (fullName, email, password, role = 'buyer') => {
  setLoading(true);
  setError(null);
  
  try {
    // Validasi email belum terdaftar
    const checkResponse = await axios.get(`${API_URL}/users`);
    const emailExists = checkResponse.data.some(u => u.email === email);
    
    if (emailExists) {
      throw new Error('Email sudah terdaftar');
    }

    // Buat user baru
    const newUser = {
      id: `user_${Date.now()}`,
      fullName,
      email,
      password,
      role,
      avatar: 'https://placehold.co/100',
      address: '-'
    };

    // POST ke /users
    const response = await axios.post(`${API_URL}/users`, newUser);
    
    // Simpan ke state
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `RegisterPage.jsx`
```javascript
const handleRegister = async (e) => {
  e.preventDefault();
  
  // Validasi form
  if (!fullName || !email || !password) {
    setError('Semua field harus diisi');
    return;
  }
  
  try {
    await register(fullName, email, password, role);
    alert('Registrasi berhasil! Silakan login');
    navigate('/login');
  } catch (err) {
    setError(err.message || 'Registrasi gagal');
  }
};
```

### Method 3: UPDATE PROFILE (PUT)
```javascript
const updateProfile = async (userId, updates) => {
  setLoading(true);
  setError(null);
  
  try {
    // PUT ke /users/:id
    const response = await axios.put(
      `${API_URL}/users/${userId}`, 
      updates
    );
    
    // Update state
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `UserProfile.jsx`
```javascript
const handleSave = async (e) => {
  e.preventDefault();
  
  try {
    await updateProfile(user.id, {
      fullName: formData.fullName,
      address: formData.address,
      avatar: formData.avatar
    });
    
    alert('Profil berhasil diperbarui!');
    setIsEditing(false);
  } catch (error) {
    alert('Gagal update: ' + error.message);
  }
};
```

### Method 4: LOGOUT
```javascript
const logout = () => {
  setUser(null);
  localStorage.removeItem('user');
};
```

---

## 📦 2. PRODUCT CONTEXT (ProductContext.jsx)

### Method 1: GET - Fetch All Products
```javascript
const fetchProducts = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // GET /products
    const response = await axios.get(`${API_URL}/products`);
    setProducts(response.data);
    return response.data;
  } catch (err) {
    setError('Gagal memuat produk');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `CataloguePage.jsx`
```javascript
useEffect(() => {
  const loadProducts = async () => {
    try {
      await fetchProducts();
    } catch (err) {
      console.error('Error:', err);
    }
  };
  loadProducts();
}, []);
```

### Method 2: GET - Fetch Product by ID
```javascript
const fetchProductById = async (id) => {
  try {
    // GET /products/:id
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (err) {
    setError('Produk tidak ditemukan');
    throw err;
  }
};
```

**Digunakan di:** `DetailProduct.jsx`, `EditProduct.jsx`
```javascript
useEffect(() => {
  const loadProduct = async () => {
    try {
      const data = await fetchProductById(productId);
      setProduct(data);
    } catch (err) {
      setError('Produk tidak ditemukan');
    }
  };
  loadProduct();
}, [productId]);
```

### Method 3: POST - Add New Product
```javascript
const addProduct = async (productData) => {
  try {
    const newProduct = {
      id: `prod_${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString()
    };
    
    // POST /products
    const response = await axios.post(`${API_URL}/products`, newProduct);
    setProducts([...products, response.data]);
    
    return response.data;
  } catch (err) {
    setError('Gagal menambah produk');
    throw err;
  }
};
```

**Digunakan di:** `AddProduct.jsx`
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description,
      image: formData.image
    };
    
    await addProduct(productData);
    alert('Produk berhasil ditambahkan!');
    navigate('/seller');
  } catch (err) {
    setError('Gagal menambah produk: ' + err.message);
  }
};
```

### Method 4: PUT - Update Product
```javascript
const updateProduct = async (id, updates) => {
  try {
    // PUT /products/:id
    const response = await axios.put(
      `${API_URL}/products/${id}`,
      updates
    );
    
    // Update state - ganti product lama dengan yang baru
    setProducts(products.map(
      p => p.id === id ? response.data : p
    ));
    
    return response.data;
  } catch (err) {
    setError('Gagal mengubah produk');
    throw err;
  }
};
```

**Digunakan di:** `EditProduct.jsx`
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const updatedData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description,
      image: formData.image
    };
    
    await updateProduct(productId, updatedData);
    alert('Produk berhasil diubah!');
    navigate('/seller');
  } catch (err) {
    setError('Gagal update produk: ' + err.message);
  }
};
```

### Method 5: DELETE - Remove Product
```javascript
const deleteProduct = async (id) => {
  try {
    // DELETE /products/:id
    await axios.delete(`${API_URL}/products/${id}`);
    
    // Hapus dari state
    setProducts(products.filter(p => p.id !== id));
    
    return true;
  } catch (err) {
    setError('Gagal menghapus produk');
    throw err;
  }
};
```

**Digunakan di:** `MyProducts.jsx`
```javascript
const handleDelete = async (productId) => {
  if (window.confirm('Yakin ingin menghapus produk ini?')) {
    try {
      await deleteProduct(productId);
      alert('Produk berhasil dihapus');
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  }
};
```

---

## 🛒 3. CART CONTEXT (CartContext.jsx)

### Method 1: GET - Fetch Cart by User
```javascript
const fetchCart = async (userId) => {
  setLoading(true);
  
  try {
    // GET /cart?userId=xxx
    const response = await axios.get(
      `${API_URL}/cart?userId=${userId}`
    );
    setCartItems(response.data);
    return response.data;
  } catch (err) {
    setError('Gagal memuat keranjang');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `CartPage.jsx`
```javascript
useEffect(() => {
  if (user) {
    const loadCart = async () => {
      try {
        await fetchCart(user.id);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    loadCart();
  }
}, [user]);
```

### Method 2: POST - Add to Cart
```javascript
const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // Cek apakah item sudah ada
    const existingItem = cartItems.find(
      item => item.userId === userId && item.productId === productId
    );
    
    if (existingItem) {
      // Jika sudah ada, update quantity
      return updateCartItem(
        existingItem.id, 
        existingItem.quantity + quantity
      );
    }
    
    // Buat cart item baru
    const newCartItem = {
      id: `cart_${Date.now()}`,
      userId,
      productId,
      quantity
    };
    
    // POST /cart
    const response = await axios.post(
      `${API_URL}/cart`,
      newCartItem
    );
    
    setCartItems([...cartItems, response.data]);
    return response.data;
  } catch (err) {
    setError('Gagal menambah ke keranjang');
    throw err;
  }
};
```

**Digunakan di:** `ProductCard.jsx`
```javascript
const handleAddToCart = async (e) => {
  e.preventDefault();
  
  // Cek login
  if (!user) {
    navigate('/login');
    return;
  }
  
  try {
    await addToCart(user.id, product.id, 1);
    setMessage('✅ Ditambahkan ke keranjang!');
    setTimeout(() => setMessage(''), 3000);
  } catch (error) {
    setMessage('❌ Gagal menambah');
  }
};
```

### Method 3: PUT - Update Cart Item Quantity
```javascript
const updateCartItem = async (cartItemId, quantity) => {
  try {
    // Jika quantity <= 0, hapus item
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    // PUT /cart/:id
    const response = await axios.put(
      `${API_URL}/cart/${cartItemId}`,
      { quantity }
    );
    
    setCartItems(cartItems.map(
      item => item.id === cartItemId ? response.data : item
    ));
    
    return response.data;
  } catch (err) {
    setError('Gagal mengubah quantity');
    throw err;
  }
};
```

**Digunakan di:** `CartPage.jsx`
```javascript
const handleQuantityChange = async (cartItemId, newQuantity) => {
  if (newQuantity <= 0) return;
  
  try {
    await updateCartItem(cartItemId, newQuantity);
  } catch (err) {
    alert('Gagal update quantity: ' + err.message);
  }
};
```

### Method 4: DELETE - Remove from Cart
```javascript
const removeFromCart = async (cartItemId) => {
  try {
    // DELETE /cart/:id
    await axios.delete(`${API_URL}/cart/${cartItemId}`);
    
    setCartItems(cartItems.filter(
      item => item.id !== cartItemId
    ));
    
    return true;
  } catch (err) {
    setError('Gagal menghapus item');
    throw err;
  }
};
```

**Digunakan di:** `CartPage.jsx`
```javascript
const handleRemove = async (cartItemId) => {
  if (window.confirm('Hapus dari keranjang?')) {
    try {
      await removeFromCart(cartItemId);
    } catch (err) {
      alert('Gagal: ' + err.message);
    }
  }
};
```

### Method 5: Clear Cart (Helper)
```javascript
const clearCart = async (userId) => {
  try {
    // Ambil semua item milik user
    const userCartItems = cartItems.filter(
      item => item.userId === userId
    );
    
    // DELETE setiap item
    await Promise.all(
      userCartItems.map(item => 
        axios.delete(`${API_URL}/cart/${item.id}`)
      )
    );
    
    // Update state
    setCartItems(cartItems.filter(item => item.userId !== userId));
  } catch (err) {
    setError('Gagal mengosongkan keranjang');
    throw err;
  }
};
```

**Digunakan di:** `CheckoutPage.jsx`
```javascript
const handlePlaceOrder = async (e) => {
  e.preventDefault();
  
  try {
    // Create order
    await createOrder(orderData);
    
    // Clear cart
    await clearCart(user.id);
    
    // Redirect
    navigate('/my-orders');
  } catch (err) {
    setError('Gagal checkout: ' + err.message);
  }
};
```

---

## 📋 4. ORDER CONTEXT (OrderContext.jsx)

### Method 1: GET - Fetch Orders by User
```javascript
const fetchUserOrders = async (userId) => {
  setLoading(true);
  
  try {
    // GET /orders?userId=xxx
    const response = await axios.get(
      `${API_URL}/orders?userId=${userId}`
    );
    
    // Sort by date (terbaru dulu)
    const sorted = response.data.sort((a, b) =>
      new Date(b.orderDate) - new Date(a.orderDate)
    );
    
    return sorted;
  } catch (err) {
    setError('Gagal memuat pesanan');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `MyOrders.jsx`
```javascript
useEffect(() => {
  if (user) {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders(user.id);
        setUserOrders(data);
      } catch (err) {
        console.error('Error:', err);
      }
    };
    loadOrders();
  }
}, [user]);
```

### Method 2: POST - Create Order
```javascript
const createOrder = async (orderData) => {
  setLoading(true);
  
  try {
    const newOrder = {
      id: `order_${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // POST /orders
    const response = await axios.post(
      `${API_URL}/orders`,
      newOrder
    );
    
    setOrders([...orders, response.data]);
    return response.data;
  } catch (err) {
    setError('Gagal membuat pesanan');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `CheckoutPage.jsx`
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
    shippingDetails: {
      recipientName: shippingDetails.name,
      address: shippingDetails.address,
      phone: shippingDetails.phone
    }
  };
  
  try {
    await createOrder(orderData);
    alert('Pesanan berhasil dibuat!');
    navigate('/my-orders');
  } catch (err) {
    setError('Gagal membuat pesanan: ' + err.message);
  }
};
```

### Method 3: DELETE - Cancel Order
```javascript
const cancelOrder = async (orderId) => {
  setLoading(true);
  
  try {
    // DELETE /orders/:id
    await axios.delete(`${API_URL}/orders/${orderId}`);
    
    // Remove from state
    setOrders(orders.filter(order => order.id !== orderId));
    
    return true;
  } catch (err) {
    setError('Gagal membatalkan pesanan');
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Digunakan di:** `MyOrders.jsx`
```javascript
const handleCancelOrder = async (orderId) => {
  if (window.confirm('Yakin ingin membatalkan pesanan?')) {
    try {
      await cancelOrder(orderId);
      setUserOrders(userOrders.filter(o => o.id !== orderId));
      alert('✅ Pesanan dibatalkan');
    } catch (err) {
      alert('❌ Gagal: ' + err.message);
    }
  }
};
```

---

## 🔗 App.jsx - Provider Setup

```javascript
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/catalogue" element={<CataloguePage />} />
                <Route path="/product/:id" element={<DetailProduct />} />
                
                {/* Protected Routes - Authenticated Users */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/profile" element={<UserProfile />} />
                </Route>
                
                {/* Seller Protected Routes */}
                <Route element={<ProtectedRoute requiredRole="seller" />}>
                  <Route path="/seller" element={<SellerDashboard />} />
                  <Route path="/seller/products" element={<MyProducts />} />
                  <Route path="/seller/add-product" element={<AddProduct />} />
                  <Route path="/seller/edit/:id" element={<EditProduct />} />
                </Route>
              </Routes>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 🛡️ ProtectedRoute Component

```javascript
export const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Belum login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  // Cek role jika diperlukan
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};
```

---

## 📝 Checklist Implementasi

- ✅ AuthContext: login (GET), register (POST), updateProfile (PUT)
- ✅ ProductContext: fetchProducts (GET), fetchById (GET), addProduct (POST), updateProduct (PUT), deleteProduct (DELETE)
- ✅ CartContext: fetchCart (GET), addToCart (POST), updateCartItem (PUT), removeFromCart (DELETE), clearCart (helper)
- ✅ OrderContext: fetchUserOrders (GET), createOrder (POST), cancelOrder (DELETE)
- ✅ ProtectedRoute: Authenticated & role-based access
- ✅ All components integrated dengan context
- ✅ Error handling di setiap operasi
- ✅ Loading states

---

**Last Updated: November 25, 2025**
