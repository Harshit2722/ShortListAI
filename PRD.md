# Product Requirements Document (PRD) - Shortlist AI

## 1. Overview
**Shortlist AI** is an AI-powered recruitment assistant platform designed to streamline and automate candidate screening for recruiters. It enables recruiters to create job postings, upload candidate resumes in bulk/singularly, and automatically extract, score, and rank candidates using Groq LLM against specific job descriptions.

---

## 2. Target Audience & Personas
- **Recruiters & Hiring Managers**: Need a fast, objective, and organized way to screen high volumes of applicant resumes and identify top fits without manual reading of every document.
- **Candidates (Indirect)**: Applicants whose resumes are parsed and evaluated fairly against concrete job criteria.

---

## 3. Core Features & Requirements

### 3.1 Authentication & User Management
- **Registration & Login**: Secure credential-based signup/login with JWT stored in HTTP-only cookies.
- **Email Verification**: OTP-based email verification via Nodemailer upon signup and password resets.
- **Account Settings**: Profile updates, avatar upload (Cloudinary), password change, and secure two-step email change.

### 3.2 Job Management
- **CRUD Operations**: Create, view, update, and close job postings.
- **Job Criteria**: Specify job title, description, department, location, employment type, required skills, and experience level.
- **Recruiter Isolation**: Recruiters only access and manage jobs they created.

### 3.3 Resume Upload & Duplicate Prevention
- **PDF Upload**: Upload candidate resumes in PDF format with automatic Cloudinary storage.
- **Text Extraction**: Parse raw text content directly from uploaded PDF files.
- **Deduplication**: Compute SHA-256 hash of extracted resume text to detect and prevent duplicate candidate submissions per job.

### 3.4 AI-Powered Resume Screening & Scoring
- **LLM Evaluation**: Send parsed resume content and job description to Groq LLM (e.g. LLaMA models) with structured prompt schemas.
- **Structured Extraction**: Extract candidate name, email, phone, skills, total experience, work history, and education.
- **Dynamic Scoring (1-10)**: Weighted evaluation across:
  - Technical Skills Match
  - Experience Relevance
  - Education & Certifications
- **Recommendations**: Generate recommendation tags (`Strong Fit`, `Moderate Fit`, `Weak Fit`) along with strengths, gaps, and an AI summary.

### 3.5 Recruiter Dashboard & Analytics
- **Overview Metrics**: Active jobs, total resumes screened, shortlisted candidates count, and total positions.
- **Recent Jobs**: List of latest job openings with real-time applicant counters.
- **Top Candidates**: Ranked leaderboard of highest-scoring evaluated candidates across active roles.

---

## 4. Non-Functional Requirements
- **Security**: Passwords hashed with bcrypt; JWT in secure HTTP-only cookies; CORS, Helmet, and rate limiting enabled.
- **Performance**: Asynchronous AI analysis; fast MongoDB queries backed by compound indexes.
- **Scalability**: Stateless backend API easily containerized via Docker and orchestrated with Docker Compose.
- **Reliability**: Graceful fallback and structured error responses for third-party API outages (Cloudinary, Groq).

---

## 5. Success Metrics
- Reduction in manual resume screening time by over 70%.
- Accurate duplicate detection rate (>99%).
- Sub-second API response times for dashboard overview and candidate filtering.
