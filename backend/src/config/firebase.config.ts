import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin SDK
let credential;

// Prefer environment variables (safer for deployments)
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  credential = admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  });
} else {
  // Fallback to local JSON file for dev only if present
  const serviceAccountPath = path.join(__dirname, '../../..', 'notes-9fa9c-firebase-adminsdk-fbsvc-d293efc621.json');

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('Firebase credentials not found. Set env vars or add service account JSON locally.');
  }

  const serviceAccount = require(serviceAccountPath);
  credential = admin.credential.cert(serviceAccount);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential,
  });
}

export const firebaseAdmin = admin;
export const firebaseDb = admin.firestore();
export const firebaseAuth = admin.auth();
