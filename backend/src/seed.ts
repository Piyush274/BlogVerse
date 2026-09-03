import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Article } from "./models/Article.js";
import { Comment } from "./models/Comment.js";
import { Like } from "./models/Like.js";

import dns from "node:dns";

// Load environment variables
dotenv.config();

// Ensure Atlas SRV records resolve cleanly in all DNS environments
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if not permitted
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/blogverse";

async function seedDatabase() {
  console.log("[Seed] Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("[Seed] Connected successfully to MongoDB.");

  // Clean existing sample articles and engagement data (keeps user accounts if already present)
  console.log("[Seed] Clearing old articles, comments, and likes...");
  await Promise.all([
    Article.deleteMany({}),
    Comment.deleteMany({}),
    Like.deleteMany({}),
  ]);

  const defaultPassword = await bcrypt.hash("password123", 12);

  // 1. Ensure/Create Users
  console.log("[Seed] Seeding Authors...");
  const usersData = [
    {
      name: "Piyush Sangam",
      email: "piyush@blogverse.dev",
      password: defaultPassword,
      imageUrl: "https://github.com/Piyush274.png",
      role: "AUTHOR" as const,
    },
    {
      name: "Elena Rostova",
      email: "elena.rostova@techmail.io",
      password: defaultPassword,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "AUTHOR" as const,
    },
    {
      name: "Alex Rivera",
      email: "alex.rivera@cloudscale.net",
      password: defaultPassword,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "AUTHOR" as const,
    },
  ];

  const authors: any[] = [];
  for (const userData of usersData) {
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create(userData);
    }
    authors.push(user);
  }

  // 2. Sample Rich Articles Data
  console.log("[Seed] Seeding Articles...");
  const sampleArticles = [
    {
      title: "The Rise of Agentic AI: How Autonomous Coding Is Shaping 2026",
      category: "AI",
      featuredImage:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      author: authors[0]._id,
      content: `
        <h2>The Paradigm Shift in Software Engineering</h2>
        <p>In 2026, generative AI has transitioned from simple autocomplete assistants into fully autonomous agentic workflows. Instead of writing boilerplate code line by line, engineers now act as architects guiding specialized AI agents that execute end-to-end tasks.</p>
        
        <blockquote>"The most valuable skill in 2026 is no longer writing syntax from memory—it is prompt architecture, verification, and systems thinking."</blockquote>

        <h3>Key Attributes of Agentic Systems</h3>
        <ul>
          <li><strong>Autonomous Multi-Step Planning:</strong> Decomposing large objectives into verifiable sub-tasks.</li>
          <li><strong>Self-Correction & Testing:</strong> Running compilers and unit tests in isolated sandboxes to heal runtime bugs automatically.</li>
          <li><strong>Context Synthesis:</strong> Ingesting massive mono-repositories and knowledge bases with million-token context windows.</li>
        </ul>

        <h3>What This Means for Developers</h3>
        <p>Developers who leverage agentic workflows achieve 10x velocity. By automating repetitive backend configurations, migrations, and test coverage, teams can focus entirely on core product innovation and user delight.</p>
      `,
    },
    {
      title: "Mastering MERN Stack in 2026: Architecture, Scaling, and Security",
      category: "DevOps",
      featuredImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
      author: authors[0]._id,
      content: `
        <h2>Building for Hyper-Scale in Modern Web Environments</h2>
        <p>The MERN stack (MongoDB, Express.js, React 19, Node.js) continues to dominate modern full-stack development due to its flexibility and lightning-fast developer experience.</p>

        <h3>Core Principles of a Robust Monorepo</h3>
        <ul>
          <li><strong>Strict Type Sharing:</strong> Using TypeScript end-to-end to eliminate API contract mismatches.</li>
          <li><strong>Decoupled Deployments:</strong> Static edge hosting for React SPA (Vercel) and containerized backend web services (Render).</li>
          <li><strong>Defensive Error Boundaries:</strong> Cascade deletions and graceful fallbacks for cloud CDNs.</li>
        </ul>

        <pre><code>// Example: Optimized Mongoose Indexing
const articleSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, index: true },
  createdAt: { type: Date, default: Date.now, index: -1 }
});</code></pre>
      `,
    },
    {
      title: "Modern UI/UX Design Systems: Glassmorphism, Micro-Animations & Fluid Layouts",
      category: "UI/UX Design",
      featuredImage:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
      author: authors[1]._id,
      content: `
        <h2>The Evolution of Digital Aesthetics</h2>
        <p>Contemporary web design is defined by rich depth, subtle translucency, and reactive animations that make applications feel alive under the user's cursor.</p>

        <h3>Essential Pillars of Modern Interfaces</h3>
        <ul>
          <li><strong>Backdrop Filtering:</strong> Layering content over blurred background meshes to establish visual hierarchy.</li>
          <li><strong>Micro-Interactions:</strong> Subtle spring physics on button hover and like triggers.</li>
          <li><strong>Fluid Dark & Light Modes:</strong> Harmonious HSL color palettes tailored for optimal contrast and readability.</li>
        </ul>
      `,
    },
    {
      title: "Deploying Full-Stack TypeScript Apps to Vercel and Render in Minutes",
      category: "Cloud Computing",
      featuredImage:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      author: authors[2]._id,
      content: `
        <h2>The Zero-Downtime Deployment Blueprint</h2>
        <p>Deploying production applications doesn't require a dedicated DevOps team. With Vercel and Render, you can configure continuous integration in under five minutes.</p>

        <h3>Step-by-Step Deployment Strategy</h3>
        <ol>
          <li>Configure database access rules on MongoDB Atlas with global access whitelist (0.0.0.0/0).</li>
          <li>Deploy backend Express service on Render with health checks at <code>/api/health</code>.</li>
          <li>Deploy frontend Vite SPA to Vercel with single-page client rewrites via <code>vercel.json</code>.</li>
          <li>Set environment variables and enable SSL/TLS encryption.</li>
        </ol>
      `,
    },
    {
      title: "Zero-Trust Cloud Security: Best Practices for Modern Engineering Teams",
      category: "Cybersecurity",
      featuredImage:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
      author: authors[0]._id,
      content: `
        <h2>Never Trust, Always Verify</h2>
        <p>In modern cloud engineering, perimeter-based security is obsolete. A Zero-Trust architecture requires every request, service-to-service call, and user session to be authenticated and authorized dynamically.</p>

        <h3>Security Checklist</h3>
        <ul>
          <li><strong>HTTP Security Headers:</strong> Helmet.js configuration to mitigate XSS, Clickjacking, and MIME sniffing.</li>
          <li><strong>Salted Password Hashing:</strong> Bcrypt with high cost factors (rounds >= 12).</li>
          <li><strong>Strict CORS Policies:</strong> Explicit origin whitelisting with regex matching.</li>
        </ul>
      `,
    },
    {
      title: "Demystifying Deep Learning: Transformers, Attention, and Beyond",
      category: "Machine Learning",
      featuredImage:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
      author: authors[1]._id,
      content: `
        <h2>How Attention Mechanisms Revolutionized AI</h2>
        <p>From BERT and GPT to multimodal diffusion models, the Transformer architecture has reshaped artificial intelligence. By computing self-attention across tokens in parallel, neural networks can capture nuanced relationships across vast semantic landscapes.</p>
      `,
    },
    {
      title: "High-Throughput Data Pipelines with MongoDB and Kafka",
      category: "Data Science",
      featuredImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
      author: authors[2]._id,
      content: `
        <h2>Architecting Stream Processing at Scale</h2>
        <p>Real-time analytics require seamless ingestion, transformation, and storage. Learn how connecting Kafka message brokers with MongoDB change streams creates reliable, fault-tolerant data pipelines.</p>
      `,
    },
    {
      title: "Building Resilient SaaS Subscriptions with Stripe and Express",
      category: "Productivity",
      featuredImage:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80",
      author: authors[0]._id,
      content: `
        <h2>From Code to Cash Flow: Monetizing Web Applications</h2>
        <p>Monetizing a platform requires secure payment processing, webhook idempotency, and automated tier provisioning.</p>

        <h3>Crucial Implementation Notes</h3>
        <ul>
          <li>Always parse Stripe webhook bodies with <code>express.raw()</code> to preserve cryptographic signatures.</li>
          <li>Use customer metadata in checkout sessions to map subscriptions directly to user account IDs.</li>
        </ul>
      `,
    },
  ];

  const createdArticles = await Article.insertMany(sampleArticles);
  console.log(`[Seed] Created ${createdArticles.length} articles.`);

  // 3. Seed Comments and Likes for Each Article
  console.log("[Seed] Seeding Comments & Likes...");
  const sampleComments = [
    "Incredible breakdown! The architectural insights here are top-tier.",
    "Very well written. Loving the clean design and detailed examples!",
    "This helped clarify a lot of questions I had about production deployment.",
    "Great article! Looking forward to the next post.",
    "The code snippets are super clear and easy to follow. Thanks for sharing!",
  ];

  for (let i = 0; i < createdArticles.length; i++) {
    const article = createdArticles[i];

    // Add 2 comments from different authors
    const commenter1 = authors[(i + 1) % authors.length];
    const commenter2 = authors[(i + 2) % authors.length];

    await Comment.create([
      {
        body: sampleComments[i % sampleComments.length],
        article: article._id,
        author: commenter1._id,
      },
      {
        body: sampleComments[(i + 2) % sampleComments.length],
        article: article._id,
        author: commenter2._id,
      },
    ]);

    // Add likes from authors
    await Like.create([
      { article: article._id, user: commenter1._id },
      { article: article._id, user: commenter2._id },
    ]);
  }

  console.log("=========================================");
  console.log("✅ [Seed] Database successfully populated!");
  console.log(`- Authors: ${authors.length}`);
  console.log(`- Articles: ${createdArticles.length}`);
  console.log(`- Comments: ${createdArticles.length * 2}`);
  console.log(`- Likes: ${createdArticles.length * 2}`);
  console.log("=========================================");

  await mongoose.disconnect();
  console.log("[Seed] Disconnected from MongoDB.");
}

seedDatabase().catch((err) => {
  console.error("[Seed Error]:", err);
  process.exit(1);
});
