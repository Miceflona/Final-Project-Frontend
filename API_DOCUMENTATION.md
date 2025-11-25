# API Documentation - Complete Reference

**Dokumentasi lengkap semua endpoint API dengan request/response examples**

---

## 📌 Base URL

```
http://localhost:3000
```

---

## 👥 AUTH ENDPOINTS

### 1. GET - Fetch All Users (For Login Validation)

**Endpoint:** `GET /users`

**Purpose:** Mengambil semua user untuk validasi login

**Query Parameters:** None

**Request:**
```bash
curl -X GET http://localhost:3000/users
```

**Response (200 OK):**
```json
[
  {
    "id": "user_1700000001",
    "fullName": "Aji Pratama",
    "email": "test@toko.com",
    "password": "123",
    "role": "seller",
    "avatar": "https://placehold.co/100",
    "address": "Jl. Kemanggisan No. 1"
  },
  {
    "id": "user_1700000002",
    "fullName": "Customer Test",
    "email": "c@toko.com",
    "password": "123",
    "role": "buyer",
    "avatar": "https://placehold.co/100",
    "address": "-"
  }
]
```

**Code Implementation:**
```javascript
const login = async (email, password) => {
  const response = await axios.get('http://localhost:3000/users');
  const foundUser = response.data.find(
    u => u.email === email && u.password === password
  );
  if (!foundUser) throw new Error('Invalid credentials');
  return foundUser;
};
```

---

### 2. GET - Fetch Single User by ID

**Endpoint:** `GET /users/:id`

**Purpose:** Mengambil data user berdasarkan ID

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `user_1700000001` |

**Request:**
```bash
curl -X GET http://localhost:3000/users/user_1700000001
```

**Response (200 OK):**
```json
{
  "id": "user_1700000001",
  "fullName": "Aji Pratama",
  "email": "test@toko.com",
  "password": "123",
  "role": "seller",
  "avatar": "https://placehold.co/100",
  "address": "Jl. Kemanggisan No. 1"
}
```

**Error Response (404 Not Found):**
```json
{}
```

---

### 3. POST - Register New User

**Endpoint:** `POST /users`

**Purpose:** Membuat akun user baru (registration)

**Request Body:**
```json
{
  "fullName": "Nama Lengkap",
  "email": "email@toko.com",
  "password": "password123",
  "role": "buyer"
}
```

**Request with cURL:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Aji Pratama",
    "email": "aji@toko.com",
    "password": "123",
    "role": "buyer"
  }'
```

**Response (201 Created):**
```json
{
  "fullName": "Aji Pratama",
  "email": "aji@toko.com",
  "password": "123",
  "role": "buyer",
  "id": "user_1700000003"
}
```

**Code Implementation:**
```javascript
const register = async (fullName, email, password, role = 'buyer') => {
  // Validasi email belum ada
  const checkResponse = await axios.get('http://localhost:3000/users');
  const emailExists = checkResponse.data.some(u => u.email === email);
  
  if (emailExists) throw new Error('Email already registered');

  const newUser = {
    fullName, email, password, role,
    avatar: 'https://placehold.co/100',
    address: '-'
  };

  const response = await axios.post('http://localhost:3000/users', newUser);
  return response.data;
};
```

**Validation:**
- Email harus unik (cek dengan GET /users dulu)
- Minimal password 3 karakter
- Role harus "buyer" atau "seller"

---

### 4. PUT - Update User Profile

**Endpoint:** `PUT /users/:id`

**Purpose:** Mengubah data profil user (nama, alamat, avatar)

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `user_1700000001` |

**Request Body:**
```json
{
  "fullName": "Nama Baru",
  "address": "Alamat Baru",
  "avatar": "https://link-ke-foto.com"
}
```

**Request with cURL:**
```bash
curl -X PUT http://localhost:3000/users/user_1700000001 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Aji Pratama Updated",
    "address": "Jl. Baru No. 2",
    "avatar": "https://placehold.co/150"
  }'
```

**Response (200 OK):**
```json
{
  "id": "user_1700000001",
  "fullName": "Aji Pratama Updated",
  "email": "test@toko.com",
  "password": "123",
  "role": "seller",
  "avatar": "https://placehold.co/150",
  "address": "Jl. Baru No. 2"
}
```

**Code Implementation:**
```javascript
const updateProfile = async (userId, updates) => {
  const response = await axios.put(
    `http://localhost:3000/users/${userId}`,
    updates
  );
  return response.data;
};

