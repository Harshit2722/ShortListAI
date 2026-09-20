# High-Level Design (HLD) - Shortlist AI

## 1. System Architecture Diagram

```
                       ┌─────────────────────────┐
                       │  Client (React + Vite)  │
                       │   Glassmorphism UI      │
                       └────────────┬────────────┘
                                    │ Same-Origin / REST
                                    ▼
                       ┌─────────────────────────┐
                       │ Vercel / Nginx Proxy    │
                       │ (Same-Origin Rewrites)  │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │  Node.js / Express API  │
                       │   (Trust Proxy Active)  │
                       └─────┬───┬───┬───┬───┬───┘
                             │   │   │   │   │
          ┌──────────────────┘   │   │   │   └──────────────────┐
          ▼                      ▼   ▼   ▼                      ▼
┌──────────────────┐  ┌────────────┐ ┌──────────────┐  ┌────────────────┐
│  MongoDB Atlas   │  │ Cloudinary │ │   Groq LLM   │  │ Brevo / Mail   │
│  (Database)      │  │ (Storage)  │ │ (Inference)  │  │ (HTTPS / SMTP) │
└──────────────────┘  └────────────┘ └──────────────┘  └────────────────┘
```

---

## 2. Architectural Components

### 2.1 Frontend Tier
- **Technology**: React 19, Vite, React Router v7, Tailwind CSS v4, Framer Motion, Three.js / React Three Fiber, Axios, Lucide React.
- **Responsibilities**:
  - Multi-step onboarding and registration with email verification guards.
  - Interactive Recruiter Dashboard with live KPI statistics and candidate recommendation breakdown.
  - Job management interface with instant `Open` / `Closed` status switching.
  - PDF resume upload with duplicate prevention alerts and AI scoring visualizers.
  - Candidate details view displaying strengths, weaknesses, missing skills, and detailed sub-scores.
  - Comprehensive user settings (profile, avatar upload, 2-step email change, security).

### 2.2 Backend Application Tier
- **Technology**: Node.js, Express.js 5.
- **Design Pattern**: 3-Tier Layered Pattern (`Routes` → `Middlewares` → `Controllers` → `Services` → `Repositories`).
- **Responsibilities**:
  - Request validation via Zod schemas and granular route rate-limiting.
  - Authentication via HTTP-only JWT cookies (`accessToken` and `refreshToken`).
  - Text extraction (`pdf-parse`) and SHA-256 fingerprinting for duplicate detection.
  - LLM prompt orchestration and structured JSON response parsing with Groq API.
  - Aggregation queries for recruiter pipeline metrics.

### 2.3 External Services & Storage
- **MongoDB Atlas**: Primary database for Users, Jobs, and ResumeSubmissions with compound indexes.
- **Cloudinary**: Object storage for resume PDFs and recruiter avatar images.
- **Groq API**: High-speed LLM inference for candidate analysis and scoring.
- **Brevo REST API / Nodemailer**: Dual email dispatch architecture — Brevo over HTTPS (port 443) for production cloud hosting; Nodemailer SMTP for local development.

---

## 3. Key Data Flows

### 3.1 Authentication & Verification Flow
```
1. Recruiter submits registration details [POST /api/v1/auth/register]
2. Password hashed with bcrypt; user created in unverified state with 6-digit OTP.
3. OTP email dispatched via Brevo HTTPS API (or Nodemailer locally).
4. Recruiter submits OTP [POST /api/v1/auth/verify-email].
5. Server validates OTP, marks user verified, and issues HTTP-only JWT cookies.
```

### 3.2 Password Recovery Flow
```
1. Recruiter requests reset [POST /api/v1/auth/forgot-password] -> OTP emailed.
2. Recruiter verifies OTP [POST /api/v1/auth/verify-reset-otp] -> OTP confirmed.
3. Recruiter sets new password [POST /api/v1/auth/reset-password] -> Password updated.
```

### 3.3 Resume Upload & AI Analysis Pipeline
```
1. Recruiter uploads resume PDF for a job [POST /api/v1/jobs/:jobId/resumes].
2. Server extracts text from buffer via pdf-parse.
3. Server computes SHA-256 hash (fileHash) of the extracted text.
4. Server checks for existing { job, fileHash } in MongoDB (rejects with 409 if duplicate).
5. PDF uploaded to Cloudinary -> secure URL & publicId stored.
6. Server sends resume text + job criteria to Groq LLM with structured prompt schema.
7. Groq returns structured JSON: subscores, overallScore (0-10), recommendation, strengths, weaknesses, missing skills.
8. Analysis saved in MongoDB under ResumeSubmission collection.
```

---

## 4. Security & Deployment Design
- **Cross-Browser Cookie Strategy**: Uses Vercel rewrites to proxy `/api/*` to Render, creating a same-origin (`first-party`) context so Safari ITP and other privacy protections never block auth cookies.
- **Reverse Proxy Support**: Express `trust proxy` enabled for accurate client IP resolution with `express-rate-limit`.
- **Defensive Headers**: Helmet security headers, strict CORS origin controls, and HTTP-only cookie flags.
- **Containerization**: Multi-container setup via Docker and `docker-compose.yml` with Nginx reverse proxy.
