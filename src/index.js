import { timingSafeEqual } from 'crypto';

// --- Configuration & Constants ---
const FIREBASE_PROJECT_ID = "less-legal";
const FIREBASE_API_KEY = "AIzaSyCfmeRhssHAjeGAqcyq6gCTxHAOYlpcUwo"; 

const PLAN_PREMIUM_PERMANENT = {
  id: 'PREMIUM_PERMANENT',
  productId: 'lesslegal_premium_permanent',
  amountInPaise: 17900,
  currency: 'INR',
};

// --- Utilities ---

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://www.lesscreation.com',
    'https://lesscreation.com'
  ];
  let corsOrigin = '*';
  if (allowedOrigins.includes(origin) || origin.endsWith('.run.app')) {
    corsOrigin = origin;
  }
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-razorpay-signature',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

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

// --- Firebase Authentication (Verify Client ID Token for less-legal) ---
async function verifyFirebaseIdToken(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header. A fresh Firebase ID token is required.');
  }
  const idToken = authHeader.split('Bearer ')[1];
  
  // 1. Decode & verify JWT structure and audience / issuer for less-legal project
  const payload = parseJwt(idToken);
  if (!payload) {
    throw new Error('Firebase ID token format is invalid.');
  }
  
  const expectedAudience = FIREBASE_PROJECT_ID;
  const expectedIssuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
  
  if (payload.aud !== expectedAudience || payload.iss !== expectedIssuer) {
    throw new Error(`Firebase ID token was not issued for project '${FIREBASE_PROJECT_ID}'.`);
  }

  // 2. Lookup account via Google Identity Toolkit REST API
  const apiKey = (env && env.FIREBASE_API_KEY) ? env.FIREBASE_API_KEY : FIREBASE_API_KEY;
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  });
  
  if (!res.ok) {
    throw new Error('Invalid Firebase ID token verification response.');
  }
  const data = await res.json();
  if (!data.users || data.users.length === 0) {
    throw new Error('Firebase ID token is invalid or user not found.');
  }
  
  const verifiedUid = data.users[0].localId;
  if (verifiedUid !== payload.sub) {
    throw new Error('Mismatch between token payload UID and verified account UID.');
  }

  return verifiedUid; // Derived UID from verified token
}

// --- Firestore Admin REST API (Service Account required) ---
async function writeEntitlementToFirestore(env, uid, paymentId, orderId) {
  if (!env.FIREBASE_SERVICE_ACCOUNT) {
    console.error("FIREBASE_SERVICE_ACCOUNT is not set. Cannot write to Firestore.");
    throw new Error("Server configuration error: Firebase Service Account missing.");
  }
  
  let sa;
  try {
    sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON.");
  }

  // Authoritative Firebase Project ID verification
  const saProjectId = sa.project_id || sa.projectId;
  if (saProjectId && saProjectId !== FIREBASE_PROJECT_ID) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT project_id ('${saProjectId}') does not match expected project_id ('${FIREBASE_PROJECT_ID}').`);
  }
  
  const dbId = (env && env.FIREBASE_DATABASE_ID) ? env.FIREBASE_DATABASE_ID : "(default)";

  // Generate JWT for Google OAuth2
  const jwtHeader = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const jwtClaim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  
  const base64url = (str) => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unsignedJwt = base64url(JSON.stringify(jwtHeader)) + '.' + base64url(JSON.stringify(jwtClaim));
  
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = sa.private_key.substring(
    sa.private_key.indexOf(pemHeader) + pemHeader.length,
    sa.private_key.indexOf(pemFooter)
  ).replace(/\s/g, '');
  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }
  
  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(unsignedJwt));
  const signatureBase64url = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
  const signedJwt = unsignedJwt + '.' + signatureBase64url;
  
  // Exchange JWT for Access Token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signedJwt}`
  });
  
  if (!tokenRes.ok) throw new Error('Failed to get Firestore access token from Google OAuth2.');
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  
  // Prepare Firestore Document Data for user_subscriptions
  const activatedAt = new Date().toISOString();
  const subFields = {
    uid: { stringValue: uid },
    premium: { booleanValue: true },
    status: { stringValue: 'active' },
    entitlementType: { stringValue: 'PERMANENT' },
    source: { stringValue: 'razorpay' },
    productId: { stringValue: PLAN_PREMIUM_PERMANENT.productId },
    paymentId: { stringValue: paymentId },
    orderId: { stringValue: orderId },
    activatedAt: { stringValue: activatedAt }
  };
  
  const subUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${dbId}/documents/user_subscriptions/${uid}`;
  const subWriteRes = await fetch(subUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: `projects/${FIREBASE_PROJECT_ID}/databases/${dbId}/documents/user_subscriptions/${uid}`, fields: subFields })
  });
  if (!subWriteRes.ok) {
    const errText = await subWriteRes.text();
    throw new Error(`Failed to write user_subscriptions: ${errText}`);
  }

  // Prepare Firestore Document Data for razorpay_payments
  const paymentFields = {
    uid: { stringValue: uid },
    paymentId: { stringValue: paymentId },
    orderId: { stringValue: orderId },
    amount: { integerValue: String(PLAN_PREMIUM_PERMANENT.amountInPaise) },
    productId: { stringValue: PLAN_PREMIUM_PERMANENT.productId },
    status: { stringValue: 'SUCCESS' },
    timestamp: { stringValue: activatedAt }
  };
  
  const payUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${dbId}/documents/razorpay_payments?documentId=${paymentId}`;
  const payWriteRes = await fetch(payUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: paymentFields })
  });
  if (!payWriteRes.ok) {
    const errText = await payWriteRes.text();
    throw new Error(`Failed to write razorpay_payments: ${errText}`);
  }
  
  return true;
}


