# Quick Reference Guide

**Panduan cepat untuk developer yang ingin memahami atau memodifikasi aplikasi**

---

## 🚀 Quick Start (30 detik)

```bash
# 1. Install dependencies
cd c:\Users\Lenovo\Final-Project-Frontend
npm install

# 2. Terminal 1 - Start app
npm run dev
# Buka http://localhost:5173

# 3. Terminal 2 - Start API
npx json-server --watch db.json --port 3000
```

**Test Credentials:**
- 👨‍💼 Penjual: `test@toko.com` / `123`
- 👤 Pembeli: `c@toko.com` / `123`

---

## 📁 File Structure Penting

```
src/
├── context/              ← State management dengan Context API
│   ├── AuthContext.jsx          [CRUD: GET, POST, PUT]
│   ├── ProductContext.jsx       [CRUD: GET, POST, PUT, DELETE]
│   ├── CartContext.jsx          [CRUD: GET, POST, PUT, DELETE]
│   └── OrderContext.jsx         [CRUD: GET, POST, DELETE]
│
├── components/           ← Reusable UI Components
│   ├── Navbar.jsx               [Uses: AuthContext, CartContext]
│   ├── ProductCard.jsx          [Uses: CartContext]
│   └── ProtectedRoute.jsx       [Uses: AuthContext for role-based]
│
├── pages/                ← Page Components
│   ├── CataloguePage.jsx        [Uses: ProductContext - GET]
│   ├── DetailProduct.jsx        [Uses: ProductContext - GET by ID]
│   ├── CartPage.jsx             [Uses: CartContext - GET, PUT, DELETE]
│   ├── CheckoutPage.jsx         [Uses: CartContext, OrderContext]
│   ├── MyOrders.jsx             [Uses: OrderContext - GET, DELETE]
│   │
│   ├── Auth/
│   │   ├── LoginPage.jsx        [Uses: AuthContext.login - GET]
│   │   ├── RegisterPage.jsx     [Uses: AuthContext.register - POST]
│   │   └── UserProfile.jsx      [Uses: AuthContext.updateProfile - PUT]
│   │
│   └── Seller/
│       ├── MyProducts.jsx       [Uses: ProductContext - GET, DELETE]
│       ├── AddProduct.jsx       [Uses: ProductContext.addProduct - POST]
│       └── EditProduct.jsx      [Uses: ProductContext - GET, PUT]
│
├── App.jsx               ← Main App dengan Provider & Routing
├── main.jsx
└── index.css
```

---

## 🎯 CRUD Cheat Sheet

### CREATE (POST)
```javascript
// Format umum
const response = await axios.post('/endpoint', dataObject);
// Update state
setState([...state, response.data]);
```

**Contoh Real:**
```javascript
// Register user
await register('Aji', 'aji@test.com', '123', 'buyer');

// Add product
await addProduct({ name: 'Kopi', price: 50000, ... });

// Add to cart
await addToCart(userId, productId, quantity);

// Create order
await createOrder(orderData);
```

### READ (GET)
```javascript
// Format umum - Get all
const response = await axios.get('/endpoint');
// Format umum - Get by ID
const response = await axios.get(`/endpoint/${id}`);
// Format umum - Get dengan filter
const response = await axios.get(`/endpoint?param=value`);
```

**Contoh Real:**
```javascript
// Get all products
const products = await fetchProducts();

// Get product by ID
const product = await fetchProductById(prodId);

// Get user cart
const cartItems = await fetchCart(userId);

// Get user orders
const orders = await fetchUserOrders(userId);
```

### UPDATE (PUT)
```javascript
// Format umum
const response = await axios.put(`/endpoint/${id}`, updatedData);
// Update state
setState(state.map(item => item.id === id ? response.data : item));
```

**Contoh Real:**
```javascript
// Update profile
await updateProfile(userId, { address: '...', avatar: '...' });

// Update product
await updateProduct(productId, { price: 60000, ... });

// Update cart quantity
await updateCartItem(cartItemId, newQuantity);
```

### DELETE (DELETE)
```javascript
// Format umum
await axios.delete(`/endpoint/${id}`);
// Update state
setState(state.filter(item => item.id !== id));
```

