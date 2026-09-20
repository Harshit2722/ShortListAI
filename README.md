# Shortlist AI

> AI-powered Recruitment Assistant built with React 19, Node.js, Express, MongoDB, Cloudinary, and Groq LLM.

Shortlist AI is an AI-powered recruitment assistant that streamlines candidate sourcing, hiring pipelines, and resume evaluation. Recruiters can post jobs, upload resumes with automated duplicate detection (SHA-256 fingerprinting), analyze candidate resumes using Groq's high-speed LLM inference, and monitor pipeline metrics through a centralized real-time dashboard.

---

## Key Features

- **Secure JWT Authentication**: HTTP-only cookie-based authentication using short-lived access tokens (15m) and auto-rotated refresh tokens (7d).
- **Multi-Step Onboarding & Verification**: Seamless 3-step recruiter registration flow with OTP-based email verification and route-level step guards.
- **Forgot Password Recovery**: Secure self-service password reset flow with OTP validation before password reset.
- **Dual Transactional Email Architecture**:
  - **Brevo REST API (HTTPS)**: Default for cloud deployments (e.g., Render) where outbound SMTP ports are blocked.
  - **Nodemailer (SMTP)**: Automatic fallback for local development or custom SMTP hosts (Gmail App Password).
  - Modern, responsive HTML email templates for onboarding, password recovery, and email change verification.
- **Recruiter Dashboard & Analytics**: Real-time hiring pipeline overview displaying total jobs, candidate metrics, score distributions, and match recommendations (*Strong Match*, *Good Match*, *Average Match*, *Poor Match*).
- **Job Posting & Status Management**: Full CRUD operations on job postings with real-time status toggling (`open`, `closed`).
- **Resume Upload with Duplicate Prevention**:
  - SHA-256 hashing detects duplicate candidate resumes before processing.
  - PDF text extraction (`pdf-parse`) and cloud storage integration with Cloudinary.
- **AI-Powered Resume Analysis (Groq LLM)**:
  - Fast structured JSON evaluation matching candidates against exact job requirements.
  - Generates individual candidate scores (0-10) like skill, experience, match recommendation, strengths, weaknesses, and skill alignments.
- **Complete User Settings & Profile Management**:
  - Recruiter profile editing (name, company, title).
  - Avatar upload and deletion with Cloudinary storage and automatic cleanup.
  - Secure two-step email address change (sends OTP to new email address).
  - Password change and secure account deletion with confirmation.
- **Security & Reliability**:
  - Request validation using Zod schemas for request body, query params, and route params.
  - Granular rate limiting with `express-rate-limit` across public auth, token refresh, and user update routes.
  - `trust proxy` enabled for accurate client IP resolution behind reverse proxies (Render, Vercel, Nginx).
  - Cross-browser cookie support via Vercel same-origin reverse proxy (works out of the box on Safari ITP, Brave, Chrome, and Firefox).
- **Modern UI & 3D Visuals**:
  - Built with React 19, Tailwind CSS v4, Framer Motion animations, and Three.js / React Three Fiber 3D hero canvas.
- **Containerized Deployment Support**: Docker Compose configuration with Nginx for multi-container local and production setups.

---

## AI Resume Analysis Workflow

```
Resume Upload (PDF)
      │
      ▼
Extract PDF Text (pdf-parse)
      │
      ▼
Generate SHA-256 Hash
      │
      ├── (Hash exists?) ──> Reject Duplicate Submission (409 Conflict)
      ▼
Upload to Cloudinary Storage
      │
      ▼
LLM Analysis (Groq API)
      │
      ▼
Validate AI Response Schema
      │
      ▼
Calculate Dynamic Score & Recommendation
(Strong / Good / Average / Poor Match)
      │
      ▼
Store Candidate Analysis in MongoDB
```

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS v4, Framer Motion, Axios, Lucide React, Three.js, React Three Fiber |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB Atlas, Mongoose 9 |
| **AI / LLM** | Groq SDK (`openai/gpt-oss-20b`, or custom via `AI_MODEL`) |
| **Email Service** | Brevo HTTPS REST API (Production) / Nodemailer SMTP (Local fallback) |
| **Authentication** | JWT (Access & Refresh tokens), bcryptjs, HTTP-only Cookies |
| **Validation** | Zod |
| **File Storage** | Cloudinary (Resumes & Avatars) |
| **File Handling** | Multer, PDF-Parse, Streamifier |
| **DevOps** | Docker, Docker Compose, Nginx, Vercel, Render |
| **Security** | Helmet, CORS, Express Rate Limit, Trust Proxy, SameSite Cookie Handling |

---

## Architecture

