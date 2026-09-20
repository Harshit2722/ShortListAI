# Low-Level Design (LLD) - Shortlist AI

## 1. Codebase Structure & Layered Pattern

The server follows a decoupled Controller-Service-Repository architecture:

```
server/src/
├── config/          # DB connection, Cloudinary setup, Mail transporter
├── constants/       # Cookie configurations and application constants
├── controllers/     # HTTP Request handling and response dispatching
├── services/        # Business logic, AI orchestration (Groq), Email (Brevo/SMTP)
├── repositories/    # Database queries, Mongoose operations, aggregations
├── models/          # Mongoose schemas and compound indexes
├── routes/          # Express route definitions with middleware bindings
├── middlewares/     # Auth (JWT), validation, rate-limiting, uploads, error handling
├── validators/      # Zod validation schemas for request bodies, queries, and params
└── utils/           # PDF parser, Cloudinary streamifier, scoring weights, ApiError/Response
```

---

## 2. Database Schema Design (Mongoose)

### 2.1 User Model (`User`)
- `name`: String, required, trim
- `email`: String, required, unique, trim, lowercase
- `password`: String, required, `select: false` (hashed via bcrypt)
- `refreshToken`: String, default: null, `select: false`
- `company`: String, required, trim
- `designation`: String, required, trim
- `avatar`: `{ url: String, publicId: String }`
- `isVerified`: Boolean, default: `false`
- `verification`:
  - `emailOTP`: String, `emailOTPExpiry`: Date
  - `emailChangeOTP`: String, `emailChangeOTPExpiry`: Date, `pendingEmail`: String
  - `forgotPasswordOTP`: String, `forgotPasswordOTPExpiry`: Date
- `createdAt`, `updatedAt`: Timestamps

### 2.2 Job Model (`Job`)
- `title`: String, required, max: 100 chars, trim
- `description`: String, required, min: 50 chars, trim
- `location`: String, required, trim
- `workMode`: Enum (`On-Site`, `Remote`, `Hybrid`), required
- `employmentType`: Enum (`Full-Time`, `Internship`, `Contract`, `Part-Time`), required
- `duration`: `{ value: Number, unit: Enum("days", "weeks", "months", "years") }`
- `applicationDeadline`: Date, required
- `salary`: `{ min: Number, max: Number, currency: String (default: "INR") }`
- `requiredSkills`: `[String]`, required (at least 1)
- `experience`: Number, min: 0, max: 50 years, required
- `status`: Enum (`Open`, `Closed`), default: `Open`, indexed
- `createdBy`: ObjectId (ref: `User`), required, indexed
- `createdAt`, `updatedAt`: Timestamps
- Indexes: `{ createdBy: 1, status: 1, createdAt: -1 }`, `{ createdBy: 1, createdAt: -1 }`

### 2.3 Resume Submission Model (`ResumeSubmission`)
- `job`: ObjectId (ref: `Job`), required, indexed
- `candidate`:
  - `name`: String, trim
  - `email`: String, trim, lowercase
  - `phone`: String, trim
  - `skills`: `[String]`
  - `education`: `[String]`
  - `experience`: `[String]`
- `resume`: `{ publicId: String, url: String }`, required
- `resumeText`: String, required
- `fileHash`: String, required (SHA-256 of extracted text for duplicate prevention)
- `status`: Enum (`Pending`, `Processing`, `Completed`, `Failed`), default: `Pending`
- `analysis`:
  - `overallScore`: Number (0-10, 1 decimal place)
  - `skillsScore`: Number (0-10)
  - `projectsScore`: Number (0-10)
  - `experienceScore`: Number (0-10)
  - `resumeScore`: Number (0-10)
  - `educationScore`: Number (0-10)
  - `recommendation`: Enum (`Strong Match`, `Good Match`, `Average Match`, `Poor Match`)
  - `summary`: String
  - `strengths`: `[String]`
  - `weaknesses`: `[String]`
  - `missingSkills`: `[String]`
- `createdAt`, `updatedAt`: Timestamps
- Compound Index: `{ job: 1, fileHash: 1 }` (unique constraint prevents duplicate resumes per job)

---

