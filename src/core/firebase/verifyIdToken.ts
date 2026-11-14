import { createPublicKey, verify as verifySignature, type KeyObject } from "node:crypto";
import { getAdminProjectId } from "./admin";

const FIREBASE_CERTIFICATES_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
const CERTIFICATE_CACHE_FALLBACK_MS = 5 * 60 * 1000;
const CLOCK_SKEW_SECONDS = 5 * 60;

interface FirebaseTokenClaims {
  aud?: unknown;
  auth_time?: unknown;
  exp?: unknown;
  iat?: unknown;
  iss?: unknown;
  nbf?: unknown;
  sub?: unknown;
  [claim: string]: unknown;
}

interface FirebaseTokenHeader {
  alg?: unknown;
  kid?: unknown;
}

interface CertificateCache {
  certificates: Record<string, string>;
  expiresAt: number;
}

export interface VerifiedFirebaseIdentity {
  uid: string;
  claims: FirebaseTokenClaims;
}

export class InvalidFirebaseIdTokenError extends Error {
  readonly code = "auth/invalid-id-token";
}

export class FirebaseTokenVerifierUnavailableError extends Error {
  readonly code = "firebase-token-verifier-unavailable";
}

let certificateCache: CertificateCache | undefined;
let certificateFetch: Promise<CertificateCache> | undefined;
const publicKeyCache = new Map<string, KeyObject>();

function invalidToken(): never {
  throw new InvalidFirebaseIdTokenError("Firebase ID token is invalid.");
}

function decodeJsonSegment<T>(segment: string): T {
  try {
    return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as T;
  } catch {
    return invalidToken();
  }
}

async function fetchCertificates(): Promise<CertificateCache> {
  if (certificateFetch) return certificateFetch;
  certificateFetch = (async () => {
    let response: Response;
    try {
      response = await fetch(FIREBASE_CERTIFICATES_URL, { cache: "no-store" });
    } catch (error) {
      throw new FirebaseTokenVerifierUnavailableError(
        `Could not reach Google's Firebase signing certificates: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    if (!response.ok) {
      throw new FirebaseTokenVerifierUnavailableError(`Google certificate endpoint returned HTTP ${response.status}.`);
    }

    let certificates: Record<string, string>;
    try {
      certificates = await response.json() as Record<string, string>;
    } catch {
      throw new FirebaseTokenVerifierUnavailableError("Google certificate endpoint returned invalid JSON.");
    }
    if (!certificates || typeof certificates !== "object" || !Object.keys(certificates).length) {
      throw new FirebaseTokenVerifierUnavailableError("Google certificate endpoint returned no signing certificates.");
    }

    const maxAge = response.headers.get("cache-control")?.match(/(?:^|,)\s*max-age=(\d+)/i)?.[1];
    const cacheMs = maxAge ? Number(maxAge) * 1000 : CERTIFICATE_CACHE_FALLBACK_MS;
    return {
      certificates,
      expiresAt: Date.now() + Math.max(cacheMs, 1000),
    };
  })();

  try {
    certificateCache = await certificateFetch;
    return certificateCache;
  } finally {
    certificateFetch = undefined;
  }
}

async function getSigningKey(kid: string): Promise<KeyObject> {
  const cachedKey = publicKeyCache.get(kid);
  if (cachedKey && certificateCache && certificateCache.expiresAt > Date.now()) return cachedKey;

  let certificates = certificateCache;
  if (!certificates || certificates.expiresAt <= Date.now()) certificates = await fetchCertificates();
  let certificate = certificates.certificates[kid];
  if (!certificate) {
    certificateCache = undefined;
    publicKeyCache.clear();
    certificates = await fetchCertificates();
    certificate = certificates.certificates[kid];
  }
  if (typeof certificate !== "string" || !certificate.includes("BEGIN CERTIFICATE")) return invalidToken();

  try {
    const key = createPublicKey(certificate);
    publicKeyCache.set(kid, key);
    return key;
  } catch {
    return invalidToken();
  }
}

export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseIdentity> {
  const projectId = getAdminProjectId();
  if (!projectId) {
    throw new FirebaseTokenVerifierUnavailableError("Firebase project ID is not configured on the server.");
  }
  if (idToken.length > 16_384) return invalidToken();

  const segments = idToken.split(".");
  if (segments.length !== 3 || segments.some((segment) => !segment)) return invalidToken();
  const [encodedHeader, encodedClaims, encodedSignature] = segments as [string, string, string];
  const header = decodeJsonSegment<FirebaseTokenHeader>(encodedHeader);
  const claims = decodeJsonSegment<FirebaseTokenClaims>(encodedClaims);
  if (header.alg !== "RS256" || typeof header.kid !== "string" || !header.kid) return invalidToken();

  const now = Math.floor(Date.now() / 1000);
  if (
    claims.aud !== projectId
    || claims.iss !== `https://securetoken.google.com/${projectId}`
    || typeof claims.sub !== "string"
    || claims.sub.length === 0
    || claims.sub.length > 128
    || typeof claims.exp !== "number"
    || claims.exp <= now
    || typeof claims.iat !== "number"
    || claims.iat > now + CLOCK_SKEW_SECONDS
    || typeof claims.auth_time !== "number"
    || claims.auth_time > now + CLOCK_SKEW_SECONDS
    || (typeof claims.nbf === "number" && claims.nbf > now + CLOCK_SKEW_SECONDS)
  ) {
    return invalidToken();
  }

  const key = await getSigningKey(header.kid);
  const signedContent = Buffer.from(`${encodedHeader}.${encodedClaims}`);
  const signature = Buffer.from(encodedSignature, "base64url");
  if (!verifySignature("RSA-SHA256", signedContent, key, signature)) return invalidToken();

  return { uid: claims.sub, claims };
}
