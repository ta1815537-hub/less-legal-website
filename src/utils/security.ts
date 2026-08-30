/**
 * Security & Input Sanitization Utilities
 * Protects against XSS, Injection, Malicious URLs, and Form Spamming
 */

// 1. Sanitize plain text input against XSS
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+=/gi, '');
}

// 2. Validate and sanitize phone numbers (Digits only)
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Strip everything except numbers and plus sign
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Limit to reasonable length max 15 digits
  return cleaned.slice(0, 15);
}

// 3. Validate safe external URL
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// 4. Rate Limiter for Form Submissions (anti-bot / anti-spam)
const lastSubmissionTimes: Record<string, number> = {};

export function isRateLimited(key: string, cooldownMs: number = 3000): boolean {
  const now = Date.now();
  const lastTime = lastSubmissionTimes[key] || 0;
  if (now - lastTime < cooldownMs) {
    return true; // Is rate limited (blocked)
  }
  lastSubmissionTimes[key] = now;
  return false;
}
