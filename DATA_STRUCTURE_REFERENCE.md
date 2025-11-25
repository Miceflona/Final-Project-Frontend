# Data Structure Reference - db.json

## 📋 Overview

Aplikasi menggunakan JSON Server sebagai API backend. Berikut adalah struktur lengkap data yang disimpan di `db.json`.

---

## 👥 Users Collection

**Path:** `/users`  
**Operasi:** GET, POST, PUT, DELETE

### Data Structure
```json
{
  "id": "user_1700000000",
  "fullName": "Nama Lengkap",
  "email": "email@toko.com",
  "password": "123",
  "role": "buyer",
  "avatar": "https://placehold.co/100",
  "address": "Jl. Kemanggisan No. 1"
}
```

### Field Explanation
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique identifier (auto-generated) | `user_1700000001` |
| fullName | string | Nama lengkap user | `Aji Pratama` |
| email | string | Email unik | `aji@toko.com` |
| password | string | Password (plain text) | `123` |
| role | string | Tipe user: "buyer" atau "seller" | `buyer` |
| avatar | string | URL foto profil | `https://...` |
| address | string | Alamat rumah/toko | `Jl. Kemanggisan` |

### CRUD Operations
```javascript
// CREATE - Register user baru
POST /users
{
  "fullName": "Aji Pratama",
  "email": "aji@toko.com",
  "password": "123",
  "role": "buyer"
}

// READ - Get all users
GET /users

// READ - Get specific user
GET /users/user_1700000001

// UPDATE - Update user profile
PUT /users/user_1700000001
{
  "address": "Jl. Baru No. 2",
  "avatar": "https://..."
}

// DELETE - Delete user
DELETE /users/user_1700000001
```

### Sample Data
```json
{
  "id": "user_1700000001",
  "fullName": "Aji Pratama",
  "email": "aji@toko.com",
  "password": "123",
  "role": "seller",
  "avatar": "https://placehold.co/100",
  "address": "Jl. Kemanggisan No. 1, Jakarta"
}
```

---

## 📦 Products Collection

**Path:** `/products`  
**Operasi:** GET, POST, PUT, DELETE

### Data Structure
```json
{
  "id": "prod_1700000000",
  "name": "Kopi Arabika Premium",
  "category": "coffee",
  "price": 50000,
  "description": "Kopi premium dari pegunungan kalimantan",
  "image": "https://..."
}
```

### Field Explanation
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique product ID (auto-generated) | `prod_1700000001` |
| name | string | Nama produk | `Kopi Arabika Premium` |
| category | string | Kategori: "coffee" atau "non-coffee" | `coffee` |
| price | number | Harga dalam Rupiah | `50000` |
| description | string | Deskripsi produk | `Kopi premium...` |
| image | string | URL gambar produk | `https://...` |

### CRUD Operations
```javascript
// CREATE - Add new product
POST /products
{
  "name": "Kopi Arabika Premium",
  "category": "coffee",
  "price": 50000,
  "description": "Premium quality",
  "image": "https://..."
}

// READ - Get all products
GET /products

// READ - Get product by category
GET /products?category=coffee

// READ - Get specific product
GET /products/prod_1700000001

// UPDATE - Update product
PUT /products/prod_1700000001
{
  "price": 60000,
  "description": "Harga updated"
}

// DELETE - Delete product
DELETE /products/prod_1700000001
```

### Sample Data
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

---

## 🛒 Cart Collection

**Path:** `/cart`  
**Operasi:** GET, POST, PUT, DELETE

### Data Structure
```json
{
  "id": "cart_1700000000",
  "userId": "user_1700000001",
  "productId": "prod_1700000001",
  "quantity": 2
}
```

### Field Explanation
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique cart item ID | `cart_1700000001` |
| userId | string | User yang punya keranjang | `user_1700000001` |
| productId | string | Product yang ditambahkan | `prod_1700000001` |
| quantity | number | Jumlah item | `2` |

### CRUD Operations
```javascript
// CREATE - Add item to cart
POST /cart
{
  "userId": "user_1700000001",
  "productId": "prod_1700000001",
  "quantity": 1
}

// READ - Get cart items for user
GET /cart?userId=user_1700000001

// READ - Get all cart items
GET /cart

// UPDATE - Change quantity
PUT /cart/cart_1700000001
{
  "quantity": 3
}

// DELETE - Remove item from cart
DELETE /cart/cart_1700000001
```

### Sample Data
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

### Usage Pattern
```javascript
// Tambah ke keranjang (atau update quantity jika sudah ada)
const existingItem = cartItems.find(
  item => item.userId === userId && item.productId === productId
);

if (existingItem) {
  PUT /cart/cart_id { quantity: newQuantity }
} else {
  POST /cart { userId, productId, quantity }
}

// Ambil keranjang user
GET /cart?userId=user_id
// Return: Array cart items untuk user tersebut

// Hapus saat checkout
for (each item in cartItems) {
  DELETE /cart/cart_item_id
}
```

