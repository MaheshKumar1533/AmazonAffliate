# 🛍️ PrimePicks — Simplified Amazon Affiliate Portal

A clean, high-converting, and FTC-compliant Amazon Affiliate web application built with **React**, **TypeScript**, and **Tailwind CSS**.

---

## 📄 Ultra-Simple `products.json`

Your entire product catalog is stored in [`public/data/products.json`](file:///d:/Projects/AmazonAffliate/public/data/products.json).
Only **3 fields** are needed for each product: **`name`**, **`image`**, and **`link`**.

```json
[
  {
    "name": "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "link": "https://www.amazon.com/dp/B0BSHF7WHW"
  },
  {
    "name": "Apple MacBook Air 13-inch (M2 Chip, 256GB SSD)",
    "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
    "link": "https://www.amazon.com/dp/B08N5LNQCX"
  },
  {
    "name": "Logitech MX Master 3S Wireless Performance Mouse",
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    "link": "https://www.amazon.com/dp/B09V3HN1KC"
  }
]
```

### Automatic Affiliate Tracking
You don't need to manually paste your affiliate tag onto every link.
The application automatically appends your Amazon Associate Tag (e.g., `?tag=yourtag-20`) and adds FTC-compliant `rel="sponsored noopener noreferrer"` attributes to every outbound Amazon link.

You can set your Associate Tag right in the UI by clicking the **"Edit JSON"** button in the navbar.

---

## ⚡ Features
- 🚀 **Zero Rebuilds Needed**: Products load dynamically from `public/data/products.json`. Edit the file and refresh to see updates immediately.
- 🛠️ **In-Browser JSON Editor**: Click **"Edit JSON"** to view, edit, copy, download, or add products via a simple 3-field form.
- 🤖 **Automated Amazon ASIN Scraper**:
  ```bash
  npm run sync:asin B0BSHF7WHW
  ```
  Automatically fetches the product name and image from Amazon and appends it to `products.json`!
- 🔍 **Live Search**: Instant keyword and ASIN filtering.
- 💖 **Wishlist**: Save favorite deals (persisted in `localStorage`).
- 🌓 **Dark & Light Mode**: Built-in toggle that remembers user preference.
- 🛡️ **FTC & Amazon Associates Compliant**: Includes mandatory Amazon disclosure notices and sponsored tags.

---

## 🚀 Quick Start

### 1. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
```
Creates an optimized static bundle in `dist/`, ready to deploy to **Vercel**, **Netlify**, or **Cloudflare Pages**.