// Usage:
updateProfile('user_1700000001', {
  fullName: 'New Name',
  address: 'New Address',
  avatar: 'https://...'
});
```

---

## 📦 PRODUCT ENDPOINTS

### 1. GET - Fetch All Products

**Endpoint:** `GET /products`

**Purpose:** Mengambil daftar semua produk

**Query Parameters:** None

**Request:**
```bash
curl -X GET http://localhost:3000/products
```

**Response (200 OK):**
```json
[
  {
    "id": "prod_1700000001",
    "name": "Kopi Arabika Premium",
    "category": "coffee",
    "price": 50000,
    "description": "Kopi premium dari pegunungan kalimantan",
    "image": "https://via.placeholder.com/200?text=Arabika"
  },
  {
    "id": "prod_1700000002",
    "name": "Kopi Robusta Blend",
    "category": "coffee",
    "price": 35000,
    "description": "Blend kopi dengan karakter kuat",
    "image": "https://via.placeholder.com/200?text=Robusta"
  },
  {
    "id": "prod_1700000003",
    "name": "Pastry Cokelat",
    "category": "non-coffee",
    "price": 25000,
    "description": "Pastry lezat dengan cokelat premium",
    "image": "https://via.placeholder.com/200?text=Pastry"
  }
]
```

**Code Implementation:**
```javascript
const fetchProducts = async () => {
  const response = await axios.get('http://localhost:3000/products');
  return response.data;
};
```

---

### 2. GET - Fetch Single Product by ID

**Endpoint:** `GET /products/:id`

**Purpose:** Mengambil detail produk spesifik

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `prod_1700000001` |

**Request:**
```bash
curl -X GET http://localhost:3000/products/prod_1700000001
```

**Response (200 OK):**
```json
{
  "id": "prod_1700000001",
  "name": "Kopi Arabika Premium",
  "category": "coffee",
  "price": 50000,
  "description": "Kopi premium dari pegunungan kalimantan",
  "image": "https://via.placeholder.com/200?text=Arabika"
}
```

**Response (404 Not Found):**
```json
{}
```

---

### 3. GET - Filter Products by Category

**Endpoint:** `GET /products?category=:category`

**Purpose:** Mengambil produk berdasarkan kategori

**Query Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| category | string | No | `coffee` atau `non-coffee` |

**Request:**
```bash
curl -X GET "http://localhost:3000/products?category=coffee"
```

**Response (200 OK):**
```json
[
  {
    "id": "prod_1700000001",
    "name": "Kopi Arabika Premium",
    "category": "coffee",
    "price": 50000,
    "description": "Kopi premium dari pegunungan kalimantan",
    "image": "https://via.placeholder.com/200?text=Arabika"
  },
  {
    "id": "prod_1700000002",
    "name": "Kopi Robusta Blend",
    "category": "coffee",
    "price": 35000,
    "description": "Blend kopi dengan karakter kuat",
    "image": "https://via.placeholder.com/200?text=Robusta"
  }
]
```

**Code Implementation:**
```javascript
const fetchProductsByCategory = async (category) => {
  const response = await axios.get(
    `http://localhost:3000/products?category=${category}`
  );
  return response.data;
};
```

---

### 4. POST - Create New Product

**Endpoint:** `POST /products`

**Purpose:** Membuat produk baru (seller only)

**Request Body:**
```json
{
  "name": "Nama Produk",
  "category": "coffee",
  "price": 50000,
  "description": "Deskripsi produk",
  "image": "https://link-ke-gambar.com"
}
```

**Request with cURL:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kopi Arabika Premium",
    "category": "coffee",
    "price": 50000,
    "description": "Kopi premium dari pegunungan kalimantan",
    "image": "https://via.placeholder.com/200?text=Arabika"
  }'
```

**Response (201 Created):**
```json
{
  "name": "Kopi Arabika Premium",
  "category": "coffee",
  "price": 50000,
  "description": "Kopi premium dari pegunungan kalimantan",
  "image": "https://via.placeholder.com/200?text=Arabika",
  "id": "prod_1700000001"
}
```

**Code Implementation:**
```javascript
const addProduct = async (productData) => {
  const newProduct = {
    id: `prod_${Date.now()}`,
    ...productData,
    createdAt: new Date().toISOString()
  };
  
  const response = await axios.post(
    'http://localhost:3000/products',
    newProduct
  );
  return response.data;
};

// Usage:
addProduct({
  name: 'Kopi Arabika Premium',
  category: 'coffee',
  price: 50000,
  description: 'Premium quality',
  image: 'https://...'
});
```