## 3. Core API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Root backend health check |
| `POST` | `/api/v1/auth/register` | Public | Register new recruiter & send verification OTP |
| `POST` | `/api/v1/auth/verify-email` | Public | Verify registration OTP & issue HTTP-only cookies |
| `POST` | `/api/v1/auth/resend-otp` | Public | Resend verification OTP code |
| `POST` | `/api/v1/auth/login` | Public | Login with email/password and set JWT cookies |
| `POST` | `/api/v1/auth/logout` | Authenticated | Clear access and refresh cookies |
| `POST` | `/api/v1/auth/forgot-password` | Public | Send password reset OTP |
| `POST` | `/api/v1/auth/verify-reset-otp` | Public | Verify OTP code prior to resetting password |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password with verified OTP |
| `POST` | `/api/v1/auth/refresh` | Public | Refresh expired access token using refresh cookie |
| `GET` | `/api/v1/dashboard` | Authenticated | Recruiter overview stats, metrics, & recommendations |
| `GET` | `/api/v1/users/me` | Authenticated | Get current authenticated recruiter profile |
| `PATCH`| `/api/v1/users/profile` | Authenticated | Update recruiter name, company, designation |
| `PATCH`| `/api/v1/users/request-email-change` | Authenticated | Request email update (sends OTP to new email) |
| `PATCH`| `/api/v1/users/verify-email-change` | Authenticated | Verify OTP and commit new email |
| `PATCH`| `/api/v1/users/password` | Authenticated | Update user password |
| `POST` | `/api/v1/users/avatar` | Authenticated | Upload/replace user avatar image (Cloudinary) |
| `DELETE`| `/api/v1/users/avatar` | Authenticated | Delete user avatar from Cloudinary and DB |
| `DELETE`| `/api/v1/users/` | Authenticated | Permanently delete recruiter account and data |
| `POST` | `/api/v1/jobs` | Authenticated | Create a new job listing |
| `GET` | `/api/v1/jobs` | Authenticated | List recruiter jobs with filtering & pagination |
| `GET` | `/api/v1/jobs/:jobId` | Authenticated | Get detailed job posting by ID |
| `PATCH`| `/api/v1/jobs/:jobId` | Authenticated | Update job posting details |
| `PATCH`| `/api/v1/jobs/:jobId/status` | Authenticated | Toggle job status (`Open` / `Closed`) |
| `DELETE`| `/api/v1/jobs/:jobId` | Authenticated | Delete job posting |
| `POST` | `/api/v1/jobs/:jobId/resumes` | Authenticated | Upload resume PDF, check duplicate, upload to Cloudinary |
| `GET` | `/api/v1/jobs/:jobId/resumes` | Authenticated | List all candidate submissions for a job |
| `GET` | `/api/v1/jobs/:jobId/resumes/:resumeId` | Authenticated | Get candidate resume analysis details |
| `DELETE`| `/api/v1/jobs/:jobId/resumes/:resumeId` | Authenticated | Delete resume submission and Cloudinary file |
| `POST` | `/api/v1/jobs/:jobId/resumes/:resumeId/analyze` | Authenticated | Trigger or re-run AI evaluation via Groq LLM |

---

## 4. Scoring Algorithm & Logic

### 4.1 Seniority-Based Weighting
Candidate subscores (0-10) are weighted dynamically based on the seniority level determined by job title and experience:

```javascript
OverallScore = (
  skillsScore * weights.skills +
  experienceScore * weights.experience +
  projectsScore * weights.projects +
  educationScore * weights.education +
  resumeScore * weights.resume
).toFixed(1);
```

| Seniority | Skills | Experience | Projects | Education | Resume Quality |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Intern** | 45% | 10% | 30% | 10% | 5% |
| **Junior** | 40% | 20% | 25% | 10% | 5% |
| **Mid-Level** | 35% | 35% | 15% | 10% | 5% |
| **Senior** | 30% | 45% | 10% | 10% | 5% |
| **Staff / Principal** | 25% | 50-55% | 10% | 10% | 5% |

### 4.2 Recommendation Mapping
- `Overall Score >= 9.0` → **Strong Match**
- `7.0 <= Overall Score < 9.0` → **Good Match**
- `5.0 <= Overall Score < 7.0` → **Average Match**
- `Overall Score < 5.0` → **Poor Match**

---

## 5. Error Handling & Standard Responses

All API responses follow standardized wrapper schemas:

```json
// Success (ApiResponse)
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful",
  "success": true
}

// Error (ApiError)
{
  "statusCode": 409,
  "message": "Duplicate resume detected for this job posting",
  "errors": [],
  "success": false
}
```