The backend follows a clean, decoupled **Controller → Service → Repository** pattern:

```
                  Client (React / Vite)
                            │
                            ▼
                    Routes & Middlewares
              (JWT, Zod Validate, Rate Limits)
                            │
                            ▼
                       Controllers
                            │
                            ▼
                         Services
                ┌───────────┴───────────┐
                ▼                       ▼
          Repositories             Third-Party Services
                │                  ├── Groq LLM
                ▼                  ├── Cloudinary
          MongoDB Models           └── Brevo / Nodemailer
```

---

## Project Structure

```
ShortlistAI/
├── client/                      # React Frontend (Vite)
│   ├── public/                  # Static assets and icons
│   ├── src/
│   │   ├── api/                 # Axios client, interceptors, and modular API requests
│   │   ├── components/
│   │   │   ├── candidates/      # Resume upload modal, candidate evaluation cards
│   │   │   ├── common/          # Button, Card, Input, Modal, Table reusable primitives
│   │   │   ├── dashboard/       # Stat cards, metrics, summary components
│   │   │   ├── layout/          # Recruiter and public navigation bars, footer
│   │   │   ├── settings/        # Profile, email change, password, danger zone tabs
│   │   │   └── ui/              # Badge, Loader, animated spinners
│   │   ├── context/             # AuthContext (global user state & session handling)
│   │   ├── hooks/               # Custom hooks (useAuth, etc.)
│   │   ├── layouts/             # RecruiterLayout and public layouts
│   │   ├── pages/
│   │   │   ├── auth/            # Login, 3-step Register, Forgot Password
│   │   │   ├── dashboard/       # Dashboard, Jobs, Job Details, Candidate Details, Settings
│   │   │   └── landing/         # 3D interactive landing page (Hero, Features, CTA)
│   │   ├── routes/              # Protected and public route guards
│   │   └── utils/               # Animation variants and helper utilities
│   ├── Dockerfile
│   ├── nginx.conf               # Nginx reverse proxy configuration for Docker
│   ├── vercel.json              # Vercel SPA routing and same-origin API proxy
│   └── vite.config.js
├── server/                      # Node.js Express Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection, Cloudinary, and Mail transporter
│   │   ├── constants/           # Cookie options and app constants
│   │   ├── controllers/         # Request handlers (auth, dashboard, job, resume, user)
│   │   ├── middlewares/         # Auth (JWT), file upload, avatar upload, validation, error handler, rate limiters
│   │   ├── models/              # Mongoose schemas (User, Job, ResumeSubmission)
│   │   ├── repositories/        # Database access layer (User, Job, Resume, Dashboard)
│   │   ├── routes/              # Express routers (auth, dashboard, jobs, users)
│   │   ├── services/            # Business logic, AI service (Groq), Email service (Brevo/SMTP)
│   │   ├── utils/               # ApiError, ApiResponse, asyncHandler, token generators
│   │   ├── validators/          # Zod validation schemas
│   │   ├── app.js               # Express application initialization
│   │   └── server.js            # Server entry point
│   └── Dockerfile
├── docker-compose.yml           # Multi-container orchestration
└── README.md
```

---

## Prerequisites

