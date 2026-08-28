# High-Level Design (HLD) - Shortlist AI

## 1. System Architecture Diagram

```
                       ┌─────────────────────────┐
                       │  Client (React + Vite)  │
                       │   Glassmorphism UI      │
                       └────────────┬────────────┘
                                    │ HTTPS / REST
                                    ▼
                       ┌─────────────────────────┐
                       │      Nginx / Proxy      │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │   Node.js / Express API │
                       │    (Layered Backend)    │
                       └─────┬───┬───┬───┬───┬───┘
                             │   │   │   │   │
          ┌──────────────────┘   │   │   │   └──────────────────┐
          ▼                      ▼   ▼   ▼                      ▼
┌──────────────────┐  ┌────────────┐ ┌──────────────┐  ┌────────────────┐
│  MongoDB Atlas   │  │ Cloudinary │ │   Groq LLM   │  │   Nodemailer   │
│  (Database)      │  │ (Storage)  │ │ (Inference)  │  │  (Email / OTP) │
└──────────────────┘  └────────────┘ └──────────────┘  └────────────────┘
```

---

## 2. Architectural Components

### 2.1 Frontend (Client Tier)
- **Technology**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Responsibilities**:
  - User authentication and onboarding views (Login, Register, OTP Verification, Password Recovery).
  - Recruiter Dashboard with dynamic KPI stats and candidate leaderboards.
  - Job management and candidate resume upload interface with progress feedback.
  - Candidate details view displaying AI match breakdown, strengths, gaps, and recommendations.

### 2.2 Backend (Application Tier)
- **Technology**: Node.js, Express.js.
- **Design Pattern**: 3-Tier Layered Architecture (`Routes` → `Middlewares` → `Controllers` → `Services` → `Repositories`).
- **Responsibilities**:
  - Request validation (Zod) and rate limiting.
  - Authentication & Authorization via JWT stored in HTTP-only cookies.
  - PDF text extraction and SHA-256 hash generation for duplicate resume detection.
  - AI prompt orchestration and structured JSON response parsing with Groq API.
  - Aggregation pipelines for recruiter metrics and candidate statistics.

### 2.3 External Integrations & Storage Tier
- **MongoDB**: Primary document store for Users, Jobs, and ResumeSubmissions with indexing for sorting and search.
- **Cloudinary**: Object storage for candidate resume PDFs and user avatar images with automated cleanup.
- **Groq API**: High-speed LLM inference for candidate profile parsing, scoring, and recommendation generation.
- **Nodemailer (SMTP)**: Transactional email delivery for account verification and password resets.

---

## 3. Key Data Flows

### 3.1 Authentication Flow
```
User -> [POST /api/v1/auth/register] -> Hash Password (bcrypt) -> Generate OTP -> Send Email (SMTP)
User -> [POST /api/v1/auth/verify-otp] -> Validate OTP -> Activate Account -> Issue JWT (HTTP-only Cookie)
```

### 3.2 Resume Upload & AI Analysis Pipeline
```
1. Recruiter uploads PDF resume for a specific Job.
2. Server extracts raw text using pdf-parse.
3. Server generates SHA-256 hash of extracted text.
4. Server checks database for duplicate hash under the same job.
5. Upload PDF file to Cloudinary and get secure URL.
6. Dispatch text + Job Description to Groq LLM with structured JSON schema prompt.
7. Compute weighted candidate match score (1-10) and recommendation tag.
8. Persist candidate profile & AI analysis to MongoDB under ResumeSubmission collection.
```

---

## 4. Security & Deployment Design
- **Security Controls**: CORS whitelisting, Helmet security headers, cookie-based JWT tokens, rate limiting per route group, input sanitization via Zod.
- **Containerization**: Backend and frontend packaged with Docker; orchestratable via `docker-compose.yml` with reverse proxy support.