**Validation:**
- Name tidak boleh kosong
- Price harus number > 0
- Category harus "coffee" atau "non-coffee"

---

### 5. PUT - Update Product

**Endpoint:** `PUT /products/:id`

**Purpose:** Mengubah data produk (seller only)

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `prod_1700000001` |

**Request Body:**
```json
{
  "name": "Nama Produk Updated",
  "price": 60000,
  "description": "Deskripsi updated"
}
```

**Request with cURL:**
```bash
curl -X PUT http://localhost:3000/products/prod_1700000001 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kopi Arabika Super Premium",
    "price": 60000,
    "description": "Upgraded quality"
  }'
```

**Response (200 OK):**
```json
{
  "id": "prod_1700000001",
  "name": "Kopi Arabika Super Premium",
  "category": "coffee",
  "price": 60000,
  "description": "Upgraded quality",
  "image": "https://via.placeholder.com/200?text=Arabika"
}
```

**Code Implementation:**
```javascript
const updateProduct = async (id, updates) => {
  const response = await axios.put(
    `http://localhost:3000/products/${id}`,
    updates
  );
  return response.data;
};

// Usage:
updateProduct('prod_1700000001', {
  price: 60000,
  description: 'New description'
});
```

---

### 6. DELETE - Remove Product

**Endpoint:** `DELETE /products/:id`

**Purpose:** Menghapus produk (seller only)

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `prod_1700000001` |

**Request:**
```bash
curl -X DELETE http://localhost:3000/products/prod_1700000001
```

**Response (200 OK):**
```json
{}
```

**Code Implementation:**
```javascript
const deleteProduct = async (id) => {
  await axios.delete(`http://localhost:3000/products/${id}`);
  return true;
};

// Usage with confirmation:
if (window.confirm('Yakin ingin hapus produk?')) {
  await deleteProduct('prod_1700000001');
}
```

---

## 🛒 CART ENDPOINTS

### 1. GET - Fetch Cart by User ID

**Endpoint:** `GET /cart?userId=:userId`

**Purpose:** Mengambil item keranjang user

**Query Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| userId | string | Yes | `user_1700000001` |

**Request:**
```bash
curl -X GET "http://localhost:3000/cart?userId=user_1700000001"
```

**Response (200 OK):**
```json
[
  {
    "id": "cart_1700000001",
    "userId": "user_1700000001",
    "productId": "prod_1700000001",
    "quantity": 2
  },
  {
    "id": "cart_1700000002",
    "userId": "user_1700000001",
    "productId": "prod_1700000002",
    "quantity": 1
  }
]
```

**Code Implementation:**
```javascript
const fetchCart = async (userId) => {
  const response = await axios.get(
    `http://localhost:3000/cart?userId=${userId}`
  );
  return response.data;
};
```

---

### 2. POST - Add Item to Cart

**Endpoint:** `POST /cart`

**Purpose:** Menambah item ke keranjang atau update quantity jika sudah ada

**Request Body:**
```json
{
  "userId": "user_1700000001",
  "productId": "prod_1700000001",
  "quantity": 1
}
```

**Request with cURL:**
```bash
curl -X POST http://localhost:3000/cart \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1700000001",
    "productId": "prod_1700000001",
    "quantity": 1
  }'
```

**Response (201 Created):**
```json
{
  "userId": "user_1700000001",
  "productId": "prod_1700000001",
  "quantity": 1,
  "id": "cart_1700000001"
}
```

**Code Implementation:**
```javascript
const addToCart = async (userId, productId, quantity = 1) => {
  // Cek apakah sudah ada
  const cartResponse = await axios.get(
    `http://localhost:3000/cart?userId=${userId}`
  );
  const existingItem = cartResponse.data.find(
    item => item.productId === productId
  );

  if (existingItem) {
    // Update quantity
    return axios.put(
      `http://localhost:3000/cart/${existingItem.id}`,
      { quantity: existingItem.quantity + quantity }
    );
  }

  // Tambah baru
  const newCartItem = {
    id: `cart_${Date.now()}`,
    userId,
    productId,
    quantity
  };
  
  const response = await axios.post('http://localhost:3000/cart', newCartItem);
  return response.data;
};
```

---

### 3. PUT - Update Cart Item Quantity

**Endpoint:** `PUT /cart/:id`

**Purpose:** Mengubah quantity item di keranjang

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `cart_1700000001` |

**Request Body:**
```json
{
  "quantity": 3
}
```

**Request with cURL:**
```bash
curl -X PUT http://localhost:3000/cart/cart_1700000001 \
  -H "Content-Type: application/json" \
  -d '{ "quantity": 3 }'
