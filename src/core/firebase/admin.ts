import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let cachedApp: App | undefined;

function normalizePrivateKey(value: string | undefined): string {
  let key = value?.trim() ?? "";
  if (!key) return "";

  // Vercel environment variables are commonly entered with escaped newlines,
  // while local .env files may contain actual newlines or surrounding quotes.
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, "\n").replace(/\r\n?/g, "\n");

  // Also accept a base64-encoded PEM value when deployed as one line.
  if (!key.includes("-----BEGIN") && /^[A-Za-z0-9+/=]+$/.test(key)) {
    const decoded = Buffer.from(key, "base64").toString("utf8");
    if (decoded.includes("-----BEGIN")) key = decoded;
  }

  return key.trim();
}

function getAdminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyCandidates = [
    process.env.FIREBASE_PRIVATE_KEY,
    process.env.FIREBASE_PRIVATE_KEY_BASE64,
  ].map(normalizePrivateKey);
  const privateKey = privateKeyCandidates.find((key) => key.includes("-----BEGIN PRIVATE KEY-----")) ?? "";

  if (!projectId || !clientEmail) {
    throw new Error("Firebase Admin credentials are missing. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in the server environment.");
  }

  if (!privateKey || !privateKey.includes("-----END PRIVATE KEY-----")) {
    throw new Error("FIREBASE_PRIVATE_KEY must contain a valid PEM private key. In Vercel, preserve the full key and encode line breaks as \\n.");
  }

  cachedApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  return cachedApp;
}

// Keep Admin SDK initialization lazy so merely importing an API route during
// Next.js build does not parse service-account keys or initialize OpenSSL.
export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
