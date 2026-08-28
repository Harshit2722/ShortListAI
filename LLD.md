# Low-Level Design (LLD) - Shortlist AI

## 1. Codebase Structure & Layered Pattern

The server follows a decoupled Controller-Service-Repository architecture:

```
server/src/
├── controllers/     # HTTP Request handling, response status formatting
├── services/        # Core business logic, external API orchestration (Groq, Cloudinary, Email)
├── repositories/    # Direct database queries, Mongoose operations, aggregations
├── models/          # Mongoose schemas and indexes
├── routes/          # Express route definitions with middleware bindings
├── middlewares/     # Auth verification (JWT), validation, rate-limiting, error handling
├── validators/      # Zod validation schemas for request bodies/queries/params
└── utils/           # Helper utilities (PDF parser, SHA-256 hasher, scoring weights, API response)
```

---

## 2. Database Schema Design (Mongoose)

### 2.1 User Model (`User`)
- `name`: String, required
- `email`: String, required, unique, indexed
- `password`: String, required (hashed via bcrypt)
- `avatar`: String (Cloudinary URL)
- `isEmailVerified`: Boolean, default: `false`
- `otp`: `{ code: String, expiresAt: Date }`
- `resetPasswordOtp`: `{ code: String, expiresAt: Date }`
- `pendingEmail`: `{ newEmail: String, otp: String, expiresAt: Date }`
- `createdAt`, `updatedAt`: Timestamps

### 2.2 Job Model (`Job`)
- `title`: String, required, indexed
- `description`: String, required
- `department`: String
- `location`: String
- `employmentType`: Enum (`Full-time`, `Part-time`, `Contract`, `Internship`)
- `experienceLevel`: Enum (`Entry`, `Mid`, `Senior`, `Lead`, `Executive`)
- `requiredSkills`: `[String]`, indexed
- `status`: Enum (`Open`, `Closed`), default: `Open`, indexed
- `createdBy`: ObjectId (ref: `User`), required, indexed
- `createdAt`, `updatedAt`: Timestamps

### 2.3 Resume Submission Model (`ResumeSubmission`)
- `job`: ObjectId (ref: `Job`), required, indexed
- `recruiter`: ObjectId (ref: `User`), required, indexed
- `resumeUrl`: String, required (Cloudinary URL)
- `resumePublicId`: String
- `rawText`: String
- `contentHash`: String, indexed (SHA-256 of extracted text for duplicate prevention)
- `status`: Enum (`Pending`, `Processing`, `Completed`, `Failed`), indexed
- `candidate`:
  - `name`: String
  - `email`: String
  - `phone`: String
  - `skills`: `[String]`
  - `experienceYears`: Number
  - `education`: `[String]`
- `analysis`:
  - `overallScore`: Number (1-10), indexed
  - `recommendation`: Enum (`Strong Fit`, `Moderate Fit`, `Weak Fit`)
  - `technicalScore`: Number
  - `experienceScore`: Number
  - `educationScore`: Number
  - `strengths`: `[String]`
  - `gaps`: `[String]`
  - `summary`: String
- `createdAt`, `updatedAt`: Timestamps

---

## 3. Core API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new user & send OTP |
| `POST` | `/api/v1/auth/verify-otp` | Public | Verify email OTP & generate JWT cookie |
| `POST` | `/api/v1/auth/login` | Public | Login with email/password |
| `POST` | `/api/v1/auth/logout` | Authenticated | Clear auth cookie |
| `POST` | `/api/v1/auth/forgot-password` | Public | Send password reset OTP |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password with OTP |
| `GET` | `/api/v1/users/me` | Authenticated | Get current user profile |
| `PATCH`| `/api/v1/users/profile` | Authenticated | Update user name and avatar |
| `GET` | `/api/v1/jobs` | Authenticated | List jobs created by recruiter (with pagination & filters) |
| `POST` | `/api/v1/jobs` | Authenticated | Create a new job listing |
| `GET` | `/api/v1/jobs/:id` | Authenticated | Get job details |
| `PATCH`| `/api/v1/jobs/:id` | Authenticated | Update job status / criteria |
| `POST` | `/api/v1/resumes/upload/:jobId`| Authenticated | Upload resume PDF & trigger analysis |
| `GET` | `/api/v1/resumes/job/:jobId` | Authenticated | List candidate submissions for a job |
| `GET` | `/api/v1/resumes/:id` | Authenticated | Get detailed AI candidate evaluation |
| `GET` | `/api/v1/dashboard` | Authenticated | Recruiter stats, recent jobs & top candidates |

---

## 4. Scoring Algorithm & Logic

Candidates are evaluated by comparing extracted candidate attributes against target job requirements:

```javascript
// Dynamic Score Weighting Formula
Overall Score = (TechnicalSkillsScore * 0.45) + 
                (ExperienceScore * 0.35) + 
                (EducationScore * 0.20)
```

- **Recommendation Mapping**:
  - `Overall Score >= 7.5` → **Strong Fit**
  - `5.0 <= Overall Score < 7.5` → **Moderate Fit**
  - `Overall Score < 5.0` → **Weak Fit**

---

## 5. Error Handling & Standard Responses

All API responses follow a consistent format:

```json
// Success
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful",
  "success": true
}

// Error
{
  "statusCode": 400,
  "message": "Duplicate resume detected for this job posting",
  "errors": [],
  "success": false
}
```
