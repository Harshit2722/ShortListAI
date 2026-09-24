# Contributing to Shortlist AI

Thank you for your interest in contributing to **Shortlist AI**! We welcome bug reports, feature requests, documentation improvements, and code contributions.

Please review this guide to get started with contributing.

---

## 📝 How to Contribute

### 1. Fork the repository
Click the **Fork** button at the top right of the GitHub page to create your own copy of the repository.

### 2. Clone your fork
Clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/ShortListAI.git
cd ShortListAI
```

Add upstream remote to keep your fork updated:

```bash
git remote add upstream https://github.com/Harshit2722/ShortListAI.git
```

### 3. Create a new branch
Branch naming conventions help keep changes organized. Branch out from `main`:

```bash
git checkout -b feature/my-feature
# or for bug fixes:
git checkout -b fix/issue-description
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas connection URI)
- Free accounts/API keys for:
  - **Groq API** (for LLM resume parsing)
  - **Cloudinary** (for file uploads)
  - **Brevo API** or SMTP credentials (for transactional emails)

### 1. Backend Setup (`server/`)
```bash
cd server
npm install
cp .env.example .env
# Fill in your environment variables in .env
npm run dev
```

### 2. Frontend Setup (`client/`)
```bash
cd ../client
npm install
cp .env.example .env
# Fill in client environment variables (e.g., VITE_API_URL)
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend server on `http://localhost:5000`.

---

## 🛠️ Contribution Guidelines

### 1. Code Standards & Style
- Write clean, maintainable, and readable code.
- Follow the existing project structure and conventions:
  - Express controller-service-repository patterns on the server.
  - Component-based structure with Tailwind CSS / CSS modular styling on the client.
  - Validate payloads using Zod schemas.
- Ensure no sensitive tokens, API keys, or `.env` files are committed.

### 2. Commit Message Guidelines
We follow standard conventional commit conventions:

- `feat: add duplicate resume SHA-256 validation`
- `fix: resolve auth cookie expiry on Safari browsers`
- `docs: update setup instructions in README`
- `style: format UI cards in candidate list`
- `refactor: clean up dashboard metric calculation`

### 3. Submitting a Pull Request (PR)
1. Commit your changes with a clear message:
   ```bash
   git add .
   git commit -m "feat: description of the change"
   ```
2. Push your changes to your fork:
   ```bash
   git push origin feature/my-feature
   ```
3. Go to the original repository on GitHub (`https://github.com/Harshit2722/ShortListAI`).
4. Click **Compare & pull request**.
5. Provide a clear description of:
   - What problem does this PR solve?
   - How did you test your changes?
   - Any screenshots or recordings (for UI changes).
6. Submit the pull request and wait for a review!

---

## 📜 Code of Conduct

By participating in this project, you agree to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [harshitpushkarnais@gmail.com](mailto:harshitpushkarnais@gmail.com).
