/**
 * PRICING SERVICE & MONETIZATION ADAPTER LAYER — LESS CREATION
 * 
 * CRITICAL ARCHITECTURE RULE:
 * This layer is an additive adapter above the locked production Razorpay core.
 * It reuses `createRazorpayOrder`, `verifyRazorpayPayment`, and `saveActiveMembership`
 * without modifying their implementation or backend webhook.
 */

import { SITE_CONFIG } from '../config';
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  loadRazorpaySDK, 
  saveActiveMembership, 
  getCachedMembership 
} from '../utils/razorpayClient';
import { ActivatedMembership } from '../types';

export interface PricingPlan {
  id: string;
  name: string;
  nameHi?: string;
  badge?: string;
  priceFormatted: string;
  priceNumber: number;
  period: string;
  periodHi?: string;
  description: string;
  descriptionHi?: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
  ctaLabelHi?: string;
  planCode: string;
  validityDays: number;
}

// Configurable pricing plans (Default includes the production verified Lifetime pass of ₹99)
export const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan_free',
    name: 'Free Basic',
    nameHi: 'मुफ्त बेसिक',
    priceFormatted: '₹0',
    priceNumber: 0,
    period: 'forever',
    periodHi: 'हमेशा के लिए',
    description: 'Essential everyday tools for quick tasks with 100% on-device privacy.',
    descriptionHi: 'दैनिक कार्यों के लिए आवश्यक टूल्स और पूर्ण गोपनीयता।',
    features: [
      'Access to 40+ utility tools',
      '100% on-device browser processing',
      'No account needed for basic use',
      'Generous 50 operations per day',
      'Standard document checklists',
      'Community support'
    ],
    ctaLabel: 'Start Free',
    ctaLabelHi: 'मुफ्त शुरू करें',
    planCode: 'FREE',
    validityDays: 36500,
  },
  {
    id: 'PREMIUM_PERMANENT',
    name: 'Less Pro (Lifetime)',
    nameHi: 'लेस प्रो (आजीवन पास)',
    badge: 'Best Value • Most Popular',
    priceFormatted: '₹99',
    priceNumber: 99,
    period: 'one-time',
    periodHi: 'एकमुश्त',
    description: 'Permanent lifetime access to all advanced tools and flagship Less Legal features.',
    descriptionHi: 'सभी उन्नत टूल्स और फ्लैगशिप सुविधाओं तक स्थायी पहुंच।',
    isPopular: true,
    features: [
      'Unlimited daily operations across all tools',
      'Batch processing for PDF & image tools',
      'Zero ads & zero distractions forever',
      'Less Legal Flagship Android Lifetime Pass',
      'Ad-free Bare Acts & Case Diary tracker',
      'Priority access to all upcoming utilities',
      'No recurring subscriptions or hidden fees'
    ],
    ctaLabel: 'Get Lifetime Pass — ₹99',
    ctaLabelHi: 'आजीवन पास लें — ₹99',
    planCode: 'PREMIUM_PERMANENT',
    validityDays: -1, // Permanent
  },
  {
    id: 'plan_business',
    name: 'Business & Teams',
    nameHi: 'बिजनेस और टीम्स',
    badge: 'For Professionals',
    priceFormatted: '₹499',
    priceNumber: 499,
    period: 'annual',
    periodHi: 'वार्षिक',
    description: 'Tailored for law firms, CAs, agencies, and small business practices.',
    descriptionHi: 'लॉ फर्म्स, सीए, एजेंसियों और पेशेवरों के लिए विशेष पैकेज।',
    features: [
      'Everything in Pro Lifetime',
      'Featured verified listing in directory',
      'Team multi-device sharing pass',
      'Commercial drafting templates pack',
      'Custom watermark & branding in exports',
      'Priority email & WhatsApp support'
    ],
    ctaLabel: 'Upgrade to Business',
    ctaLabelHi: 'बिजनेस में अपग्रेड करें',
    planCode: 'BUSINESS_ANNUAL',
    validityDays: 365,
  }
];

export const pricingService = {
  /**
   * Returns current active plans
   */
  getPlans(): PricingPlan[] {
    return DEFAULT_PRICING_PLANS;
  },

  /**
   * Returns the current user's active membership if any
   */
  getCurrentMembership(): ActivatedMembership | null {
    return getCachedMembership();
  },

  /**
   * Initiates payment for a selected plan via the existing Razorpay flow
   */
  async purchasePlan(
    plan: PricingPlan,
    userInfo: { name?: string; email?: string; phone?: string; userId?: string },
    onSuccess: (membership: ActivatedMembership) => void,
    onError: (errMsg: string) => void
  ): Promise<void> {
    if (plan.priceNumber === 0) {
      // Free plan
      return;
    }

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
      }

      // 2. Create order using existing production backend endpoint
      // Using 'PREMIUM_PERMANENT' to connect with existing Razorpay order backend
      const orderResponse = await createRazorpayOrder('PREMIUM_PERMANENT', {
        userId: userInfo.userId || '',
        userEmail: userInfo.email || '',
        userPhone: userInfo.phone || '',
      });

      if (!orderResponse.ok || !orderResponse.order_id) {
        throw new Error(orderResponse.error || 'Failed to initialize Razorpay order.');
      }

      // 3. Open Razorpay Standard Checkout UI
      const options = {
        key: orderResponse.key_id,
        amount: orderResponse.amount,
        currency: orderResponse.currency || 'INR',
        name: SITE_CONFIG.companyName || 'Less Creation',
        description: `${plan.name} (${orderResponse.plan_name || 'Lifetime Pass'})`,
        image: '/app_logo_512x512-3.png',
        order_id: orderResponse.order_id,
        prefill: {
          name: userInfo.name || '',
          email: userInfo.email || '',
          contact: userInfo.phone || '',
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: () => {
            onError('Payment window was closed before completion.');
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify signature on existing backend
            const verification = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: orderResponse.plan_id || 'PREMIUM_PERMANENT',
              userId: userInfo.userId || '',
              userEmail: userInfo.email || '',
            });

            if (verification.verified && verification.membership) {
              await saveActiveMembership(verification.membership);
              onSuccess(verification.membership);
            } else {
              throw new Error(verification.error || 'Payment signature could not be verified on server.');
            }
          } catch (err: any) {
            onError(err.message || 'Payment verification failed.');
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      onError(err.message || 'An error occurred while launching payment.');
    }
  }
};
