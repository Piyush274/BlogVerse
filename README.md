# 🚀 BlogVerse – MERN Stack Full-Stack Blogging Platform

**BlogVerse** is a modern, high-performance, full-stack blogging platform built on the **MERN Stack** (**MongoDB**, **Express.js**, **React 19 with Vite**, and **Node.js**) organized as a clean monorepo (`/frontend` and `/backend`).

It features native **JWT + bcryptjs** user authentication, media uploads via **Cloudinary**, rich-text creation via **ReactQuill**, dynamic analytics, commenting & liking systems, and SaaS subscription billing via **Stripe**.

---

## 🧩 Tech Stack

### Frontend (`/frontend`)
- **Framework:** React 19 + Vite (TypeScript SPA)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + Radix UI Primitives + Lucide Icons
- **Theme:** Custom Dark / Light / System Mode Provider
- **Rich Text Editor:** ReactQuill

### Backend (`/backend`)
- **Runtime & Server:** Node.js + Express.js (TypeScript)
- **Database & ODM:** MongoDB + Mongoose
- **Auth & Security:** JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, Helmet, CORS, Morgan
- **File Storage:** Cloudinary (via Multer memory stream)
- **Payments:** Stripe Checkout & Webhook Handling
- **Validation:** Zod

---

## 📁 Repository Structure

```
BlogVerse/
├── frontend/            # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── api/         # Axios API clients with Bearer token interceptor
│   │   ├── components/  # Reusable UI components (Navbar, Hero, Articles, Dashboard)
│   │   ├── context/     # AuthContext & ThemeContext (Dark/Light/System)
│   │   ├── pages/       # SPA Routes (Home, Articles, Detail, Dashboard, SignIn, SignUp)
│   │   ├── App.tsx      # React Router route definitions
│   │   └── main.tsx     # Application entry point
│   ├── package.json
│   └── .env.example
│
├── backend/             # Express + Node.js REST API Server
│   ├── src/
│   │   ├── config/      # MongoDB connection, Cloudinary & Stripe setup
│   │   ├── models/      # Mongoose Models (User, Article, Comment, Like)
│   │   ├── middleware/  # JWT Auth & Multer upload middleware
│   │   ├── controllers/ # Business logic handlers (auth, article, comment, like, dashboard, payment)
│   │   ├── routes/      # REST API route definitions
│   │   └── server.ts    # Express initialization & listener
│   ├── package.json
│   └── .env.example
│
├── package.json         # Root monorepo scripts (concurrently)
└── .env.example         # Consolidated environment template
```

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Piyush274/BlogVerse
cd BlogVerse
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Setup Environment Variables

- Create `backend/.env` (see `backend/.env.example`):
  ```env
  PORT=5000
  CLIENT_URL=http://localhost:5173
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blogverse?retryWrites=true&w=majority
  JWT_SECRET=your_jwt_secret_key_here
  JWT_EXPIRES_IN=7d
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  STRIPE_SECRET_KEY=sk_test_...
  ```

- Create `frontend/.env` (see `frontend/.env.example`):
  ```env
  VITE_API_URL=/api
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
  VITE_STRIPE_PRO_PRICE_ID=price_...
  VITE_STRIPE_ENTERPRISE_PRICE_ID=price_...
  ```

### 4. Run Development Servers
```bash
# Run both Backend (port 5000) and Frontend (port 5173) simultaneously:
npm run dev

# Or run them separately:
npm run dev:backend   # Express server (http://localhost:5000)
npm run dev:frontend  # Vite client (http://localhost:5173)
```

### 5. Build for Production
```bash
npm run build
```
