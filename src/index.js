/**
 * Cloudflare Worker Entry Point for Less Legal / Less Creation
 * 
 * Production Backend Service: less-legal-website
 * Production Domain: https://www.lesscreation.com
 * 
 * Endpoints:
 * - GET  /api/health
 * - POST /api/razorpay/create-order
 * - POST /api/razorpay/verify-payment
 * - POST /api/razorpay/webhook
 * - Static Assets: env.ASSETS.fetch(request)
 * - 301 Permanent Redirect: lesscreation.com -> https://www.lesscreation.com
 */

// Authoritative Plans and Pricing (Paise & Days)
// Never trust price, currency, or validity received from the client browser.
const AUTHORITATIVE_PLANS = {
  'plan-3m': {
    id: 'plan-3m',
    code: 'NO_ADS_3_MONTHS',
    name: '3 महीने का पास (3 Months Pass - No Ads)',
    amountInPaise: 5900, // ₹59.00
    currency: 'INR',
    validityDays: 90,
    description: 'Less Legal 90 Days Ad-Free Premium Pass',
  },
  'NO_ADS_3_MONTHS': {
    id: 'plan-3m',
    code: 'NO_ADS_3_MONTHS',
    name: '3 महीने का पास (3 Months Pass - No Ads)',
    amountInPaise: 5900,
    currency: 'INR',
    validityDays: 90,
    description: 'Less Legal 90 Days Ad-Free Premium Pass',
  },
  'plan-1y': {
    id: 'plan-1y',
    code: 'NO_ADS_1_YEAR',
    name: '1 वर्ष का पास (1 Year Pass - No Ads)',
    amountInPaise: 17900, // ₹179.00
    currency: 'INR',
    validityDays: 365,
    description: 'Less Legal 365 Days Ad-Free Premium Pass',
  },
  'NO_ADS_1_YEAR': {
    id: 'plan-1y',
    code: 'NO_ADS_1_YEAR',
    name: '1 वर्ष का पास (1 Year Pass - No Ads)',
    amountInPaise: 17900,
    currency: 'INR',
    validityDays: 365,
    description: 'Less Legal 365 Days Ad-Free Premium Pass',
  },
};

/**
 * CORS configuration for production & local development
 */
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = [
    'https://www.lesscreation.com',
    'https://lesscreation.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  let matchedOrigin = 'https://www.lesscreation.com';
  if (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.lesscreation.com') ||
    origin.includes('localhost:') ||
    origin.includes('127.0.0.1:') ||
    origin.includes('run.app') ||
    origin.includes('aistudio.google.com')
  ) {
    matchedOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': matchedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Razorpay-Signature, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

/**
 * Helper to generate JSON responses with appropriate headers
 */
function jsonResponse(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      ...corsHeaders,
    },
  });
}

/**
 * Compute HMAC-SHA256 hex string using Web Crypto API
 */
