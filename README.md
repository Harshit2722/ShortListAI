# Shortlist AI

Shortlist AI is an AI-powered recruitment assistant that helps recruiters organize, analyze, and shortlist candidates more efficiently. Recruiters can create job postings, upload and manage resumes, and leverage AI to automate resume analysis and candidate ranking.

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Refresh Token Authentication
- Protected Routes
- Secure HTTP-only Cookies
- Password Hashing

### Security

- JWT Authentication
- Request Rate Limiting
- Input Validation using Zod
- Mongoose Schema Validation
- Recruiter Ownership Verification
- SHA-256 Duplicate Detection
- Secure File Uploads
- Centralized Error Handling

### Job Management

- Create Job
- Update Job
- Delete Job
- Get Job by ID
- Get All Jobs of a Recruiter
- Business Rule Validation

### Resume Management

- Upload resumes for specific jobs
- Retrieve resumes by job
- Retrieve resume by ID
- Delete resumes
- Secure resume storage using Cloudinary
- SHA-256 file hashing for duplicate detection
- Resume-to-job association

---


## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcryptjs

### Validation

- Zod

### File Storage

- Cloudinary

### File Upload

- Multer

### Security

- Helmet
- Cookie Parser
- CORS
- Express Rate Limit

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
   │
   ▼
Repositories
   │
   ▼
MongoDB
```

### Layer Responsibilities

| Layer | Responsibility |
|--------|---------------|
| Routes | Endpoint definitions and middleware |
| Controllers | Handle HTTP requests and responses |
| Services | Business logic |
| Repositories | Database operations |
| Models | Database schema definitions |
| Validators | Request validation |

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

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root and add the following variables:

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

### Resume Management

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/jobs/:jobId/resumes` |
| GET | `/api/v1/jobs/:jobId/resumes` |
| GET | `/api/v1/jobs/:jobId/resumes/:resumeId` |
| DELETE | `/api/v1/jobs/:jobId/resumes/:resumeId` |

---


## Design Principles

- Layered Architecture
- Repository Pattern
- Service Layer Pattern
- Separation of Concerns
- RESTful API Design
- Clean Code Practices
- Modular Backend Architecture


