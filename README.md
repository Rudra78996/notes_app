# Note Taking App

## Overview
This is a full-stack Notion-inspired note-taking application. It features a modern, responsive frontend built with React, Vite, shadcn/ui, MagicUI, and Firebase authentication. The backend is powered by Node.js, NestJS, and Firebase Admin SDK, providing secure note storage and user management.

## Features
- Rich text editing (TipTap-based)
- User authentication (Firebase Auth)
- Create, edit, and delete notes
- Export/download notes
- Responsive UI with dark mode
- Error handling with shadcn Alert/Dialog
- Secure backend with environment-based credentials

## Project Structure
```
note_taking_app/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md (this file)
```

## Backend Setup
1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Firebase Admin SDK credentials:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_PRIVATE_KEY` (unquoted, multiline with `\n` for newlines)
     - `FIREBASE_CLIENT_EMAIL`
   - Example:
     ```env
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
     FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
     ```
3. **Build and start the server:**
   ```bash
   npm run build
   npm run start:prod
   ```
   - The server runs on `http://localhost:3001` by default.

## Frontend Setup
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
   - The app runs on `http://localhost:5173` by default.

## Deployment (Render)
- The backend `build` script installs the NestJS CLI if missing, so Render can build the app without pre-installed global dependencies.
- Ensure your environment variables are set in Render's dashboard for secure deployment.

## Notes
- The backend only loads credentials from environment variables for security.
- If you encounter credential errors, check for extra quotes or formatting issues in your `.env` file.
- CORS is enabled for any origin by default for development; restrict this in production as needed.

## License
This project is for educational/demo purposes.
