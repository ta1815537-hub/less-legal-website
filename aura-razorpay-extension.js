/**
 * AURA Pro Lifetime Membership â€” Cloudflare Worker Extension Module
 * -----------------------------------------------------------------
 * Drop-in companion module for the existing `less-legal-website` Cloudflare Worker.
 * Preserves 100% of existing List Legal routes, collections, and webhook handling.
 *
 * Required Worker Secrets (reused from existing merchant account):
 *   - RAZORPAY_KEY_ID
 *   - RAZORPAY_KEY_SECRET
 *   - RAZORPAY_WEBHOOK_SECRET
 *   - FIREBASE_SERVICE_ACCOUNT (JSON string for target Firebase project)
 * Optional Env Var:
 *   - AURA_FIREBASE_PROJECT_ID (not needed because app/google-services.json and
 *     FIREBASE_SERVICE_ACCOUNT both target the `less-legal` Firebase project!)
 *
 * Integration in existing Worker `fetch(request, env, ctx)`:
 *   1. If `url.pathname.startsWith("/api/aura/")` -> `return handleAuraApiRequest(request, env);`
 *   2. Inside existing `POST /api/razorpay/webhook`, pass rawBody BEFORE JSON.parse:
 *        const auraResult = await handleAuraRazorpayWebhookIfApplicable(rawBody, request.headers, env);
 *        if (auraResult.handled) return auraResult.response;
 *        // else continue existing List Legal webhook handler untouched!
 */

const AURA_PRODUCT = Object.freeze({
  PRODUCT_ID: "AURA_PRO_LIFETIME",
  PRODUCT_NAME: "AURA Pro Lifetime Membership",
  PRICE_INR: 49,
  AMOUNT_PAISE: 4900,
  CURRENCY: "INR",
  PURCHASE_TYPE: "ONE_TIME",
  ENTITLEMENT_TYPE: "LIFETIME",
});

const GOOGLE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

let cachedJwks = null;
let cachedJwksExpiresAt = 0;

/**
 * Main router for all `/api/aura/*` endpoints.
 */
export async function handleAuraApiRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    return jsonResponse(204, null);
  }

  try {
    if (path === "/api/aura/create-order" && request.method === "POST") {
      return await handleCreateOrder(request, env);
    }
    if (path === "/api/aura/verify-payment" && request.method === "POST") {
      return await handleVerifyPayment(request, env);
    }
    if (path === "/api/aura/entitlement" && request.method === "GET") {
      return await handleGetEntitlement(request, env);
    }
    if (path === "/api/aura/restore-purchase" && request.method === "POST") {
      return await handleRestorePurchase(request, env);
    }
    if (path === "/api/aura/purchase-history" && request.method === "GET") {
      return await handlePurchaseHistory(request, env);
    }
    return jsonResponse(404, { error: "Unknown AURA endpoint." });
  } catch (err) {
    if (err && err.statusCode) {
      return jsonResponse(err.statusCode, {
        error: err.message,
        ...(err.code ? { code: err.code } : {}),
        ...(err.extra || {}),
      });
    }
    return jsonResponse(500, { error: "Internal AURA billing error." });
  }
}

/**
 * A. POST /api/aura/create-order
 */