**Contoh Real:**
```javascript
// Delete product
await deleteProduct(productId);

// Remove from cart
await removeFromCart(cartItemId);

// Cancel order
await cancelOrder(orderId);
```

---

## 🔌 Menggunakan Context di Component

### 1. Import & Get Context
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function MyComponent() {
  const { user, login, register } = useContext(AuthContext);
  
  // Gunakan user, login, register
}
```

### 2. Contoh: Fetch Data saat Component Mount
```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchSomething(param);
      setLocalState(data);
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };
  loadData();
}, [dependency]); // Re-run jika dependency berubah
```

### 3. Contoh: Handle Form Submit
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const result = await contextMethod(formData);
    alert('Success!');
    navigate('/somewhere');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 API Endpoints Summary

| Resource | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| **Auth** | GET | `/users` | Login validation |
| | POST | `/users` | Register user |
| | PUT | `/users/:id` | Update profile |
| **Products** | GET | `/products` | Get all |
| | GET | `/products/:id` | Get detail |
| | GET | `/products?category=X` | Filter by category |
| | POST | `/products` | Create product |
| | PUT | `/products/:id` | Update product |
| | DELETE | `/products/:id` | Delete product |
| **Cart** | GET | `/cart?userId=X` | Get user's cart |
| | POST | `/cart` | Add to cart |
| | PUT | `/cart/:id` | Update quantity |
| | DELETE | `/cart/:id` | Remove item |
| **Orders** | GET | `/orders?userId=X` | Get user's orders |
| | POST | `/orders` | Create order |
| | DELETE | `/orders/:id` | Cancel order |

---

## 🔐 Protected Routes & Roles

### Public Routes (Tidak perlu login)
- `/` - Home
- `/login` - Login page
- `/register` - Register page
- `/catalogue` - Product list
- `/product/:id` - Product detail

### Protected Routes (Perlu login)
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/my-orders` - Order history
- `/profile` - User profile

### Seller Routes (Role: seller)
- `/seller` - Seller dashboard
- `/seller/products` - Product list
- `/seller/add-product` - Add product
- `/seller/edit/:id` - Edit product

**Checking Role:**
```javascript
// Di context
if (requiredRole && user.role !== requiredRole) {
  return <Navigate to="/" />;
}
```

---

## 🧪 Common Testing Scenarios

### Scenario 1: Complete User Journey (Buyer)
1. Register → POST `/users`
2. Login → GET `/users`
3. Browse products → GET `/products`
4. Add to cart → POST `/cart`
5. Checkout → POST `/orders` + DELETE `/cart/*`
6. View orders → GET `/orders?userId=X`

### Scenario 2: Seller Product Management
1. Register as seller → POST `/users` (role: seller)
2. Login → GET `/users`
3. Add product → POST `/products`
4. Edit product → PUT `/products/:id`
5. Delete product → DELETE `/products/:id`

### Scenario 3: Profile Management
1. Login
2. Update profile → PUT `/users/:id`
3. Check localStorage persists on refresh

---

## 🐛 Debugging Checklist

**Issue: "Cannot read property X of undefined"**
- [ ] Check context is wrapped in App.jsx
- [ ] Check component imports context correctly
- [ ] Check useContext is called at component level

**Issue: "API returns 404"**
- [ ] Check JSON Server is running on port 3000
- [ ] Check endpoint spelling matches db.json structure
- [ ] Check ID format is correct (e.g., `user_123`)

**Issue: "Data not updating in UI"**
- [ ] Check state is being updated after API call
- [ ] Check component re-renders (React DevTools)
- [ ] Check useEffect dependencies

**Issue: "Login/logout not working"**
- [ ] Check localStorage operations
- [ ] Check user state in AuthContext
- [ ] Check ProtectedRoute redirect logic

**Issue: "Cart empty after refresh"**
- [ ] This is expected - db.json persists, but cart context state doesn't
- [ ] Solution: Fetch cart on component mount using fetchCart(userId)

---

## 💾 localStorage Keys Used

```javascript
// User session
localStorage.getItem('user')      // JSON string of user object
localStorage.removeItem('user')   // On logout
```

---

## 📦 Important Dependencies

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "axios": "^1.13.2",
  "tailwindcss": "^3.4.1"
}
```

---

## 🎨 Common Component Patterns

### Pattern 1: Loading State
```javascript
const [loading, setLoading] = useState(false);

