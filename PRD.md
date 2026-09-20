# Product Requirements Document (PRD) - Shortlist AI

## 1. Overview
**Shortlist AI** is an AI-powered recruitment assistant platform designed to automate and accelerate candidate screening. It enables recruiters to manage job postings, upload candidate resumes with automated duplicate detection (SHA-256 fingerprinting), and automatically evaluate, score, and rank candidates against concrete job requirements using Groq LLM inference.

---

## 2. Target Audience & Personas
- **Recruiters & Hiring Managers**: Screen high volumes of applicant resumes rapidly and objectively without manual review of every document.
- **Candidates (Indirect)**: Evaluated fairly based on structured skill and experience match against explicit job criteria.

---

## 3. Core Features & Requirements

### 3.1 Authentication & User Management
- **3-Step Registration**: Structured onboarding collecting personal details, company and designation, followed by email OTP verification.
- **Session Security**: JWT authentication with HTTP-only cookies (`accessToken` 15m, auto-rotated `refreshToken` 7d).
- **Transactional Email Dispatch**:
  - **Brevo REST API (HTTPS)** for reliable cloud delivery (bypassing cloud SMTP blocks).
  - **Nodemailer (SMTP)** fallback for local development.
- **Password Recovery**: Self-service reset flow with intermediate OTP verification before setting a new password.
- **User Settings**: Profile editing, avatar upload/removal (Cloudinary), secure two-step email address change, password update, and account deletion.

### 3.2 Job Management
- **Full CRUD Operations**: Create, view, update, and delete job postings.
- **Status Toggling**: Real-time status toggling between `Open` and `Closed`.
- **Job Attributes**: Title, description, location, work mode (`On-Site`, `Remote`, `Hybrid`), employment type (`Full-Time`, `Part-Time`, `Contract`, `Internship`), experience requirement, salary range, required skills, and deadline.
- **Recruiter Isolation**: Recruiters strictly access and manage their own jobs and applicant pools.

### 3.3 Resume Upload & Deduplication
- **PDF Ingestion**: Single resume upload with text extraction via `pdf-parse` and secure storage on Cloudinary.
- **Duplicate Prevention**: Computes SHA-256 hash of extracted resume text (`fileHash`) to reject duplicate candidate submissions per job (409 Conflict).

### 3.4 AI-Powered Resume Screening & Scoring
- **LLM Inference**: Evaluates resume text against job criteria using Groq API (`openai/gpt-oss-20b` or configurable via `AI_MODEL`).
- **Structured Extraction**: Extracts candidate name, email, phone, skills, experience, and education.
- **Individual Candidate Scores (0-10)**:
  - Skills Score
  - Experience Score
  - Projects Score
  - Education Score
  - Resume Quality Score
  - Overall Score
- **Recommendations**: Categorizes candidates into `Strong Match`, `Good Match`, `Average Match`, or `Poor Match` with key strengths, weaknesses, and missing skills.

### 3.5 Recruiter Dashboard & Analytics
- **Live Pipeline Metrics**: Total active jobs, total candidates, average score, and match status breakdown.
- **Candidate Evaluation Cards**: Quick view of top candidates, score badges, and direct links to in-depth analysis.

---

## 4. Non-Functional Requirements
- **Security**: Passwords hashed with bcrypt; HTTP-only cookies; Helmet headers; CORS; route-specific rate limits; Express `trust proxy` enabled.
- **Cross-Browser Compatibility**: Same-origin reverse proxy (Vercel rewrites) to ensure cookies work seamlessly under Safari ITP and modern tracking protection.
- **Performance**: High-speed LLM inference via Groq; compound MongoDB indexes for fast filtering and deduplication.
- **Reliability**: Graceful third-party error handling (Cloudinary, Brevo, Groq).
- **Deployment**: Docker containerization with multi-container orchestration; deployed via Vercel (frontend) and Render (backend).

---

## 5. Success Metrics
- Reduction in manual resume screening time by over 70%.
- 100% duplicate candidate detection rate per job posting.
- Fast candidate analysis turnaround (< 3-5 seconds with Groq).
- Zero cookie drop / authentication failures across Safari, iOS, and Chromium browsers.