export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(request);

    // Handle Preflight OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname.startsWith('/api/')) {

      // --- CREATE ORDER ---
      if (url.pathname === '/api/razorpay/create-order' && request.method === 'POST') {
        try {
          const verifiedUid = await verifyFirebaseIdToken(request, env);
          
          const keyId = env.RAZORPAY_KEY_ID;
          const keySecret = env.RAZORPAY_KEY_SECRET;
          if (!keyId || !keySecret) {
            return jsonResponse({ ok: false, error: 'Razorpay keys not configured on server.' }, 500, corsHeaders);
          }

          const basicAuth = btoa(`${keyId}:${keySecret}`);
          const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: PLAN_PREMIUM_PERMANENT.amountInPaise,
              currency: PLAN_PREMIUM_PERMANENT.currency,
              receipt: `rcpt_${verifiedUid.substring(0,8)}_${Date.now()}`,
              notes: {
                firebase_uid: verifiedUid,
                plan: PLAN_PREMIUM_PERMANENT.id,
                productId: PLAN_PREMIUM_PERMANENT.productId
              },
            }),
          });

          const razorpayData = await razorpayResponse.json();
          if (!razorpayResponse.ok) {
            return jsonResponse({ ok: false, error: 'Failed to create order with Razorpay.' }, 502, corsHeaders);
          }

          return jsonResponse({
            ok: true,
            order_id: razorpayData.id,
            amount: razorpayData.amount,
            currency: razorpayData.currency,
            keyId: keyId,
          }, 200, corsHeaders);

        } catch (err) {
          return jsonResponse({ ok: false, error: err.message }, 401, corsHeaders);
        }
      }

      // --- VERIFY PAYMENT ---
      if (url.pathname === '/api/razorpay/verify-payment' && request.method === 'POST') {
        try {
          // Require authenticated user
          await verifyFirebaseIdToken(request, env);

          const body = await request.json().catch(() => ({}));
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

          if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return jsonResponse({ ok: false, error: 'Missing parameters.' }, 400, corsHeaders);
          }

          const keySecret = env.RAZORPAY_KEY_SECRET;
          const payloadToSign = razorpay_order_id + '|' + razorpay_payment_id;
          const expectedSignature = await hmacSha256Hex(keySecret, payloadToSign);
          const isSignatureValid = timingSafeEqualStr(expectedSignature, razorpay_signature);

          if (!isSignatureValid) {
            return jsonResponse({ ok: false, error: 'Invalid signature.' }, 400, corsHeaders);
          }

          // Payment is cryptographically valid. Real fulfillment occurs in the webhook,
          // but we return success here so the client can update UI (optimistically or fetch status).
          return jsonResponse({
            ok: true,
            verified: true,
            message: 'Payment verified securely. Entitlement will be granted via webhook.',
          }, 200, corsHeaders);

        } catch (err) {
          return jsonResponse({ ok: false, error: err.message }, 401, corsHeaders);
        }
      }

      // --- WEBHOOK ---
      if (url.pathname === '/api/razorpay/webhook' && request.method === 'POST') {
        const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
          return jsonResponse({ status: 'error', message: 'RAZORPAY_WEBHOOK_SECRET not set.' }, 500, corsHeaders);
        }

        try {
          const rawBody = await request.text();
          const signature = request.headers.get('x-razorpay-signature') || '';
          if (!signature) {
            return jsonResponse({ status: 'error', message: 'Missing signature.' }, 400, corsHeaders);
          }

          const expectedSignature = await hmacSha256Hex(webhookSecret, rawBody);
          const isSignatureValid = timingSafeEqualStr(expectedSignature, signature);

          if (!isSignatureValid) {
            return jsonResponse({ status: 'error', message: 'Invalid signature.' }, 400, corsHeaders);
          }

          const event = JSON.parse(rawBody);
          const eventType = event.event;

          if (eventType === 'payment.captured' || eventType === 'order.paid') {
            const paymentEntity = event.payload.payment.entity;
            const orderNotes = paymentEntity.notes || {};
            
            const uid = orderNotes.firebase_uid;
            
            if (!uid) {
              // Cannot fulfill without verified UID injected by our server during order creation
              return jsonResponse({ status: 'ignored', message: 'No firebase_uid in notes' }, 200, corsHeaders);
            }
            
            if (paymentEntity.amount !== PLAN_PREMIUM_PERMANENT.amountInPaise) {
              return jsonResponse({ status: 'ignored', message: 'Amount mismatch' }, 200, corsHeaders);
            }

            // Write entitlement to Firestore idempotently
            await writeEntitlementToFirestore(env, uid, paymentEntity.id, paymentEntity.order_id);
          }

          return jsonResponse({ status: 'ok', event: eventType, received: true }, 200, corsHeaders);
        } catch (err) {
          console.error("Webhook Error:", err);
          return jsonResponse({ status: 'error', message: err.message }, 400, corsHeaders);
        }
      }

      // 404 for unmatched API routes
      return jsonResponse({ ok: false, error: 'API endpoint not found' }, 404, corsHeaders);
    }

    // Permanent 301 Redirect for non-API web traffic
    if (url.hostname === 'lesscreation.com') {
      url.hostname = 'www.lesscreation.com';
      return Response.redirect(url.toString(), 301);
    }

    // Static Assets Handler
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Static assets binding not found', { status: 500 });
  },
};