if (loading) return <div>Loading...</div>;

return (/* content */);
```

### Pattern 2: Error State
```javascript
const [error, setError] = useState(null);

if (error) return <div className="text-red-500">{error}</div>;

return (/* content */);
```

### Pattern 3: Data Fetching on Mount
```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchMethod(param);
      setData(data);
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };
  loadData();
}, [user, param]); // Re-run jika user/param berubah
```

### Pattern 4: Form Handling
```javascript
const [formData, setFormData] = useState({ field: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Use formData
};
```

---

## ⚡ Performance Tips

1. **Memoization:**
   ```javascript
   import { useMemo } from 'react';
   const memoizedValue = useMemo(() => expensiveCalc(), [dep]);
   ```

2. **Avoid Re-renders:**
   ```javascript
   import { memo } from 'react';
   export default memo(MyComponent);
   ```

3. **Lazy Load Routes:**
   ```javascript
   const LazyPage = lazy(() => import('./pages/Page'));
   ```

---

## 🔄 State Management Flow

```
User Action (e.g., click button)
         ↓
Component Handler (handleClick)
         ↓
Call Context Method (addToCart)
         ↓
API Call (axios.post)
         ↓
Update Context State (setCartItems)
         ↓
Component Re-render (UI updates)
```

---

## 📞 Quick Fixes

| Problem | Solution |
|---------|----------|
| Yarn lock issue | `npm install --legacy-peer-deps` |
| Port already in use | `netstat -ano \| findstr :PORT` then kill |
| Module not found | `npm install <module-name>` |
| Context not accessible | Check Provider wraps component tree |
| Styles not loading | Check CSS import in main.jsx |
| Image not showing | Check URL format & CORS |

---

## 📚 File Reference by Feature

| Feature | Files |
|---------|-------|
| **Authentication** | AuthContext.jsx, LoginPage.jsx, RegisterPage.jsx, UserProfile.jsx |
| **Products** | ProductContext.jsx, CataloguePage.jsx, DetailProduct.jsx, ProductCard.jsx |
| **Cart** | CartContext.jsx, CartPage.jsx, Navbar.jsx |
| **Orders** | OrderContext.jsx, CheckoutPage.jsx, MyOrders.jsx |
| **Seller** | MyProducts.jsx, AddProduct.jsx, EditProduct.jsx |
| **Routing** | App.jsx, ProtectedRoute.jsx |

---

## 🎯 Next Steps to Extend

1. **Add Payment Gateway** → Integrate with Stripe/Midtrans
2. **Add Notifications** → Toast notifications, email notifications
3. **Add Search** → Full-text search for products
4. **Add Reviews** → Product ratings & comments
5. **Add Admin Panel** → Manage users, products, orders
6. **Add Categories** → Category management page
7. **Add Filters** → Price range, rating filters
8. **Add Pagination** → Handle large product lists

---

## 📖 API Response Examples

### User Object
```json
{
  "id": "user_1700000001",
  "fullName": "Aji Pratama",
  "email": "aji@toko.com",
  "role": "seller",
  "avatar": "https://...",
  "address": "Jl. Kemanggisan"
}
```

### Product Object
```json
{
  "id": "prod_1700000001",
  "name": "Kopi Arabika Premium",
  "category": "coffee",
  "price": 50000,
  "description": "Premium quality",
  "image": "https://..."
}
```

### Order Object
```json
{
  "id": "order_1700000001",
  "userId": "user_1700000001",
  "items": [{ "productId": "...", "name": "...", "price": 50000, "quantity": 2 }],
  "totalAmount": 100000,
  "status": "pending",
  "shippingDetails": { "recipientName": "...", "address": "...", "phone": "..." },
  "orderDate": "2025-11-25T10:30:00Z"
}
```

---

**Last Updated: November 25, 2025**

**Quick Questions? Check:**
1. DOKUMENTASI_CRUD_API.md → Detailed CRUD operations
2. DATA_STRUCTURE_REFERENCE.md → db.json structure
3. CODE_IMPLEMENTATION_SUMMARY.md → Code examples
4. SETUP_TESTING_GUIDE.md → How to test features