Ensure you have the following accounts and tools set up:
- **[Node.js](https://nodejs.org/)** (v20 or higher)
- **[MongoDB](https://www.mongodb.com/cloud/atlas)** (Local MongoDB or MongoDB Atlas cluster connection URI)
- **[Cloudinary Account](https://cloudinary.com/)** (For secure avatar and resume PDF storage)
- **[Groq Console Account](https://console.groq.com/)** (API key for LLM resume analysis)
- **Email Service Credentials**:
  - **[Brevo Account](https://www.brevo.com/)** *(Recommended for production)*: API key from Brevo dashboard for HTTPS transactional email sending.
  - **OR [Google Account](https://myaccount.google.com/)** *(For local SMTP)*: 16-character **[App Password](https://support.google.com/accounts/answer/185833)**.
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** *(Optional, for containerized setup)*

---

## Setup & Installation

### Option 1: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Harshit2722/ShortlistAI.git
cd ShortlistAI
```

#### 2. Configure and Run Backend
1. Navigate to the `server` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server` directory:
   ```env
   PORT=8000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   # Database
   MONGO_URI=your_mongodb_connection_string

   # Authentication
   JWT_SECRET=your_jwt_access_token_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_token_secret
   JWT_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d

   # Email Service Option A: Brevo API (Recommended for production)
   BREVO_API_KEY=your_brevo_api_key
   BREVO_SENDER_EMAIL=your_verified_sender_email@example.com

   # Email Service Option B: SMTP (Nodemailer fallback)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_gmail_address@gmail.com
   MAIL_PASS=your_16_character_app_password
   MAIL_FROM="Shortlist AI" <your_gmail_address@gmail.com>

   # Cloudinary Storage
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_RESUME_FOLDER=shortlist-ai/resumes
   CLOUDINARY_AVATAR_FOLDER=shortlist-ai/avatars

   # AI / LLM Configuration
   GROQ_API_KEY=your_groq_api_key
   AI_MODEL=openai/gpt-oss-20b
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```

#### 3. Configure and Run Frontend
1. Open a new terminal, navigate to the `client` directory, and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

### Option 2: Docker Setup

1. Make sure **Docker Desktop** is installed and running.
2. Configure your environment files (`server/.env` and `client/.env`).
3. From the root `ShortlistAI` directory, build and launch the containers:
   ```bash
   docker compose up --build
   ```
4. Access the application:
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:8000`

---

## Production Deployment (Vercel & Render)

### 1. Backend Deployment (Render / Railway)
- **Runtime**: Node.js web service (`npm start` running `src/server.js`)
- **Key Environment Variables**:
  - `NODE_ENV=production`
  - `CLIENT_URL=https://<your-app>.vercel.app`
  - Set `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` (ensures emails are sent via HTTPS port 443, bypassing cloud provider SMTP blocks).
  - `trust proxy` is configured in Express, ensuring rate limiters and secure cookie flags work accurately behind cloud load balancers.

### 2. Frontend Deployment (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Environment Variable**:
  ```env
  VITE_API_URL=/api/v1
  ```
- **Same-Origin API Reverse Proxy (`vercel.json`)**:
  To prevent cross-site cookie restrictions (such as **Apple Safari's Intelligent Tracking Prevention / ITP**) from dropping HTTP-only authentication cookies, API requests are routed through Vercel rewrites:
  ```json
  {
    "rewrites": [
      {
        "source": "/api/:path*",
        "destination": "https://shortlistai-tgw5.onrender.com/api/:path*"
      },
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
  > **Why this matters:** When the client and API share the same origin (`vercel.app`), browsers treat authentication cookies as **1st-party cookies**, guaranteeing uninterrupted login and refresh token flows on Safari, Chrome, Firefox, and Brave without requiring users to disable tracking protections.

---

## API Endpoints

### Health Check
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Root backend health check |

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new recruiter account |
| `POST` | `/verify-email` | Public | Verify registration OTP code |
| `POST` | `/resend-otp` | Public | Resend verification OTP code |
| `POST` | `/forgot-password` | Public | Send password reset OTP |
| `POST` | `/verify-reset-otp` | Public | Verify OTP code before password reset |
| `POST` | `/reset-password` | Public | Reset password using verified OTP |
| `POST` | `/login` | Public | Log in with credentials and receive cookies |
| `POST` | `/logout` | Private | Clear authentication cookies and log out |
| `POST` | `/refresh` | Public | Refresh expired access token using refresh cookie |

### Recruiter Dashboard (`/api/v1/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Private | Retrieve hiring metrics, pipeline statistics, and candidate recommendations |

### User Management (`/api/v1/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Private | Retrieve logged-in recruiter profile |
| `PATCH` | `/profile` | Private | Update recruiter profile details |
| `PATCH` | `/request-email-change` | Private | Request email change (sends OTP to new address) |
| `PATCH` | `/verify-email-change` | Private | Verify OTP and finalize email change |
| `PATCH` | `/password` | Private | Update current password |
| `POST` | `/avatar` | Private | Upload/Update user avatar (Cloudinary) |
| `DELETE` | `/avatar` | Private | Remove user avatar |
| `DELETE` | `/` | Private | Permanently delete recruiter account and data |

### Job Management (`/api/v1/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Private | Create a new job posting |
| `GET` | `/` | Private | Retrieve all job postings with pagination & filtering |
| `GET` | `/:jobId` | Private | Retrieve specific job details by ID |
| `PATCH` | `/:jobId` | Private | Update job posting details |
| `PATCH` | `/:jobId/status` | Private | Update job status (`active`, `closed`, `draft`) |
| `DELETE` | `/:jobId` | Private | Delete a job posting |

### Resume Operations (`/api/v1/jobs/:jobId/resumes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Private | Upload a resume PDF (SHA-256 hash check & Cloudinary upload) |
| `GET` | `/` | Private | Retrieve all candidates/resumes for a specific job |
| `GET` | `/:resumeId` | Private | Retrieve candidate resume analysis details |
| `DELETE` | `/:resumeId` | Private | Delete a candidate submission |
| `POST` | `/:resumeId/analyze` | Private | Trigger or re-run AI resume analysis via Groq |
