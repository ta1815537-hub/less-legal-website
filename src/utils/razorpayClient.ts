import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ActivatedMembership, RazorpayOrderResponse, RazorpayVerificationResponse } from '../types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const LOCAL_STORAGE_MEMBERSHIP_KEY = 'less_legal_active_membership';

/**
 * Dynamically loads the Razorpay Standard Checkout JS SDK if not already loaded.
 */
export function loadRazorpaySDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates order creation on the server (Cloudflare Worker backend).
 */
export async function createRazorpayOrder(
  planId: string,
  userInfo?: { userId?: string; userEmail?: string; userPhone?: string }
): Promise<RazorpayOrderResponse> {
  const response = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      planId,
      userId: userInfo?.userId || '',
      userEmail: userInfo?.userEmail || '',
      userPhone: userInfo?.userPhone || '',
    }),
  });

  const data = await response.json().catch(() => ({
    ok: false,
    error: 'Failed to parse order response from server.',
  }));

  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Failed to initialize payment order with server.');
  }

  return data as RazorpayOrderResponse;
}

/**
 * Verifies signature and payment status on server (Cloudflare Worker backend).
 */
export async function verifyRazorpayPayment(payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  planId: string;
  userId?: string;
  userEmail?: string;
}): Promise<RazorpayVerificationResponse> {
  const response = await fetch('/api/razorpay/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({
    ok: false,
    verified: false,
    error: 'Failed to parse verification response from server.',
  }));

  if (!response.ok || !data.ok || !data.verified) {
    throw new Error(data.error || 'Payment verification failed on server.');
  }

  return data as RazorpayVerificationResponse;
}

/**
 * Stores active membership into Firestore & local cache
 */
export async function saveActiveMembership(membership: ActivatedMembership): Promise<ActivatedMembership> {
  // 1. Cache locally for instant UI reflection
  try {
    localStorage.setItem(LOCAL_STORAGE_MEMBERSHIP_KEY, JSON.stringify(membership));
  } catch {}

  // 2. Persist to Firestore memberships & payment_transactions collections
  try {
    const docRef = await addDoc(collection(db, 'memberships'), {
      ...membership,
      timestamp: new Date().toISOString(),
    });

    await addDoc(collection(db, 'payment_transactions'), {
      razorpayOrderId: membership.razorpayOrderId,
      razorpayPaymentId: membership.razorpayPaymentId,
      planId: membership.planId,
      planCode: membership.planCode,
      amount: membership.amount,
      currency: membership.currency,
      userEmail: membership.userEmail || '',
      userId: membership.userId || '',
      status: 'SUCCESS',
      paymentMethod: membership.paymentMethod || 'online',
      timestamp: new Date().toISOString(),
    });

    return {
      ...membership,
      firestoreDocId: docRef.id,
    };
  } catch (err) {
    console.warn('Could not write membership directly to Firestore (cached locally):', err);
    return membership;
  }
}

/**
 * Retrieve cached active membership from local storage if not expired
 */
export function getCachedMembership(): ActivatedMembership | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEMBERSHIP_KEY);
    if (!raw) return null;
    const mem: ActivatedMembership = JSON.parse(raw);
    if (new Date(mem.expiryDate).getTime() > Date.now()) {
      return mem;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Search active pass / membership status across Firestore by email, userId, or razorpay payment ID
 */
export async function checkMembershipStatus(
  searchQuery: string
): Promise<ActivatedMembership | null> {
  const queryClean = searchQuery.trim().toLowerCase();
  if (!queryClean) return null;

  // Check local cache first
  const localMem = getCachedMembership();
  if (
    localMem &&
    (localMem.userEmail?.toLowerCase() === queryClean ||
      localMem.userId?.toLowerCase() === queryClean ||
      localMem.razorpayOrderId?.toLowerCase() === queryClean ||
      localMem.razorpayPaymentId?.toLowerCase() === queryClean)
  ) {
    return localMem;
  }

  // Query Firestore
  try {
    const q = query(collection(db, 'memberships'));
    const snapshot = await getDocs(q);
    let found: ActivatedMembership | null = null;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as ActivatedMembership;
      const matchEmail = (data.userEmail || '').toLowerCase() === queryClean;
      const matchUserId = (data.userId || '').toLowerCase() === queryClean;
      const matchOrder = (data.razorpayOrderId || '').toLowerCase() === queryClean;
      const matchPayment = (data.razorpayPaymentId || '').toLowerCase() === queryClean;

      if (matchEmail || matchUserId || matchOrder || matchPayment) {
        // Pick the newest or active one
        if (!found || new Date(data.expiryDate).getTime() > new Date(found.expiryDate).getTime()) {
          found = {
            ...data,
            firestoreDocId: docSnap.id,
          };
        }
      }
    });

    if (found) {
      if (new Date(found.expiryDate).getTime() > Date.now()) {
        found.status = 'ACTIVE';
        try {
          localStorage.setItem(LOCAL_STORAGE_MEMBERSHIP_KEY, JSON.stringify(found));
        } catch {}
      } else {
        found.status = 'EXPIRED';
      }
      return found;
    }
  } catch (err) {
    console.error('Error fetching membership from Firestore:', err);
  }

  return null;
}
