# InterviewIQ 🚀

InterviewIQ is a **Production-Ready Full Stack Gen AI Job Preparation Platform**. It empowers job seekers to analyze job descriptions against their profiles, detect skill gaps, generate AI-powered interview questions, and build a personalized preparation roadmap using Google's Gemini AI.

---
## ✨ Key Features

- **🛡️ Secure Authentication**: Full JWT-based authentication system with premium-designed, themed Login and Register pages featuring ambient glow effects.
- **🧠 AI-Powered Strategy**: Generates custom technical and behavioral interview questions plus a detailed day-by-day preparation roadmap based on your profile and the target job.
- **📄 Intelligent Resume Parsing**: Automatically extracts and analyzes text from uploaded PDF resumes using advanced parsing techniques.
- **⚖️ Skill Gap Detection**: Uses AI to cross-reference your skills against job requirements, providing a "Match Score" and highlighting critical areas for improvement.
- **🎨 Modern "Gemini-like" UI**: A stunning, responsive interface built with glassmorphism, smooth gradients (Pink/Purple theme), and interactive micro-animations. Features a signature "flowing color" animated gradient text effect.
- **↕️ Draggable Workspace**: A fully resizable sidebar workspace that lets you customize your view, with a smooth dragging handle and persistent layout.
- **📱 Fully Responsive Layout**: Optimized for all devices—from desktop monitors to mobile phones—featuring a slick hamburger menu, mobile-optimized navigation, and perfectly aligned equal-height flexbox grids.
- **📥 ATS-Optimized Downloads**: Dynamically generates and allows you to download an ATS-friendly resume/report summary.

---
## 🛠️ Tech Stack

**Frontend:**
- **React (Vite)**: For a blazing fast development and production experience.
- **SCSS**: Advanced styling with a focus on modern design principles (Glassmorphism, Flexbox/Grid, continuous CSS keyframe animations).
- **React Router**: Seamless navigation and protected routing for authenticated users.
- **Axios**: Robust API communication.

**Backend:**
- **Node.js & Express.js**: High-performance backend architecture.
- **MongoDB & Mongoose**: Scalable NoSQL database for user data and interview reports.
- **JWT**: Secure, stateless authentication.
- **@google/genai**: Integration with Google's Gemini Pro model for advanced reasoning.
- **pdf-parse**: Reliable PDF text extraction.

---
## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google Gemini API Key (get it at [Google AI Studio](https://aistudio.google.com/))

---
### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tiku57/InterviewIQ.git
   cd InterviewIQ
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   # Create .env file
   echo "PORT=3000\nMONGO_URI=your_mongodb_uri\nJWT_SECRET=your_jwt_secret\nGOOGLE_GENAI_API_KEY=your_gemini_key" > .env
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

---
## 📸 UI/UX Design Philosophy

InterviewIQ isn't just a tool; it's an experience. We've prioritized:
- **Visual Excellence**: A curated dark-mode palette (#171313) with vibrant Pink (#F040B5) and Purple accents. Includes details like seamless flowing gradient text loops.
- **Pixel-Perfect Structure**: Meticulously balanced spacing, centered visual dividers, and equal-height layout components for a professional feel.
- **Interactive Feedback**: Draggable handles, hover glow effects, dynamic dashed drop zones, and smooth transitions that make the app feel alive.
- **Clarity**: A clean, "no-box" full-page layout that focuses on the content that matters most—your career preparation.

---
👨‍💻 Author
Aaditya Sattawan
---
GitHub: https://github.com/Tiku57
