# InterviewIQ

InterviewIQ is a Production-Ready Full Stack Gen AI Job Preparation Web Application. It empowers users to analyze job descriptions against their resumes (or self-descriptions), detect skill gaps, generate AI-powered interview questions, and build a personalized preparation strategy using Google's Gemini AI.

## Features

- **Secure User Authentication**: Full JWT-based authentication system with secure user registration and login.
- **AI-Powered Interview Strategy**: Generates custom interview questions (behavioral and technical) and preparation plans based on the user's profile and the target job description.
- **Resume Parsing**: Automatically extracts and reads text from uploaded PDF resumes.
- **Skill Gap Analysis**: Uses AI to cross-reference the user's skills against job requirements and highlights critical gaps.
- **ATS-Optimized PDF Generation**: Dynamically creates a downloadable, ATS-friendly resume PDF using Puppeteer.
- **Recent Reports Dashboard**: Saves user history so you can review previous interview preparation strategies at any time.

## Tech Stack

**Frontend:**
- React (Vite)
- TailwindCSS / SCSS for Styling
- Axios for API requests
- React Router

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- `@google/genai` (Google Gemini API)
- `pdf-parse` (PDF text extraction)
- `puppeteer` (PDF generation)

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js (v18 or higher recommended)
- A MongoDB Atlas Account / Connection String
- A Google Gemini API Key (from Google AI Studio)

## Environment Setup

1. Navigate to the `Backend` directory and create a `.env` file:
   ```bash
   cd Backend
   touch .env
   ```

2. Add your secrets to the `Backend/.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

## Running the Project Locally

### 1. Start the Backend Server
```bash
cd Backend
npm install
npm run dev
```
The backend API will start on `http://localhost:3000`.

### 2. Start the Frontend Application
In a new terminal window:
```bash
cd Frontend
npm install
npm run dev
```
The React frontend will start on `http://localhost:5173`.

## How to Use
1. Open `http://localhost:5173` in your browser.
2. Register for a new account or log in.
3. Paste a target Job Description.
4. Upload your resume (PDF) OR type a brief Self-Description.
5. Click **Generate My Interview Strategy** and let the AI do the heavy lifting!