---

## 📋 Orders Collection

**Path:** `/orders`  
**Operasi:** GET, POST, PUT, DELETE

### Data Structure
```json
{
  "id": "order_1700000000",
  "userId": "user_1700000001",
  "items": [
    {
      "productId": "prod_1700000001",
      "name": "Kopi Arabika",
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

### Field Explanation
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Unique order ID (auto-generated) | `order_1700000001` |
| userId | string | User yang membuat order | `user_1700000001` |
| items | array | Daftar produk yang dipesan | `[{...}, {...}]` |
| totalAmount | number | Total harga pesanan | `100000` |
| status | string | Status: "pending" / "completed" / "cancelled" | `pending` |
| shippingDetails | object | Data pengiriman | `{...}` |
| orderDate | string | Tanggal pemesanan (ISO 8601) | `2025-11-25T...` |
| updatedAt | string | Tanggal update terakhir | `2025-11-25T...` |

### Shipping Details Structure
```json
{
  "recipientName": "Nama Penerima",
  "address": "Jl. Kemanggisan No. 1",
  "phone": "081234567890"
}
```

### CRUD Operations
```javascript
// CREATE - Create new order
POST /orders
{
  "userId": "user_1700000001",
  "items": [
    {
      "productId": "prod_1700000001",
      "name": "Kopi Arabika",
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

// READ - Get all orders
GET /orders

// READ - Get orders by user
GET /orders?userId=user_1700000001

// READ - Get specific order
GET /orders/order_1700000001

// UPDATE - Change order status
PUT /orders/order_1700000001
{
  "status": "completed",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}

// DELETE - Cancel order
DELETE /orders/order_1700000001
```

### Sample Data
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
    "address": "Jl. Kemanggisan No. 1, Jakarta",
    "phone": "081234567890"
  },
  "orderDate": "2025-11-25T10:30:00.000Z",
  "updatedAt": "2025-11-25T10:30:00.000Z"
}
```

### Status Workflow
```
pending → completed
  ↓
cancelled
```

---

## 🔄 Complete db.json Template

```json
{
  "users": [
    {
      "id": "user_1700000001",
      "fullName": "Aji Pratama",
      "email": "test@toko.com",
      "password": "123",
      "role": "seller",
      "avatar": "https://placehold.co/100",
      "address": "Jl. Kemanggisan"
    }
  ],
  "products": [
    {
      "id": "prod_1700000001",
      "name": "Kopi Arabika Premium",
      "category": "coffee",
      "price": 50000,
      "description": "Premium quality coffee",
      "image": "https://via.placeholder.com/200?text=Arabika"
    }
  ],
  "cart": [
    {
      "id": "cart_1700000001",
      "userId": "user_1700000001",
      "productId": "prod_1700000001",
      "quantity": 1
    }
  ],
  "orders": [
    {
      "id": "order_1700000001",
      "userId": "user_1700000001",
      "items": [
        {
          "productId": "prod_1700000001",
          "name": "Kopi Arabika Premium",
          "price": 50000,
          "quantity": 1
        }
      ],
      "totalAmount": 50000,
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
}
```

---

## 📊 Relationships

```
Users (1) ───→ (Many) Cart Items
     ├──→ Keranjang milik user

Users (1) ───→ (Many) Orders
     ├──→ Pesanan dari user

Products (1) ───→ (Many) Cart Items
     ├──→ Produk di keranjang

Products (1) ───→ (Many) Order Items
     ├──→ Produk di pesanan
```

---

## 🔑 Key Points

1. **ID Generation:** Semua ID auto-generated dengan format `type_timestamp`
   - `user_1700000001`
   - `prod_1700000001`
   - `cart_1700000001`
   - `order_1700000001`

2. **Email Validation:** Email harus unik, dicek saat POST `/users`

3. **Quantity Checking:** Saat tambah ke cart, cek apakah item sudah ada

4. **Cart Clearing:** Saat checkout, delete semua cart items user

5. **Order Status:** 
   - `pending` → pesanan baru
   - `completed` → pesanan selesai
   - `cancelled` → pesanan dibatalkan

6. **Timestamps:** Gunakan ISO 8601 format untuk waktu

---

## 🧪 Quick Testing

### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"123","role":"buyer"}'
```

### Get Products
```bash
curl http://localhost:3000/products
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/cart \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_1","productId":"prod_1","quantity":1}'
```

### Create Order
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{...order data...}'
```

---

**Last Updated: November 25, 2025**
