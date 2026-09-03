export type PageRoute = 
  | 'home'
  | 'about'
  | 'founder'
  | 'features'
  | 'premium'
  | 'contact'
  | 'privacy'
  | 'app-privacy'
  | 'app-delete-account'
  | 'terms'
  | 'refund'
  | 'disclaimer'
  | 'download'
  | 'admin';

export interface NavItem {
  label: string;
  route: PageRoute;
  path: string;
  isPrimary?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Premium & Billing' | 'Utilities & Privacy' | 'Verification';
}

export interface ActivatedMembership {
  id?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REFUNDED';
  planId: string;
  planCode: string;
  planName: string;
  amount: number;
  amountFormatted: string;
  currency: string;
  validityDays: number;
  startDate: string;
  expiryDate: string;
  userId?: string;
  userEmail?: string;
  userContact?: string;
  paymentMethod?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  verifiedAt: string;
  firestoreDocId?: string;
}

export interface RazorpayOrderResponse {
  ok: boolean;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  plan_id: string;
  plan_code: string;
  plan_name: string;
  validity_days: number;
  receipt: string;
  error?: string;
}

export interface RazorpayVerificationResponse {
  ok: boolean;
  verified: boolean;
  membership?: ActivatedMembership;
  message?: string;
  error?: string;
}
