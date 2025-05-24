# 🛒 Simple E-commerce Cart App

A simple e-commerce web application built with React, allowing users to browse and add products to their cart, apply offers automatically, and navigate between pages with state retention.

---
## 🔗 Live Demo

👉 [https://qurb-chi.vercel.app/](https://qurb-chi.vercel.app/)

## 🚀 Features

- ✅ Browse products by category (Fruit, Drinks, Bakery, All)
- 🔍 Search for products within your cart
- ➕ Add products to cart with stock availability logic
- 🎁 Automatic offer application:
  - Buy **6 Coca-Cola cans**, get **1 free**
  - Buy **3 croissants**, get a **free coffee**
- 🔄 Navigate between pages while retaining cart state
- ➖➕ Update product quantities smoothly with offer recalculations
- 📊 Subtotal, discount, and total calculated accurately

---

## 🛠️ Tech Stack

- React
- Tailwind CSS
- Axios (or native Fetch API)
- React Router (for page navigation)
- Local Storage (for cart persistence)

---

## 🔗 Products API

All product data is fetched using the following API endpoint:


Where `{category}` can be:

- `fruit`
- `drinks`
- `bakery`
- `all`

---

## 📦 Product Display Requirements

- Products must be displayed with:
  - Image
  - Name
  - Price
  - Availability:
    - If stock ≥ 10 → Show **"Available"**
    - Else → Show **"Only X left"**
  - An **Add to Cart** button

---

## 🔍 Search Functionality

- Users can search **within the cart**
- The search bar filters cart items live
- Case-insensitive search

---

## 🎁 Offer Logic

1. **Buy 6 Coca-Cola cans → Get 1 Free**
   - Automatically adds 1 free Coca-Cola when 6 are added
   - Removes the free item if quantity drops below 6

2. **Buy 3 Croissants → Get 1 Coffee Free**
   - Adds 1 free coffee when 3 croissants are added
   - Removes the coffee if croissant count drops below 3

---

## 🔄 Navigation & Cart Persistence

- The app has two pages (e.g., Product List & Cart Page)
- Navigation between pages retains cart data
- Cart data is stored in memory or local storage as needed

---

## 💰 Price Calculation

The following are calculated and displayed in the cart:

- Subtotal (before offers)
- Discount (from offers)
- Total (after discount)

---

## 🎨 UI Notes

- The layout follows the design shared in the **Figma** reference file
- Responsive design using Tailwind CSS
- Clear separation between product list and cart view

---

## 📋 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/aditisaxena259/qurb.git
cd qurb
npm install
npm run dev

## View the app
Open http://localhost:5173/ in your browser
