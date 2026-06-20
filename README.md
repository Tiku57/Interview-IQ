# InterviewIQ - AI Powered Interview Preparation

InterviewIQ is an enterprise-grade AI assistant that parses your resume, compares it against target job descriptions, and generates highly tailored technical and behavioral interview preparation plans using Gemini 2.5 Flash.

**🌟 Live Demo: [https://dog-studio-clone-six.vercel.app/](https://dog-studio-clone-six.vercel.app/)**

## ✨ Enterprise Features
* **Async Job Queue Processing:** Offloads heavy AI generation and PDF parsing tasks to a background worker via **BullMQ** and **Redis**, preventing HTTP timeouts and scaling effectively.
* **Resilient Architecture:** Implements a multi-model fallback strategy ensuring 99.9% uptime for report generation.
* **Structured Logging & Validation:** Uses **Winston** for observability and **Zod** for robust request validation and schemas.
* **Security First:** Defends against abuse with **Helmet**, **express-rate-limit**, and TTL-indexed token blacklisting.
* **Modern Frontend:** Features **TanStack Query (React Query)** for efficient data fetching, polling, and cache invalidation, paired with Shimmer Loading Skeletons for a fluid user experience.
* **Test Coverage:** Automated API tests using **Jest** and **Supertest** with MongoDB in-memory server.
* **Dockerized:** Ready for local development with `docker-compose`.

## 🏗️ Architecture
- **Frontend:** React, TanStack Query, React Router, SCSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Queue/Cache:** Redis, BullMQ
- **AI Integration:** Google Generative AI (Gemini Flash family)

## 🚀 Getting Started
### 1. Prerequisites
- Node.js (v18+)
- MongoDB instance (or local)
- Redis server (or Docker)
- Gemini API Key

### 2. Setup (Backend)
```bash
cd Backend
npm install
```
Create a `.env` file in `Backend`:
```
PORT=3000
MONGODB_URI=your_mongo_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_key
REDIS_URL=redis://localhost:6379
```

Run tests:
```bash
npm test
```

Start the server & worker:
```bash
npm run dev
```

### 3. Setup (Frontend)
```bash
cd Frontend
npm install
```
Start development server:
```bash
npm run dev
```

### 4. Docker Quickstart
```bash
docker-compose up -d
```
This will spin up Redis and the Node.js backend.

## 📈 Scalability Highlights
- **Event-Driven AI Generation:** Instead of blocking HTTP requests for 10-20 seconds while Gemini processes resumes, InterviewIQ enqueues a job in BullMQ and immediately responds with a `201 Accepted`. The frontend uses TanStack Query to poll the endpoint until the worker completes the generation.
- **Failover Logic:** Automatically attempts processing with `gemini-2.5-flash`, then falls back to `2.0-flash` or `1.5-flash` in case of rate limits or transient failures.

---
*Built with ❤️ for aspiring engineers.*
