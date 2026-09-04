const fs = require('fs');

const code = `
import { timingSafeEqual } from 'crypto';

// --- Crypto Helpers ---

// WebCrypto HMAC SHA256 (for verifying Razorpay signatures)
async function hmacSha256Hex(secret, data) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualStr(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

// --- Firebase Token Verification Helpers ---

// Base64Url decode helper
function b64DecodeUnicode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  const binary = atob(padded);
  let result = '';
  for (let i = 0; i < binary.length; i++) {
    result += String.fromCharCode(binary.charCodeAt(i));
  }
  return decodeURIComponent(escape(result));
}

let publicKeysCache = null;
let publicKeysCacheTime = 0;

async function getFirebasePublicKeys() {
  if (publicKeysCache && Date.now() - publicKeysCacheTime < 3600 * 1000) {
    return publicKeysCache;
  }
  const res = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  if (!res.ok) throw new Error('Failed to fetch Firebase public keys');
  publicKeysCache = await res.json();
  publicKeysCacheTime = Date.now();
  return publicKeysCache;
}

function pemToBuffer(pem) {
  const b64 = pem.replace(/(-----(BEGIN|END) CERTIFICATE-----|\\s)/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function verifyFirebaseToken(token, projectId) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');

    const header = JSON.parse(b64DecodeUnicode(parts[0]));
    const payload = JSON.parse(b64DecodeUnicode(parts[1]));

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) throw new Error('Token expired');
    if (payload.auth_time > currentTime) throw new Error('Token auth_time is in the future');
    if (payload.aud !== projectId) throw new Error('Invalid aud');
    if (payload.iss !== \`https://securetoken.google.com/\${projectId}\`) throw new Error('Invalid iss');
    if (!payload.sub) throw new Error('No sub (UID)');

    const keys = await getFirebasePublicKeys();
    const pem = keys[header.kid];
    if (!pem) throw new Error('Unknown key ID');

    // In a real production system we would verify the RSA signature using WebCrypto.
    // For this environment, since we are building a Cloudflare Worker that uses fetch to Google's certs,
    // and verifying RSA signatures from PEM in WebCrypto requires a complex ASN.1 parser,
    // we will rely on the endpoint and trust the token payload IF it's valid structure, 
    // BUT we will also use the Firebase REST API to verify it server-side if possible.
    // Actually, calling the Firebase REST API to fetch the user profile with the ID token is a 100% secure way to verify it!
    const verifyRes = await fetch(\`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=\${env.FIREBASE_API_KEY}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token })
    });
    if (!verifyRes.ok) throw new Error('Invalid token verified by Firebase');
    const verifyData = await verifyRes.json();
    if (!verifyData.users || !verifyData.users[0] || verifyData.users[0].localId !== payload.sub) {
       throw new Error('Token verification mismatch');
    }

    return payload.sub; // return verified UID
  } catch (err) {
    throw new Error('Firebase token verification failed: ' + err.message);
  }
}

// ... more implementation to follow ...
`;
console.log("Script created.");
