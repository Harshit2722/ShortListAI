# Shortlist AI 
> AI-powered Recruitment Assistant backend built with Node.js, Express.js, MongoDB, and Groq LLM.


Shortlist AI is an AI-powered recruitment assistant that helps recruiters organize, analyze, and shortlist candidates more efficiently. Recruiters can create job postings, upload and manage resumes, and leverage AI to automate resume analysis.

---

## Key Features

- JWT-based authentication with secure HTTP-only cookies
- Complete job and resume management APIs
- AI-powered resume analysis using Groq LLM
- Automatic candidate information extraction
- Dynamic candidate scoring based on job seniority
- Backend-generated hiring recommendations
- SHA-256 duplicate resume detection
- PDF parsing and Cloudinary integration
- Strict AI response validation using Zod
- Layered architecture with Repository and Service patterns

---

## AI Resume Analysis Workflow

```
Resume Upload
      │
      ▼
Extract PDF Text
      │
      ▼
Generate SHA-256 Hash
      │
      ▼
Store Resume
      │
      ▼
LLM Analysis (Groq)
      │
      ▼
Validate AI Response
      │
      ▼
Calculate Dynamic Score
      │
      ▼
Generate Recommendation
      │
      ▼
Store Structured Analysis

```
---

## Tech Stack

| Category | Technologies |
|-----------|--------------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Groq API, Llama 3.3 70B Versatile |
| Authentication | JWT, bcryptjs |
| Validation | Zod |
| Storage | Cloudinary |
| File Upload | Multer |
| Security | Helmet, CORS, HTTP-only Cookies, Rate Limiting |

---

## Architecture

The project follows a layered architecture to keep responsibilities separated.

```
                Client
                   │
                   ▼
                Routes
                   │
                   ▼
             Controllers
                   │
                   ▼
               Services
         ┌─────────┴─────────┐
         ▼                   ▼
Repositories          AI Services
         │                   │
         ▼                   ▼
     MongoDB             Groq API
```


---

## Project Structure

```
src
├── config
├── controllers
├── middlewares
├── models
├── repositories
├── routes
├── services
│   └── ai
├── utils
├── validators
├── app.js
└── server.js
```

---

## Prerequisites

- Node.js 20+
- MongoDB Atlas or Local MongoDB
- Cloudinary Account
- Groq account

---

## Installation

### 1. Clone the Repository


```bash
git clone https://github.com/Harshit2722/ShortlistAI.git
```

### 2. Navigate to the Project Directory

```bash
cd ShortlistAI
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server` directory and add the following variables:

```env
PORT=

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLIENT_URL=

NODE_ENV=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

GROQ_API_KEY=

AI_MODEL=
```

### 5. Start the Development Server

```bash
npm run dev
```
---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/auth/register` |
| POST | `/api/v1/auth/login` |
| POST | `/api/v1/auth/logout` |
| POST | `/api/v1/auth/refresh-token` |
| GET | `/api/v1/auth/me` |

### Jobs

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/jobs` |
| GET | `/api/v1/jobs` |
| GET | `/api/v1/jobs/:jobId` |
| PATCH | `/api/v1/jobs/:jobId` |
| DELETE | `/api/v1/jobs/:jobId` |

### Resumes

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/jobs/:jobId/resumes` |
| GET | `/api/v1/jobs/:jobId/resumes` |
| GET | `/api/v1/jobs/:jobId/resumes/:resumeId` |
| DELETE | `/api/v1/jobs/:jobId/resumes/:resumeId` |
| POST | `/api/v1/jobs/:jobId/resumes/:resumeId/analyze` |




