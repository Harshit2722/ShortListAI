# Shortlist AI

> AI-powered Recruitment Assistant built with React, Node.js, MongoDB, Cloudinary, and Groq LLM.

Shortlist AI is an AI-powered recruitment assistant that helps recruiters organize, analyze, and shortlist candidates more efficiently. Recruiters can manage job postings, upload resumes, and leverage AI to automate resume analysis.

---

## Key Features

- Secure JWT authentication using HTTP-only cookies
- Complete user management (profile, email, password, avatar, account deletion)
- Job posting and management APIs
- Resume upload and management with duplicate detection (SHA-256)
- AI-powered resume analysis using Groq LLM
- Automatic candidate information extraction and structured AI insights
- Dynamic candidate scoring and hiring recommendations
- Cloudinary integration for avatar and resume storage with automatic cleanup
- Request validation using Zod and endpoint-specific rate limiting
- Layered architecture using Controller → Service → Repository pattern
- Containerized deployment support with Docker Compose and Nginx

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

| Category       | Technologies                                        |
| -------------- | --------------------------------------------------- |
| Frontend       | React, Vite, React Router, Tailwind CSS, Axios      |
| Backend        | Node.js, Express.js                                 |
| Database       | MongoDB Atlas, Mongoose                             |
| AI             | Groq API, Llama 3.3 70B Versatile                   |
| Authentication | JWT, bcryptjs                                       |
| Validation     | Zod                                                 |
| Storage        | Cloudinary                                          |
| File Upload    | Multer                                              |
| DevOps         | Docker, Docker Compose, Nginx                       |
| Security       | Helmet, CORS, HTTP-only Cookies, Express Rate Limit |
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
ShortlistAI/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios configuration and API endpoints
│   │   ├── components/      # Common components and UI utilities
│   │   ├── context/         # AuthContext for global session state
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Page layout structures
│   │   ├── pages/           # Home, Auth (Login/Register), and Dashboard pages
│   │   └── routes/          # Public and Protected route guards
│   └── Dockerfile
├── server/                  # Node.js Express Backend
│   ├── src/
│   │   ├── config/          # Database connection & Cloudinary setup
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Authentication, upload, rate limit, validation
│   │   ├── models/          # MongoDB Mongoose schemas
│   │   ├── repositories/    # Database data-access layer
│   │   ├── routes/          # Router paths (auth, users, jobs)
│   │   ├── services/        # AI Service (Groq) and other services(user,auth,job,resume) 
│   │   └── utils/           # Custom errors and utilities
│   └── Dockerfile
└── docker-compose.yml       # Docker orchestrator
```

---

## Prerequisites

Ensure you have the following things with you:
- **Node.js** (v20 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster connection URI)
- **Cloudinary Account** (For secure avatar and resume PDF storage)
- **Groq Console Account** (For LLM processing)
- **Docker Desktop** (Required only for containerized setup)

---

## Setup & Installation

### Option 1: Local Development Setup

#### 1. Clone and Enter Project Directory
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
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_access_token_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_token_secret
   CLIENT_URL=http://localhost:5173
   JWT_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   NODE_ENV=development

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_RESUME_FOLDER=shortlist-ai/resumes
   CLOUDINARY_AVATAR_FOLDER=shortlist-ai/avatars

   GROQ_API_KEY=your_groq_api_key
   AI_MODEL=llama-3.3-70b-versatile
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```

#### 3. Configure and Run Frontend
1. Open a new terminal tab, navigate to the `client` directory, and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
3. Start the frontend Vite dev server:
   ```bash
   npm run dev
   ```

---

### Option 2: Docker Setup (with Docker Desktop)

#### 1. Ensure Docker Desktop is Running
Make sure **Docker Desktop** is open and running on your local machine.

#### 2. Clone and Enter Project Directory
```bash
git clone https://github.com/Harshit2722/ShortlistAI.git
cd ShortlistAI
```

#### 3. Configure Environment Variables
In the root directory of the project, configure your environment files (`server/.env` and `client/.env`) as detailed in the local setup instructions above.

#### 4. Build and Spin Up the Containers
Run the following command from the root `ShortlistAI` directory:
```bash
docker compose up --build
```

#### 5. Access the Application
Once the build is complete and the containers are running, you can access the application:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)

---

## API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new recruiter account |
| `POST` | `/login` | Public | Log in with credentials |
| `POST` | `/logout` | Private | Clear cookies and log out user |
| `POST` | `/refresh` | Public | Refresh expired access tokens |

### User Management (`/api/v1/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Private | Retrieve logged-in recruiter info |
| `PATCH` | `/profile` | Private | Update user profile metadata |
| `PATCH` | `/email` | Private | Update registered email |
| `PATCH` | `/password` | Private | Update password |
| `POST` | `/avatar` | Private | Upload/Update user avatar (Cloudinary) |
| `DELETE` | `/avatar` | Private | Delete user avatar |
| `DELETE` | `/` | Private | Permanently delete account |

### Job Management (`/api/v1/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Private | Create a job posting |
| `GET` | `/` | Private | Retrieve all job postings |
| `GET` | `/:jobId` | Private | Retrieve job details by ID |
| `PATCH` | `/:jobId` | Private | Update job post details |
| `DELETE` | `/:jobId` | Private | Delete job post |

### Resume Operations (`/api/v1/jobs/:jobId/resumes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Private | Upload a resume PDF (Cloudinary & local hashing) |
| `GET` | `/` | Private | Retrieve all resumes associated with a job |
| `GET` | `/:resumeId` | Private | Retrieve details of a specific resume |
| `DELETE` | `/:resumeId` | Private | Delete a resume |
| `POST` | `/:resumeId/analyze` | Private | Trigger AI analysis of resume against job requirements |