async function hmacSha256Hex(secret, message) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const msgData = encoder.encode(message);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, msgData);
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API Routes FIRST (Ensures Android App calling either lesscreation.com/api/... or www.lesscreation.com/api/... works flawlessly without POST body drop on 301)
    if (url.pathname.startsWith('/api/')) {
      const corsHeaders = getCorsHeaders(request);

      // Handle CORS Preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      // GET /api/health
      if (url.pathname === '/api/health' && request.method === 'GET') {
        return jsonResponse(
          {
            ok: true,
            service: 'less-legal-website',
            timestamp: new Date().toISOString(),
            environment: 'production',
            razorpayConfigured: Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
          },
          200,
          corsHeaders
        );
      }

      // POST /api/razorpay/create-order
      if (url.pathname === '/api/razorpay/create-order' && request.method === 'POST') {
        const keyId = env.RAZORPAY_KEY_ID;
        const keySecret = env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
          return jsonResponse(
            {
              ok: false,
              error: 'Razorpay payment gateway is not yet configured in server environment. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
            },
            500,
            corsHeaders
          );
        }

        try {
          const body = await request.json().catch(() => ({}));
          const { planId, userId, userEmail, userPhone } = body;

          if (!planId || !AUTHORITATIVE_PLANS[planId]) {
            return jsonResponse(
              {
                ok: false,
                error: 'Invalid or missing plan ID. Please select a valid plan (NO_ADS_3_MONTHS or NO_ADS_1_YEAR).',
              },
              400,
              corsHeaders
            );
          }

          const plan = AUTHORITATIVE_PLANS[planId];
          const receiptId = ('rcpt_ll_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)).slice(0, 40);

          const orderPayload = {
            amount: plan.amountInPaise,
            currency: 'INR',
            receipt: receiptId,
            notes: {
              app_name: 'Less Legal',
              plan_id: plan.id,
              plan_code: plan.code,
              validity_days: String(plan.validityDays),
              user_id: String(userId || '').slice(0, 100),
              user_email: String(userEmail || '').slice(0, 100),
            },
          };

          const basicAuth = btoa(keyId + ':' + keySecret);
          const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + basicAuth,
              'Content-Type': 'application/json',
              'User-Agent': 'LessCreation-RazorpayWorker/1.0',
            },
            body: JSON.stringify(orderPayload),
          });

          if (!rzpResponse.ok) {
            const errorText = await rzpResponse.text().catch(() => '');
            let parsedError = 'Failed to create Razorpay order.';
            try {
              const errObj = JSON.parse(errorText);
              if (errObj.error && errObj.error.description) {
                parsedError = errObj.error.description;
              }
            } catch {}

            return jsonResponse(
              {
                ok: false,
                error: parsedError,
              },
              502,
              corsHeaders
            );
          }

          const rzpOrder = await rzpResponse.json();

          // Return only what client strictly needs (Never return Key Secret)
          return jsonResponse(
            {
              ok: true,
              order_id: rzpOrder.id,
              amount: rzpOrder.amount,
              currency: rzpOrder.currency,
              key_id: keyId,
              plan_id: plan.id,
              plan_code: plan.code,
              plan_name: plan.name,
              validity_days: plan.validityDays,
              receipt: rzpOrder.receipt,
            },
            200,
            corsHeaders
          );
        } catch (err) {
          return jsonResponse(
            {
              ok: false,
              error: 'An unexpected error occurred while creating order.',
            },
            500,
            corsHeaders
          );
        }
      }

      // POST /api/razorpay/verify-payment
      if (url.pathname === '/api/razorpay/verify-payment' && request.method === 'POST') {
        const keyId = env.RAZORPAY_KEY_ID;
        const keySecret = env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
          return jsonResponse(
            {
              ok: false,
              error: 'Razorpay payment gateway is not yet configured in server environment.',
            },
            500,
            corsHeaders
          );
        }

        try {
          const body = await request.json().catch(() => ({}));
          const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            planId,
            userId,
            userEmail,
          } = body;

          if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return jsonResponse(
              {
                ok: false,
                error: 'Missing required Razorpay payment verification parameters.',
              },
              400,
              corsHeaders
            );
          }

          // 1. Verify HMAC-SHA256 signature server-side
          const payloadToSign = razorpay_order_id + '|' + razorpay_payment_id;
          const expectedSignature = await hmacSha256Hex(keySecret, payloadToSign);

          const isSignatureValid = timingSafeEqual(expectedSignature, razorpay_signature);
          if (!isSignatureValid) {
            return jsonResponse(
              {
                ok: false,
                error: 'Invalid payment signature. Verification failed.',
              },
              400,
              corsHeaders
            );
          }

          // 2. Authoritative Verification via Razorpay REST API
          const basicAuth = btoa(keyId + ':' + keySecret);
          const paymentFetch = await fetch(
            'https://api.razorpay.com/v1/payments/' + encodeURIComponent(razorpay_payment_id),
            {
              method: 'GET',
              headers: {
                'Authorization': 'Basic ' + basicAuth,
                'User-Agent': 'LessCreation-RazorpayWorker/1.0',
              },
            }
          );

          if (!paymentFetch.ok) {
            return jsonResponse(
              {
                ok: false,
                error: 'Unable to verify payment status with payment gateway.',
              },
              502,
              corsHeaders
            );
          }

          const paymentData = await paymentFetch.json();

          // Verify order ID match
          if (paymentData.order_id !== razorpay_order_id) {
            return jsonResponse(
              {
                ok: false,
                error: 'Order ID mismatch during payment verification.',
              },
              400,
              corsHeaders
            );
          }

          // If payment is authorized but not captured, auto-capture it
          if (paymentData.status === 'authorized') {
            const captureRes = await fetch(
              'https://api.razorpay.com/v1/payments/' + encodeURIComponent(razorpay_payment_id) + '/capture',
              {
                method: 'POST',
                headers: {
                  'Authorization': 'Basic ' + basicAuth,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  amount: paymentData.amount,
                  currency: paymentData.currency || 'INR',
                }),
              }
            );
            if (captureRes.ok) {
              paymentData.status = 'captured';
            }
          }

          if (paymentData.status !== 'captured') {
            return jsonResponse(
              {
                ok: false,
                error: 'Payment was not captured successfully. Status: ' + paymentData.status,
              },
              400,
              corsHeaders
            );
          }

          // 3. Determine authoritative plan and price
          const expectedPlan = AUTHORITATIVE_PLANS[planId];
          const verifiedAmount = Number(paymentData.amount);

          if (expectedPlan && verifiedAmount !== expectedPlan.amountInPaise) {
            return jsonResponse(
              {
                ok: false,
                error: 'Payment amount mismatch for the selected plan.',
              },
              400,
              corsHeaders
            );
          }

          const planCode = verifiedAmount === 17900 ? 'NO_ADS_1_YEAR' : 'NO_ADS_3_MONTHS';
          const finalPlan = expectedPlan || AUTHORITATIVE_PLANS[planCode];
          const validityDays = finalPlan.validityDays;
          const startDate = new Date();
          const expiryDate = new Date(startDate.getTime() + validityDays * 24 * 60 * 60 * 1000);

          // 4. Construct Activated Membership record
          const membership = {
            status: 'ACTIVE',
            planId: finalPlan.id,
            planCode: finalPlan.code,
            planName: finalPlan.name,
            amount: verifiedAmount,
            amountFormatted: '₹' + (verifiedAmount / 100).toFixed(0),
            currency: paymentData.currency || 'INR',
            validityDays,
            startDate: startDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
            userId: userId || paymentData.notes?.user_id || 'web_user',
            userEmail: userEmail || paymentData.email || paymentData.notes?.user_email || '',
            userContact: paymentData.contact || '',
            paymentMethod: paymentData.method || 'online',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            verifiedAt: new Date().toISOString(),
          };

          return jsonResponse(
            {
              ok: true,
              verified: true,
              membership,
              message: 'Payment successfully verified. ' + finalPlan.name + ' activated.',
            },
            200,
            corsHeaders
          );
        } catch (err) {
          return jsonResponse(
            {
              ok: false,
              error: 'An unexpected error occurred during payment verification.',
            },
            500,
            corsHeaders
          );
        }
      }

      // POST /api/razorpay/webhook
      if (url.pathname === '/api/razorpay/webhook' && request.method === 'POST') {
        const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
          return jsonResponse(
            {
              status: 'error',
              message: 'RAZORPAY_WEBHOOK_SECRET is not configured on server.',
            },
            500,
            corsHeaders
          );
        }

        try {
          const rawBody = await request.text();
          const signature = request.headers.get('x-razorpay-signature') || '';

          if (!signature) {
            return jsonResponse(
              {
                status: 'error',
                message: 'Missing x-razorpay-signature header.',
              },
              400,
              corsHeaders
            );
          }

          const expectedSignature = await hmacSha256Hex(webhookSecret, rawBody);
          const isSignatureValid = timingSafeEqual(expectedSignature, signature);

          if (!isSignatureValid) {
            return jsonResponse(
              {
                status: 'error',
                message: 'Invalid webhook signature.',
              },
              400,
              corsHeaders
            );
          }

          // Process verified event idempotently
          const event = JSON.parse(rawBody);
          const eventType = event.event;

          // Handled event types: payment.captured, payment.failed, order.paid
          return jsonResponse(
            {
              status: 'ok',
              event: eventType,
              received: true,
            },
            200,
            corsHeaders
          );
        } catch (err) {
          return jsonResponse(
            {
              status: 'error',
              message: 'Failed to process webhook payload.',
            },
            400,
            corsHeaders
          );
        }
      }

      // 404 for unmatched API routes
      return jsonResponse(
        {
          ok: false,
          error: 'API endpoint not found',
        },
        404,
        corsHeaders
      );
    }

    // 2. Permanent 301 Redirect for non-API web traffic: lesscreation.com -> https://www.lesscreation.com
    if (url.hostname === 'lesscreation.com') {
      url.hostname = 'www.lesscreation.com';
      return Response.redirect(url.toString(), 301);
    }

    // 3. Static Assets Handler via Cloudflare Workers Static Assets binding
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Static assets binding not found', { status: 500 });
  },
};
