# ⚡ QUICK START GUIDE - AM-PM Coffee Website

## 🚀 Run Website (5 Minutes)

### Step 1: Open 2 Terminals

**Terminal 1 - Start Backend:**
```bash
npm run server
```
✅ Runs on: http://localhost:3000

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
✅ Runs on: http://localhost:5173

### Step 2: Open Browser
```
http://localhost:5173
```

---

## 🎯 What's Now Available

| Feature | Status | Where |
|---------|--------|-------|
| Homepage | ✅ WORKING | / |
| Browse Products | ✅ WORKING | /catalogue |
| Product Details | ✅ WORKING | /product/:id |
| Shopping Cart | ✅ WORKING | /cart |
| Checkout | ✅ WORKING | /checkout |
| Order History | ✅ WORKING | /my-orders |
| User Profile | ✅ WORKING | /profile |
| Login/Register | ✅ WORKING | /login, /register |
| Seller Dashboard | ✅ WORKING | /seller |
| Add Product | ✅ WORKING | /seller/add |
| Edit Product | ✅ WORKING | /seller/edit/:id |

---

## 🔑 Demo Login

**BUYER:**
```
Email: c@toko.com
Password: 123
```

**SELLER:**
```
Email: test@toko.com
Password: 123
```

---

## 📱 Quick Testing

### 1. Browse Products
- Go to Catalogue
- Use filters (Kopi, Non-Kopi)
- Click product to see details

### 2. Add to Cart
- Click "Tambah ke Keranjang"
- Choose quantity
- Go to cart

### 3. Checkout
- Click "Lanjut Checkout"
- Fill shipping details
- Click "Pesan Sekarang"

### 4. View Orders
- Click "Riwayat Pesanan" in menu
- See order status and details

### 5. Edit Profile
- Click user menu → "Profil Saya"
- Click "Edit Profil"
- Update info and save

---

## 🐛 Quick Fixes

**Problem: Website is blank**
- Ensure both servers running (npm run server + npm run dev)
- Check you're on http://localhost:5173 (not 5175)
- Clear browser cache (Ctrl+Shift+Del)
- Refresh page (Ctrl+R)

**Problem: Products not showing**
- Check http://localhost:3000/products in browser
- Restart backend: npm run server

**Problem: Can't add to cart**
- Login first (use demo credentials)
- Check browser console (F12) for errors

---

## 📊 All Components: ✅

✅ LandingPage - Hero + Features + CTA
✅ CataloguePage - Products + Filters  
✅ DetailProduct - Images + Qty + Cart
✅ CartPage - Items + Checkout
✅ CheckoutPage - Shipping + Order
✅ MyOrders - History + Status
✅ Auth Pages - Login + Register
✅ Profile - View + Edit
✅ Seller - Dashboard + CRUD
✅ Navbar - Fixed + Responsive
✅ Footer - Links + Info

---

## 📖 Documentation

For detailed info, read:
- **COMPLETION_REPORT_FINAL.md** - Full summary
- **FIXES_APPLIED_SUMMARY.md** - Technical details
- **WEBSITE_TESTING_COMPLETE.md** - Complete testing guide

---

## 🎉 You're All Set!

Website is **100% ready** with all components and features working.

**Start now:**
```bash
npm run server  # Terminal 1
npm run dev     # Terminal 2
# Open http://localhost:5173
```

Enjoy! ☕
