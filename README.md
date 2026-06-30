# Shortlist AI

Shortlist AI is an AI-powered recruitment platform designed to streamline the hiring process for recruiters and candidates. The platform enables recruiters to manage job postings, receive applications, analyze resumes using AI, and automate candidate shortlisting while providing candidates with a seamless application experience.

---

## Features

### Authentication & Authorization

- User Registration
- User Login
- JWT Authentication
- Refresh Token Authentication
- Role-Based Access Control (Recruiter & Candidate)
- Protected Routes
- Secure HTTP-only Cookies
- Password Hashing

### Security

- Rate Limiting
- Input Validation using Zod
- Mongoose Schema Validation
- Ownership Verification
- Centralized Error Handling

### Job Management

- Create Job
- Update Job
- Delete Job
- Get Job by ID
- Get All Jobs of a Recruiter
- Business Rule Validation
- Recruiter-only Access

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

### Other

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

---


## Design Principles

- Layered Architecture
- Repository Pattern
- Service Layer Pattern
- Separation of Concerns
- RESTful API Design
- Clean Code Practices


