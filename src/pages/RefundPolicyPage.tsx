import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { RefreshCw, ArrowLeft, ShieldCheck, Mail, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface RefundPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Top Breadcrumb & Title */}
      <div className="space-y-4">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          <span>Consumer Protection & Refund Terms</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Refund & Cancellation Policy
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
          <span>Effective Date: March 1, 2025</span>
          <span>•</span>
          <span>Last Updated: March 2025</span>
          <span>•</span>
          <span>Payment Gateways: PayU / Google Play</span>
        </div>
      </div>

      {/* Overview Notice */}
      <div className="bg-slate-100/90 rounded-2xl p-6 border border-slate-200 space-y-2 text-xs text-slate-800">
        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Policy Summary for Premium Passes</span>
        </div>
        <p className="leading-relaxed">
          Less Legal provides digital passes granting ad-free access for a specified validity period. Because digital pass activation delivers immediate value, refunds are governed by transparent technical eligibility criteria described below.
        </p>
      </div>

      {/* Refund Guidelines by Plan */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
          1. Applicability to Premium Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plan 1 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">3 Months Pass (₹59)</h3>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                90 Days
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              One-time non-recurring purchase. Non-refundable once successfully activated on the user's account and used without verified technical disruption.
            </p>
          </div>

          {/* Plan 2 */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">1 Year Pass (₹179)</h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                365 Days
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              One-time non-recurring purchase. Non-refundable once activated, except in verified cases of duplicate billing or non-activation.
            </p>
          </div>

        </div>
      </div>

      {/* Eligible Refund Scenarios */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
          2. Eligible Refund Conditions
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          You may request a full refund or pass restoration under the following verified technical conditions:
        </p>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-3.5 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Duplicate / Multiple Charges:</strong>
              If your bank account or UPI was debited more than once for the same transaction due to a network glitch during checkout, the excess charge will be refunded.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5">Payment Debited but Pass Not Activated:</strong>
              If your payment was successfully processed by PayU / Google Play but the ad-free pass failed to activate within 24 hours and our technical team cannot manually provision it, a full refund will be initiated.
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
          3. Cancellation Rules (No Auto-Debits)
        </h2>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <p>
            Because Less Legal passes are <strong>one-time fixed-duration purchases</strong> and NOT auto-renewing subscriptions, there is no recurring monthly or annual billing cycle that requires future cancellation.
          </p>
          <p>
            Once your validity period concludes (90 or 365 days), your account automatically returns to standard access without any cancellation action needed from you.
          </p>
        </div>
      </div>

      {/* How to Request Refund */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
          4. How to Request a Refund or Rectification
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          To initiate a refund request for an eligible transaction, please submit a request within <strong>7 days</strong> of the transaction date with the following details:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
          <li>Your registered account email address in Less Legal.</li>
          <li>The payment gateway Transaction ID / Order ID (from PayU or Play Store receipt).</li>
          <li>Date and amount of the transaction (₹59 or ₹179).</li>
          <li>Brief explanation of the technical issue encountered.</li>
        </ul>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Submit Refund Request via Support
          </button>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
          5. Refund Processing Timeline
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Approved refunds are processed through the original payment method via the payment gateway (PayU / Google Play). Depending on your issuing bank or payment provider, the refunded amount typically reflects in your source account within <strong>5 to 7 business days</strong>.
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Read Terms & Conditions
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          Contact Support Desk →
        </button>
      </div>

    </div>
  );
};