```

**Response (200 OK):**
```json
{
  "id": "cart_1700000001",
  "userId": "user_1700000001",
  "productId": "prod_1700000001",
  "quantity": 3
}
```

**Code Implementation:**
```javascript
const updateCartItem = async (cartItemId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const response = await axios.put(
    `http://localhost:3000/cart/${cartItemId}`,
    { quantity }
  );
  return response.data;
};
```

---

### 4. DELETE - Remove Item from Cart

**Endpoint:** `DELETE /cart/:id`

**Purpose:** Menghapus item dari keranjang

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `cart_1700000001` |

**Request:**
```bash
curl -X DELETE http://localhost:3000/cart/cart_1700000001
```

**Response (200 OK):**
```json
{}
```

**Code Implementation:**
```javascript
const removeFromCart = async (cartItemId) => {
  await axios.delete(`http://localhost:3000/cart/${cartItemId}`);
  return true;
};
```

---

## 📋 ORDER ENDPOINTS

### 1. GET - Fetch All Orders

**Endpoint:** `GET /orders`

**Purpose:** Mengambil semua pesanan (admin purposes)

**Request:**
```bash
curl -X GET http://localhost:3000/orders
```

**Response (200 OK):**
```json
[
  {
    "id": "order_1700000001",
    "userId": "user_1700000001",
    "items": [
      {
        "productId": "prod_1700000001",
        "name": "Kopi Arabika Premium",
        "price": 50000,
        "quantity": 2
      }
    ],
    "totalAmount": 100000,
    "status": "pending",
    "shippingDetails": {
      "recipientName": "Aji Pratama",
      "address": "Jl. Kemanggisan No. 1",
      "phone": "081234567890"
    },
    "orderDate": "2025-11-25T10:30:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  }
]
```

---

### 2. GET - Fetch Orders by User ID

**Endpoint:** `GET /orders?userId=:userId`

**Purpose:** Mengambil pesanan user tertentu

**Query Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| userId | string | Yes | `user_1700000001` |

**Request:**
```bash
curl -X GET "http://localhost:3000/orders?userId=user_1700000001"
```

**Response (200 OK):**
```json
[
  {
    "id": "order_1700000001",
    "userId": "user_1700000001",
    "items": [
      {
        "productId": "prod_1700000001",
        "name": "Kopi Arabika Premium",
        "price": 50000,
        "quantity": 2
      }
    ],
    "totalAmount": 100000,
    "status": "pending",
    "shippingDetails": {
      "recipientName": "Aji Pratama",
      "address": "Jl. Kemanggisan No. 1",
      "phone": "081234567890"
    },
    "orderDate": "2025-11-25T10:30:00.000Z",
    "updatedAt": "2025-11-25T10:30:00.000Z"
  }
]
```

**Code Implementation:**
```javascript
const fetchUserOrders = async (userId) => {
  const response = await axios.get(
    `http://localhost:3000/orders?userId=${userId}`
  );
  
  // Sort by date (newest first)
  return response.data.sort((a, b) =>
    new Date(b.orderDate) - new Date(a.orderDate)
  );
};
```

---

### 3. GET - Fetch Single Order by ID

**Endpoint:** `GET /orders/:id`

**Purpose:** Mengambil detail pesanan spesifik

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `order_1700000001` |

**Request:**
```bash
curl -X GET http://localhost:3000/orders/order_1700000001
```

**Response (200 OK):**
```json
{
  "id": "order_1700000001",
  "userId": "user_1700000001",
  "items": [
    {
      "productId": "prod_1700000001",
      "name": "Kopi Arabika Premium",
      "price": 50000,
      "quantity": 2
    }
  ],
  "totalAmount": 100000,
  "status": "pending",
  "shippingDetails": {
    "recipientName": "Aji Pratama",
    "address": "Jl. Kemanggisan No. 1",
    "phone": "081234567890"
  },
  "orderDate": "2025-11-25T10:30:00.000Z",
  "updatedAt": "2025-11-25T10:30:00.000Z"
}
```

---

### 4. POST - Create New Order

**Endpoint:** `POST /orders`

**Purpose:** Membuat pesanan baru (checkout)

**Request Body:**
```json
{
  "userId": "user_1700000001",
  "items": [
    {
      "productId": "prod_1700000001",
      "name": "Kopi Arabika Premium",
      "price": 50000,
      "quantity": 2
    }
  ],
  "totalAmount": 100000,
  "status": "pending",
  "shippingDetails": {
    "recipientName": "Aji Pratama",
    "address": "Jl. Kemanggisan No. 1",
    "phone": "081234567890"
  }
}
```

**Request with cURL:**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1700000001",
    "items": [
      {
        "productId": "prod_1700000001",
        "name": "Kopi Arabika Premium",
        "price": 50000,
        "quantity": 2
      }
    ],
    "totalAmount": 100000,
    "status": "pending",
    "shippingDetails": {
      "recipientName": "Aji Pratama",
      "address": "Jl. Kemanggisan No. 1",
      "phone": "081234567890"
    }
  }'
```

**Response (201 Created):**
```json
{
  "userId": "user_1700000001",
  "items": [
    {
      "productId": "prod_1700000001",
      "name": "Kopi Arabika Premium",
      "price": 50000,
      "quantity": 2
    }
  ],
  "totalAmount": 100000,
  "status": "pending",
  "shippingDetails": {
    "recipientName": "Aji Pratama",
    "address": "Jl. Kemanggisan No. 1",
    "phone": "081234567890"
  },
  "id": "order_1700000001",
  "orderDate": "2025-11-25T10:30:00.000Z",
  "updatedAt": "2025-11-25T10:30:00.000Z"
}
```

**Code Implementation:**
```javascript
const createOrder = async (orderData) => {
  const newOrder = {
    id: `order_${Date.now()}`,
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const response = await axios.post(
    'http://localhost:3000/orders',
    newOrder
  );
  return response.data;
};

// Usage:
createOrder({
  userId: 'user_1700000001',
  items: [...],
  totalAmount: 100000,
  shippingDetails: {...}
});
```

---

### 5. PUT - Update Order Status

**Endpoint:** `PUT /orders/:id`

**Purpose:** Mengubah status pesanan

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `order_1700000001` |

**Request Body:**
```json
{
  "status": "completed"
}
```

**Request with cURL:**
```bash
curl -X PUT http://localhost:3000/orders/order_1700000001 \
  -H "Content-Type: application/json" \
  -d '{ "status": "completed" }'
```

**Response (200 OK):**
```json
{
  "id": "order_1700000001",
  "userId": "user_1700000001",
  "items": [...],
  "totalAmount": 100000,
  "status": "completed",
  "shippingDetails": {...},
  "orderDate": "2025-11-25T10:30:00.000Z",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

---

### 6. DELETE - Cancel Order

**Endpoint:** `DELETE /orders/:id`

**Purpose:** Membatalkan pesanan

**Path Parameters:**
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| id | string | Yes | `order_1700000001` |

**Request:**
```bash
curl -X DELETE http://localhost:3000/orders/order_1700000001
```

**Response (200 OK):**
```json
{}
```

**Code Implementation:**
```javascript
const cancelOrder = async (orderId) => {
  await axios.delete(`http://localhost:3000/orders/${orderId}`);
  return true;
};
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | GET/PUT/DELETE berhasil |
| 201 | Created | POST berhasil membuat resource |
| 400 | Bad Request | Data tidak valid |
| 404 | Not Found | Resource tidak ditemukan |
| 500 | Server Error | Kesalahan server |

---

## 🔄 Error Handling Pattern

```javascript
try {
  const response = await axios.get('/endpoint');
  // Berhasil
  return response.data;
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Resource not found');
  } else if (error.response?.status === 400) {
    console.error('Invalid data:', error.response.data);
  } else {
    console.error('Error:', error.message);
  }
  throw error;
}
```

---

## 💾 Timestamp Format

Semua timestamp menggunakan ISO 8601 format:
```
2025-11-25T10:30:00.000Z
```

Untuk generate:
```javascript
new Date().toISOString()  // Contoh: "2025-11-25T10:30:00.000Z"
```

---

**Last Updated: November 25, 2025**

**Untuk Testing:**
- Gunakan tools seperti Postman, Insomnia, atau REST Client extension di VS Code
- Import collection atau gunakan contoh cURL di atas
- JSON Server auto-reload ketika data berubah