async function handleCreateOrder(request, env) {
  const authUser = await requireAuthenticatedFirebaseUser(request, env, {
    requireVerifiedEmail: true,
  });
  const fs = await createFirestoreRestClient(env);

  // Duplicate purchase guard: check existing lifetime entitlement first
  const existing = await fs.getDoc(`auraEntitlements/${authUser.uid}`);
  if (existing && existing.isPro === true && existing.membershipType === AURA_PRODUCT.ENTITLEMENT_TYPE) {
    return jsonResponse(409, {
      code: "ALREADY_OWNED",
      error: "AURA Pro Lifetime is already active on this account.",
      entitlement: formatEntitlementPayload(existing),
    });
  }

  // Server strictly controls product, exact â‚¹49 (4900 paise) amount, INR currency, and receipt
  const uniqueReceipt = `aura_${authUser.uid.slice(0, 12)}_${Date.now()}`;
  const orderPayload = {
    amount: AURA_PRODUCT.AMOUNT_PAISE,
    currency: AURA_PRODUCT.CURRENCY,
    receipt: uniqueReceipt,
    notes: {
      product_id: AURA_PRODUCT.PRODUCT_ID,
      firebase_uid: authUser.uid,
      email: authUser.email,
      purchase_type: AURA_PRODUCT.PURCHASE_TYPE,
    },
  };

  const rzpOrder = await razorpayRequest(env, "POST", "/v1/orders", orderPayload);
  if (!rzpOrder?.id || Number(rzpOrder.amount) !== AURA_PRODUCT.AMOUNT_PAISE) {
    throw httpError(502, "Razorpay order creation returned an invalid response.");
  }

  const nowIso = new Date().toISOString();
  await fs.setDoc(`auraOrders/${rzpOrder.id}`, {
    orderId: rzpOrder.id,
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName,
    productId: AURA_PRODUCT.PRODUCT_ID,
    amount: AURA_PRODUCT.AMOUNT_PAISE,
    currency: AURA_PRODUCT.CURRENCY,
    receipt: uniqueReceipt,
    status: "CREATED",
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  return jsonResponse(200, {
    orderId: rzpOrder.id,
    keyId: env.RAZORPAY_KEY_ID,
    amount: AURA_PRODUCT.AMOUNT_PAISE,
    currency: AURA_PRODUCT.CURRENCY,
    productId: AURA_PRODUCT.PRODUCT_ID,
    productName: AURA_PRODUCT.PRODUCT_NAME,
    purchaseType: AURA_PRODUCT.PURCHASE_TYPE,
    entitlementType: AURA_PRODUCT.ENTITLEMENT_TYPE,
    receipt: uniqueReceipt,
    email: authUser.email,
    displayName: authUser.displayName,
  });
}

/**
 * B. POST /api/aura/verify-payment
 */
async function handleVerifyPayment(request, env) {
  const authUser = await requireAuthenticatedFirebaseUser(request, env, {
    requireVerifiedEmail: true,
  });

  const body = await safeParseJson(request);
  const razorpayOrderId = String(body?.razorpay_order_id || "").trim();
  const razorpayPaymentId = String(body?.razorpay_payment_id || "").trim();
  const razorpaySignature = String(body?.razorpay_signature || "").trim();

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw httpError(400, "Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature.");
  }

  const fs = await createFirestoreRestClient(env);

  // 1. Retrieve original order from backend storage and verify ownership
  const storedOrder = await fs.getDoc(`auraOrders/${razorpayOrderId}`);
  if (!storedOrder) {
    throw httpError(404, "Order record not found on server.");
  }
  if (storedOrder.uid !== authUser.uid) {
    throw httpError(403, "Order does not belong to the authenticated Firebase user.");
  }
  if (storedOrder.productId !== AURA_PRODUCT.PRODUCT_ID) {
    throw httpError(400, "Order product mismatch.");
  }

  // 2. Verify HMAC-SHA256 signature using RAZORPAY_KEY_SECRET
  const expectedSig = await hmacSha256Hex(
    env.RAZORPAY_KEY_SECRET,
    `${razorpayOrderId}|${razorpayPaymentId}`
  );
  if (!constantTimeEqualsHex(expectedSig, razorpaySignature)) {
    throw httpError(400, "Invalid Razorpay payment signature.");
  }

  // 3. Fetch authoritative payment details from Razorpay API
  const payment = await razorpayRequest(env, "GET", `/v1/payments/${encodeURIComponent(razorpayPaymentId)}`);
  if (!payment || payment.id !== razorpayPaymentId) {
    throw httpError(502, "Could not fetch payment details from Razorpay.");
  }
  if (payment.order_id !== razorpayOrderId) {
    throw httpError(400, "Payment order_id does not match verified order.");
  }
  if (Number(payment.amount) !== AURA_PRODUCT.AMOUNT_PAISE || payment.currency !== AURA_PRODUCT.CURRENCY) {
    throw httpError(400, "Payment amount or currency does not match â‚¹49 INR.");
  }
  if (payment.notes?.product_id && payment.notes.product_id !== AURA_PRODUCT.PRODUCT_ID) {
    throw httpError(400, "Payment product_id does not match AURA_PRO_LIFETIME.");
  }

  if (payment.status === "authorized") {
    return jsonResponse(202, {
      isPro: false,
      paymentStatus: "PENDING",
      message: "Payment authorized and awaiting capture confirmation.",
    });
  }
  if (payment.status !== "captured") {
    throw httpError(400, `Payment is not captured (status: ${payment.status}).`);
  }

  // 4. Atomically activate AURA PRO LIFETIME & prevent duplicate entitlements
  const entitlement = await activateAuraLifetimeAtomic(fs, {
    uid: authUser.uid,
    email: authUser.email,
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    source: "VERIFY_ENDPOINT",
  });

  return jsonResponse(200, formatEntitlementPayload(entitlement));
}

/**
 * C. GET /api/aura/entitlement
 */
async function handleGetEntitlement(request, env) {
  const authUser = await requireAuthenticatedFirebaseUser(request, env, {
    requireVerifiedEmail: false,
  });
  const fs = await createFirestoreRestClient(env);
  const doc = await fs.getDoc(`auraEntitlements/${authUser.uid}`);

  if (!doc) {
    return jsonResponse(200, {
      isPro: false,
      productId: AURA_PRODUCT.PRODUCT_ID,
      membershipType: "NONE",
      purchaseDate: null,
      expiryDate: null,
      paymentStatus: "NONE",
    });
  }

  return jsonResponse(200, formatEntitlementPayload(doc));
}

/**
 * D. POST /api/aura/restore-purchase
 */
async function handleRestorePurchase(request, env) {
  const authUser = await requireAuthenticatedFirebaseUser(request, env, {
    requireVerifiedEmail: false,
  });
  const fs = await createFirestoreRestClient(env);

  const entitlement = await fs.getDoc(`auraEntitlements/${authUser.uid}`);
  if (!entitlement || entitlement.isPro !== true || !entitlement.razorpayPaymentId) {
    return jsonResponse(404, {
      isPro: false,
      error: "No verified AURA Pro Lifetime purchase found for this account.",
    });
  }

  const purchase = await fs.getDoc(`auraPurchases/${entitlement.razorpayPaymentId}`);
  if (!purchase || purchase.uid !== authUser.uid || purchase.paymentStatus !== "CAPTURED") {
    return jsonResponse(404, {
      isPro: false,
      error: "Original captured purchase record could not be verified.",
    });
  }

  return jsonResponse(200, formatEntitlementPayload(entitlement));
}

/**
 * E. GET /api/aura/purchase-history
 */
async function handlePurchaseHistory(request, env) {
  const authUser = await requireAuthenticatedFirebaseUser(request, env, {
    requireVerifiedEmail: false,
  });
  const fs = await createFirestoreRestClient(env);

  const records = await fs.queryCollectionByField("auraPurchases", "uid", authUser.uid);
  const sanitized = records.map((rec) => ({
    razorpayPaymentId: rec.razorpayPaymentId || "",
    razorpayOrderId: rec.razorpayOrderId || "",
    productId: rec.productId || AURA_PRODUCT.PRODUCT_ID,
    amount: Number(rec.amount || AURA_PRODUCT.AMOUNT_PAISE),
    currency: rec.currency || AURA_PRODUCT.CURRENCY,
    paymentStatus: rec.paymentStatus || "CAPTURED",
    purchaseDate: rec.purchaseDate || rec.createdAt || "",
  }));

  return jsonResponse(200, { purchases: sanitized });
}

/**
 * Webhook Extension for existing `https://lesscreation.com/api/razorpay/webhook`.
 * - Verifies `X-Razorpay-Signature` over RAW body BEFORE JSON parsing.
 * - Handles ONLY events tagged with `product_id === "AURA_PRO_LIFETIME"` (or matching an `auraOrders` doc),
 *   returning `{ handled: false }` for all List Legal payments so List Legal continues untouched.
 */
export async function handleAuraRazorpayWebhookIfApplicable(rawBody, headers, env) {
  const signature = headers.get("x-razorpay-signature") || headers.get("X-Razorpay-Signature") || "";
  const eventId = headers.get("x-razorpay-event-id") || headers.get("X-Razorpay-Event-Id") || "";

  // Verify raw-body HMAC-SHA256 before any JSON parsing
  const expectedSig = await hmacSha256Hex(env.RAZORPAY_WEBHOOK_SECRET, rawBody);
  if (!signature || !constantTimeEqualsHex(expectedSig, signature)) {
    return {
      handled: true,
      response: jsonResponse(401, { error: "Invalid Razorpay webhook signature." }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return {
      handled: true,
      response: jsonResponse(400, { error: "Malformed webhook JSON." }),
    };
  }

  const eventType = payload?.event || "";
  const paymentEntity = payload?.payload?.payment?.entity || null;
  const orderEntity = payload?.payload?.order?.entity || null;
  const refundEntity = payload?.payload?.refund?.entity || null;

  const productId =
    paymentEntity?.notes?.product_id ||
    orderEntity?.notes?.product_id ||
    refundEntity?.notes?.product_id ||
    "";

  const orderId = paymentEntity?.order_id || orderEntity?.id || "";
  const paymentId = paymentEntity?.id || refundEntity?.payment_id || "";

  const fs = await createFirestoreRestClient(env);

  // Determine whether this webhook belongs to AURA or List Legal
  let storedOrder = orderId ? await fs.getDoc(`auraOrders/${orderId}`) : null;
  let storedPurchase = paymentId ? await fs.getDoc(`auraPurchases/${paymentId}`) : null;
  const isAuraEvent =
    productId === AURA_PRODUCT.PRODUCT_ID || storedOrder != null || storedPurchase != null;

  if (!isAuraEvent) {
    // Pass straight through to existing List Legal webhook handler untouched
    return { handled: false };
  }

  // Idempotent event deduplication via x-razorpay-event-id
  if (eventId) {
    const seen = await fs.getDoc(`auraWebhookEvents/${eventId}`);
    if (seen) {
      return {
        handled: true,
        response: jsonResponse(200, { status: "duplicate_ignored", eventId }),
      };
    }
  }

  const nowIso = new Date().toISOString();

  if (eventType === "payment.captured" || eventType === "order.paid") {
    const capturedPayment = paymentEntity;
    const isCaptured =
      (capturedPayment?.status === "captured" || eventType === "order.paid") &&
      Number(capturedPayment?.amount ?? orderEntity?.amount_paid) === AURA_PRODUCT.AMOUNT_PAISE &&
      (capturedPayment?.currency || orderEntity?.currency) === AURA_PRODUCT.CURRENCY;

    const uid =
      storedOrder?.uid ||
      capturedPayment?.notes?.firebase_uid ||
      orderEntity?.notes?.firebase_uid ||
      "";
    const email =
      storedOrder?.email ||
      capturedPayment?.notes?.email ||
      capturedPayment?.email ||
      "";

    if (isCaptured && uid && paymentId && orderId) {
      await activateAuraLifetimeAtomic(fs, {
        uid,
        email,
        orderId,
        paymentId,
        source: `WEBHOOK_${eventType}`,
      });
    }
  } else if (eventType === "payment.failed") {
    // Out-of-order protection: NEVER overwrite an already confirmed captured Pro entitlement!
    if (storedOrder && storedOrder.status !== "CAPTURED") {
      await fs.setDoc(`auraOrders/${orderId}`, {
        ...storedOrder,
        status: "FAILED",
        updatedAt: nowIso,
      });
    }
  } else if (eventType === "refund.processed") {
    // Only revoke if refund matches the user's active captured paymentId
    if (storedPurchase && storedPurchase.uid) {
      const ent = await fs.getDoc(`auraEntitlements/${storedPurchase.uid}`);
      if (ent && ent.razorpayPaymentId === paymentId) {
        await fs.setDoc(`auraEntitlements/${storedPurchase.uid}`, {
          ...ent,
          isPro: false,
          membershipType: "NONE",
          paymentStatus: "REFUNDED",
          updatedAt: nowIso,
        });
      }
      await fs.setDoc(`auraPurchases/${paymentId}`, {
        ...storedPurchase,
        paymentStatus: "REFUNDED",
        refundId: refundEntity?.id || "",
        updatedAt: nowIso,
      });
    }
  }

  if (eventId) {
    await fs.setDoc(`auraWebhookEvents/${eventId}`, {
      eventId,
      eventType,
      orderId,
      paymentId,
      processedAt: nowIso,
    });
  }

  return {
    handled: true,
    response: jsonResponse(200, { status: "ok", product: AURA_PRODUCT.PRODUCT_ID, eventType }),
  };
}

/**
 * Atomic activation & duplicate-payment protection.
 * If the UID already owns AURA Pro Lifetime under a DIFFERENT captured paymentId,
 * preserves the valid entitlement and flags the duplicate payment in `auraDuplicatePayments/{paymentId}`
 * for immediate support refund reconciliation.
 */
async function activateAuraLifetimeAtomic(fs, { uid, email, orderId, paymentId, source }) {
  const nowIso = new Date().toISOString();
  const existingEnt = await fs.getDoc(`auraEntitlements/${uid}`);

  // Already activated with the exact same paymentId -> idempotent return
  if (existingEnt && existingEnt.isPro === true && existingEnt.razorpayPaymentId === paymentId) {
    return existingEnt;
  }

  // Accidental duplicate captured payment for an already-Pro UID -> flag for refund!
  if (
    existingEnt &&
    existingEnt.isPro === true &&
    existingEnt.razorpayPaymentId &&
    existingEnt.razorpayPaymentId !== paymentId
  ) {
    await fs.setDoc(`auraDuplicatePayments/${paymentId}`, {
      uid,
      email,
      originalPaymentId: existingEnt.razorpayPaymentId,
      duplicatePaymentId: paymentId,
      duplicateOrderId: orderId,
      amount: AURA_PRODUCT.AMOUNT_PAISE,
      currency: AURA_PRODUCT.CURRENCY,
      status: "NEEDS_REFUND_REVIEW",
      source,
      flaggedAt: nowIso,
    });
    return existingEnt;
  }

  const entitlementDoc = {
    uid,
    email,
    productId: AURA_PRODUCT.PRODUCT_ID,
    membershipType: AURA_PRODUCT.ENTITLEMENT_TYPE,
    isPro: true,
    paymentStatus: "CAPTURED",
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    amount: AURA_PRODUCT.AMOUNT_PAISE,
    currency: AURA_PRODUCT.CURRENCY,
    purchaseDate: nowIso,
    expiryDate: null,
    createdAt: existingEnt?.createdAt || nowIso,
    updatedAt: nowIso,
  };

  const purchaseDoc = {
    uid,
    email,
    productId: AURA_PRODUCT.PRODUCT_ID,
    membershipType: AURA_PRODUCT.ENTITLEMENT_TYPE,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    amount: AURA_PRODUCT.AMOUNT_PAISE,
    currency: AURA_PRODUCT.CURRENCY,
    paymentStatus: "CAPTURED",
    verificationSource: source,
    purchaseDate: nowIso,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await fs.commitBatch([
    { path: `auraEntitlements/${uid}`, data: entitlementDoc },
    { path: `auraPurchases/${paymentId}`, data: purchaseDoc },
    {
      path: `auraOrders/${orderId}`,
      data: {
        orderId,
        uid,
        email,
        productId: AURA_PRODUCT.PRODUCT_ID,
        amount: AURA_PRODUCT.AMOUNT_PAISE,
        currency: AURA_PRODUCT.CURRENCY,
        razorpayPaymentId: paymentId,
        status: "CAPTURED",
        updatedAt: nowIso,
      },
    },
  ]);

  return entitlementDoc;
}

function formatEntitlementPayload(doc) {
  return {
    isPro: doc.isPro === true,
    productId: doc.productId || AURA_PRODUCT.PRODUCT_ID,
    membershipType: doc.isPro === true ? AURA_PRODUCT.ENTITLEMENT_TYPE : "NONE",
    purchaseDate: doc.purchaseDate || null,
    expiryDate: null,
    paymentStatus: doc.paymentStatus || "NONE",
    razorpayOrderId: doc.razorpayOrderId || null,
    razorpayPaymentId: doc.razorpayPaymentId || null,
    amount: Number(doc.amount || AURA_PRODUCT.AMOUNT_PAISE),
    currency: doc.currency || AURA_PRODUCT.CURRENCY,
  };
}

/**
 * Cryptographic RS256 Firebase ID token verification using Google's public JWKS.
 */
async function requireAuthenticatedFirebaseUser(request, env, { requireVerifiedEmail }) {
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw httpError(401, "Missing Firebase Authorization Bearer token.");
  }
  const token = authHeader.slice(7).trim();
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw httpError(401, "Malformed Firebase ID token.");
  }

  const header = JSON.parse(base64UrlDecodeToString(parts[0]));
  const claims = JSON.parse(base64UrlDecodeToString(parts[1]));
  const signatureBytes = base64UrlDecodeToBytes(parts[2]);

  const serviceAccount = parseServiceAccount(env);
  const projectId = env.AURA_FIREBASE_PROJECT_ID || serviceAccount.project_id;
  const nowSec = Math.floor(Date.now() / 1000);

  if (header.alg !== "RS256" || !header.kid) {
    throw httpError(401, "Unsupported Firebase token algorithm.");
  }
  if (claims.aud !== projectId || claims.iss !== `https://securetoken.google.com/${projectId}`) {
    throw httpError(401, "Firebase ID token project mismatch.");
  }
  if (!claims.sub || typeof claims.sub !== "string") {
    throw httpError(401, "Firebase ID token missing UID.");
  }
  if (Number(claims.exp) <= nowSec || Number(claims.iat) > nowSec + 300) {
    throw httpError(401, "Firebase ID token expired.");
  }

  const jwk = await getGooglePublicJwk(header.kid);
  if (!jwk) {
    throw httpError(401, "Unrecognized Firebase token signing key.");
  }

  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    signatureBytes,
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );
  if (!verified) {
    throw httpError(401, "Invalid Firebase ID token signature.");
  }

  const email = String(claims.email || "").trim();
  const emailVerified = claims.email_verified === true;
  if (requireVerifiedEmail && (!email || !emailVerified)) {
    throw httpError(403, "Verified email is required before purchasing AURA Pro Lifetime.", "EMAIL_NOT_VERIFIED", {
      email,
    });
  }

  return {
    uid: claims.sub,
    email,
    emailVerified,
    displayName: String(claims.name || "").trim(),
  };
}

async function getGooglePublicJwk(kid) {
  const now = Date.now();
  if (!cachedJwks || now >= cachedJwksExpiresAt) {
    const res = await fetch(GOOGLE_JWKS_URL);
    if (!res.ok) throw httpError(502, "Failed to fetch Firebase public signing keys.");
    const data = await res.json();
    cachedJwks = data.keys || [];
    cachedJwksExpiresAt = now + 30 * 60 * 1000;
  }
  return cachedJwks.find((k) => k.kid === kid) || null;
}

async function razorpayRequest(env, method, path, bodyObj = null) {
  const basic = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const res = await fetch(`https://api.razorpay.com${path}`, {
    method,
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
    },
    body: bodyObj ? JSON.stringify(bodyObj) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw httpError(502, data?.error?.description || `Razorpay API error (${res.status})`);
  }
  return data;
}

/**
 * Lightweight Firestore REST API v1 client authenticated via FIREBASE_SERVICE_ACCOUNT.
 */
async function createFirestoreRestClient(env) {
  const sa = parseServiceAccount(env);
  const projectId = env.AURA_FIREBASE_PROJECT_ID || sa.project_id;
  const accessToken = await getGoogleServiceAccountAccessToken(sa);
  const docsBase = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  return {
    async getDoc(docPath) {
      const res = await fetch(`${docsBase}/${docPath}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 404) return null;
      if (!res.ok) throw httpError(502, `Firestore read failed (${res.status})`);
      const doc = await res.json();
      return fromFirestoreFields(doc.fields || {});
    },

    async setDoc(docPath, data) {
      const res = await fetch(`${docsBase}/${docPath}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: toFirestoreFields(data) }),
      });
      if (!res.ok) throw httpError(502, `Firestore write failed (${res.status})`);
    },

    async commitBatch(writes) {
      const payload = {
        writes: writes.map(({ path, data }) => ({
          update: {
            name: `projects/${projectId}/databases/(default)/documents/${path}`,
            fields: toFirestoreFields(data),
          },
        })),
      };
      const res = await fetch(`${docsBase}:commit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw httpError(502, `Firestore atomic commit failed (${res.status})`);
    },

    async queryCollectionByField(collectionId, fieldPath, value) {
      const res = await fetch(`${docsBase}:runQuery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              fieldFilter: {
                field: { fieldPath },
                op: "EQUAL",
                value: toFirestoreValue(value),
              },
            },
          },
        }),
      });
      if (!res.ok) return [];
      const rows = await res.json();
      return rows
        .filter((r) => r.document && r.document.fields)
        .map((r) => fromFirestoreFields(r.document.fields));
    },
  };
}

