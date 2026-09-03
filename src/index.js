/**
 * Cloudflare Worker Entry Point for Less Legal
 * 
 * Handles:
 * 1. API routes under /api/* (e.g., /api/health, and future Razorpay routes)
 * 2. Static asset delivery via Cloudflare Workers Static Assets binding (env.ASSETS)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Routes Handler
    if (url.pathname.startsWith('/api/')) {
      // CORS Preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      // Health check endpoint
      if (url.pathname === '/api/health' && request.method === 'GET') {
        return new Response(JSON.stringify({ ok: true, service: 'less-legal-api' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
          },
        });
      }

      // Prepared API endpoints for future Razorpay integration
      // Note: No hardcoded secrets or fake logic are present.
      if (url.pathname.startsWith('/api/payment/')) {
        return new Response(JSON.stringify({
          ok: false,
          error: 'Payment endpoints are prepared. Please configure Razorpay environment variables in Cloudflare dashboard when ready.',
        }), {
          status: 501,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
          },
        });
      }

      // Default 404 for unmatched API routes
      return new Response(JSON.stringify({
        ok: false,
        error: 'API endpoint not found',
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Static Assets Handler
    // For all standard website requests, serve existing static assets directly
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Static assets binding not found', { status: 500 });
  },
};
