import { App, applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

function getFirebaseConfig(): { projectId?: string; storageBucket?: string } {
  let firebaseConfig: { projectId?: string; storageBucket?: string } = {};
  try {
    if (process.env.FIREBASE_CONFIG?.startsWith("{")) {
      firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    }
  } catch {
    // Fall back to the explicit project settings below.
  }
  return firebaseConfig;
}

export function getAdminProjectId(): string | undefined {
  const firebaseConfig = getFirebaseConfig();
  // Auth ID tokens are minted by the client Firebase project. Keep Admin Auth
  // pointed at that same project when a stale FIREBASE_PROJECT_ID secret exists.
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    || process.env.FIREBASE_PROJECT_ID
    || process.env.GOOGLE_CLOUD_PROJECT
    || process.env.GCLOUD_PROJECT
    || firebaseConfig.projectId;
}

function getAdminApp(): App {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const firebaseConfig = getFirebaseConfig();
  const projectId = getAdminProjectId();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyCandidates = [
    process.env.FIREBASE_PRIVATE_KEY,
    process.env.FIREBASE_PRIVATE_KEY_BASE64,
  ].map(normalizePrivateKey);
  const privateKey = privateKeyCandidates.find((key) => key.includes("-----BEGIN PRIVATE KEY-----")) ?? "";

  const hasServiceAccount = Boolean(
    projectId
      && clientEmail
      && privateKey.includes("-----BEGIN PRIVATE KEY-----")
      && privateKey.includes("-----END PRIVATE KEY-----")
  );
  const runningOnGoogleCloud = Boolean(process.env.K_SERVICE || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT);
  cachedApp = initializeApp({
    // App Hosting and Cloud Run provide ADC through the attached runtime
    // service account. Prefer ADC there; use an explicit service account only
    // for local or other non-Google hosting environments.
    credential: hasServiceAccount && !runningOnGoogleCloud
      ? cert({ projectId, clientEmail, privateKey })
      : applicationDefault(),
    ...(projectId ? { projectId } : {}),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  });
  return cachedApp;
}

// Keep Admin SDK initialization lazy so merely importing an API route during
// Next.js build does not parse service-account keys or initialize OpenSSL.
export async function getAdminAuth() {
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export async function getAdminMessaging() {
  const { getMessaging } = await import("firebase-admin/messaging");
  return getMessaging(getAdminApp());
}

export async function getAdminStorage() {
  const { getStorage } = await import("firebase-admin/storage");
  return getStorage(getAdminApp());
}