async function getGoogleServiceAccountAccessToken(sa) {
  const nowSec = Math.floor(Date.now() / 1000);
  const headerB64 = base64UrlEncodeString(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimB64 = base64UrlEncodeString(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: nowSec,
      exp: nowSec + 3600,
    })
  );
  const signingInput = `${headerB64}.${claimB64}`;
  const key = await importPkcs8PrivateKey(sa.private_key);
  const sigBuf = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(sigBuf))}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw httpError(502, "Failed to authenticate Firebase service account.");
  }
  return tokenData.access_token;
}

async function importPkcs8PrivateKey(pem) {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binary.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toFirestoreFields(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = toFirestoreValue(v);
  }
  return out;
}

function toFirestoreValue(v) {
  if (v === null) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  return { stringValue: String(v) };
}

function fromFirestoreFields(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    if ("nullValue" in v) out[k] = null;
    else if ("booleanValue" in v) out[k] = Boolean(v.booleanValue);
    else if ("integerValue" in v) out[k] = Number(v.integerValue);
    else if ("doubleValue" in v) out[k] = Number(v.doubleValue);
    else if ("stringValue" in v) out[k] = v.stringValue;
  }
  return out;
}

async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqualsHex(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function parseServiceAccount(env) {
  if (!env.FIREBASE_SERVICE_ACCOUNT) {
    throw httpError(500, "Missing FIREBASE_SERVICE_ACCOUNT secret.");
  }
  return typeof env.FIREBASE_SERVICE_ACCOUNT === "string"
    ? JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)
    : env.FIREBASE_SERVICE_ACCOUNT;
}

async function safeParseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function base64UrlDecodeToBytes(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function base64UrlDecodeToString(str) {
  return new TextDecoder().decode(base64UrlDecodeToBytes(str));
}

function base64UrlEncodeBytes(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeString(str) {
  return base64UrlEncodeBytes(new TextEncoder().encode(str));
}

function httpError(statusCode, message, code = null, extra = null) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  err.extra = extra;
  return err;
}

function jsonResponse(status, body) {
  if (status === 204) {
    return new Response(null, { status: 204 });
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
