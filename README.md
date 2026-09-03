# 🚀 BlogVerse – MERN Stack Full-Stack Blogging Platform & Multi-Agentic AI Suite

**BlogVerse** is a modern, high-performance, production-grade content publishing and SaaS blogging platform built on the **MERN Stack** (**MongoDB**, **Express.js**, **React 19 with Vite**, and **Node.js**) and enhanced with an **Autonomous Generative AI & Agentic Suite** (**Groq Llama 3.3/3.1**, **LangGraph/LangChain**, **MongoDB Vector Search**, and **Server-Sent Events**).

---

## 🌟 Key Highlights & AI Capabilities

1. **🤖 Multi-Agent Editorial Pipeline (LangGraph & SSE)**:
   - 4-Stage autonomous agent workflow: **Researcher Agent** $\rightarrow$ **Drafter Agent** $\rightarrow$ **Critic & Fact-Checker Agent** $\rightarrow$ **SEO & Visuals Agent**.
   - Streams live agent reasoning traces via **Server-Sent Events (SSE)** and formats structured JSON with **Zod** validation.
   - 1-Click insertion directly into the rich-text ReactQuill editor.

2. **⚡ Dynamic Article RAG & Semantic Reader Assistant**:
   - Automatic text chunking (600 characters with 100-character sliding overlap) and vector embeddings.
   - **MongoDB Atlas Vector Search** (`$vectorSearch`) with unit-normalized cosine similarity fallback.
   - Grounded reader Q&A chat assistant with exact citation anchors (`[1]`, `[2]`).
   - Instant AI Executive Summary & Key Technical Takeaways.

3. **🛡️ AI Guardrails: Comment Moderation & Debate Synthesis**:
   - Real-time pre-persistence guardrail blocking toxic content, promotional spam, and prompt injection attempts.
   - Community Debate Synthesizer clustering reader comments into consensus summaries and perspective distributions.
   - AI Conversation Starter generator for articles with 0 comments.

4. **🔐 Enterprise Auth, Media & SaaS Billing**:
   - Native **JWT + bcryptjs** authentication (salt cost 12) with Zod validation.
   - **Cloudinary** media streaming via Multer memory buffers (zero disk overhead).
   - Recurring **Stripe Subscriptions** with raw webhook signature validation.

---

## 🧩 Tech Stack

### Frontend (`/frontend`)
- **Framework:** React 19 + Vite (TypeScript SPA)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + Radix UI Primitives + Lucide Icons
- **Theme:** Custom Dark / Light / System Mode Provider
- **Rich Text Editor:** ReactQuill
- **AI Streaming:** Native Fetch Stream & Server-Sent Events (SSE)

### Backend (`/backend`)
- **Runtime & Server:** Node.js + Express.js (TypeScript)
- **Database & Vector Search:** MongoDB + Mongoose + MongoDB Atlas Vector Search
- **AI & Agents:** Groq SDK (Llama 3.3-70b-versatile, Llama 3.1-8b-instant), LangGraph, LangChain, Zod
- **Auth & Security:** JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, Helmet, CORS, Morgan
- **File Storage:** Cloudinary (via Multer memory stream)
- **Payments:** Stripe Checkout & Webhook Handling

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────┐
│                 React 19 SPA (Vite + TS)                  │
│  - Multi-Agent Editorial Stepper Modal (Live SSE Stream)  │
│  - Interactive Article RAG Chat Drawer with Citations     │
│  - AI Community Pulse Debate Accordion                    │
│  - ReactQuill WYSIWYG & Stripe Checkout                   │
└─────────────────────────────┬─────────────────────────────┘
                              │ REST API / Server-Sent Events (SSE)
                              ▼
┌───────────────────────────────────────────────────────────┐
│              Express.js API Server (Node + TS)            │
│  - /api/ai/generate-article-stream (LangGraph Pipeline)   │
│  - /api/ai/articles/:id/chat       (Grounded RAG)         │
│  - /api/articles (Comments guarded by AI Moderation)      │
│  - /api/payments (Stripe Raw Webhook Verification)        │
└──────────────┬──────────────────┬─────────────────┬───────┘
               │                  │                 │
               ▼                  ▼                 ▼
      ┌────────────────┐  ┌──────────────┐   ┌──────────────┐
      │ MongoDB Atlas  │  │  Groq Cloud  │   │  Cloudinary  │
      │ - Vector Index │  │ - Llama 3.3  │   │  - Image CDN │
      │ - Documents    │  │ - Llama 3.1  │   └──────────────┘
      └────────────────┘  └──────────────┘
```

---

## 📁 Repository Structure

```
BlogVerse/
├── frontend/                     # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── api/                  # Axios & SSE API clients (ai.api.ts, articles, comments, etc.)
│   │   ├── components/
│   │   │   ├── articles/         # AgentEditorialModal, ArticleChatDrawer, CommunityPulse, etc.
│   │   │   ├── dashboard/        # Author stats & metrics
│   │   │   └── home/             # Navbar, Hero, Features
│   │   ├── context/              # AuthContext & ThemeContext
│   │   └── pages/                # SPA Routes (Home, Articles, Detail, Dashboard, Create, Edit)
│   ├── package.json
│   └── .env.example
│
├── backend/                      # Express + Node.js REST API Server
│   ├── src/
│   │   ├── config/               # DB, Cloudinary, Stripe, AI (Groq/OpenRouter) config
│   │   ├── controllers/          # Handlers (ai, auth, article, comment, dashboard, payment)
│   │   ├── middleware/           # JWT Auth, Multer upload, Error handler
│   │   ├── models/               # Mongoose Models (Article with Chunks/Embeddings, Comment, Like, User)
│   │   ├── routes/               # REST API Routes (/api/ai, /api/articles, /api/auth, etc.)
│   │   ├── services/             # agent.service.ts, rag.service.ts, moderation.service.ts, embedding.service.ts
│   │   └── server.ts             # Express initialization & listener
│   ├── package.json
│   └── .env.example
│
├── interview_blog_verse.md       # Comprehensive STAR-format Technical Interview Guide
└── package.json                  # Root monorepo scripts (concurrently)
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
  STRIPE_WEBHOOK_SECRET=whsec_...

  # AI & Agentic Suite
  GROQ_API_KEY=gsk_...
  GROQ_MODEL=llama-3.3-70b-versatile
  GROQ_FAST_MODEL=llama-3.1-8b-instant
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

---

## 🌐 AI API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/generate-article-stream` | Multi-Agent editorial generation via real-time SSE stream | Yes |
| `POST` | `/api/ai/generate-article` | Synchronous Multi-Agent article generation | Yes |
| `POST` | `/api/ai/articles/:id/chat` | Conversational RAG with article context & grounded citations | No |
| `GET` | `/api/ai/articles/:id/summary` | Instant AI Executive Summary and key takeaways | No |
| `GET` | `/api/ai/articles/:id/debate-summary` | Community sentiment, consensus, and perspective clustering | No |
| `GET` | `/api/ai/articles/:id/discussion-starter` | Generates a discussion starter question for 0-comment articles | No |
| `POST` | `/api/articles/:id/comments` | Post comment with real-time AI safety & spam moderation | Yes |

---

## 📄 License
MIT License. Created by [Piyush Sangam](https://github.com/Piyush274).
