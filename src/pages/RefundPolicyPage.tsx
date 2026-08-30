import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { RefreshCw, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';

interface RefundPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb & Title */}
      <div className="space-y-4 relative z-10 text-center sm:text-left">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#D8BD82]/30 text-[#D8BD82] text-xs font-bold">
          <RefreshCw className="w-3.5 h-3.5 text-[#E03A3E]" />
          <span>Consumer Protection & Refund Terms</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EE] tracking-tight">
          Refund & Cancellation Policy
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#77736F] pb-4 border-b border-white/10">
          <span>Effective Date: March 1, 2025</span>
          <span>•</span>
          <span>Last Updated: March 2025</span>
          <span>•</span>
          <span>Payment Gateways: PayU / Google Play</span>
        </div>
      </div>

      {/* Overview Notice */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2 text-xs text-[#B8B3AF] relative z-10">
        <div className="font-bold text-sm text-[#F5F2EE] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D8BD82]" />
          <span>Policy Summary for Premium Passes</span>
        </div>
        <p className="leading-relaxed">
          Less Legal provides digital passes granting ad-free access for a specified validity period. Because digital pass activation delivers immediate value, refunds are governed by transparent technical eligibility criteria described below.
        </p>
      </div>

      {/* Refund Guidelines by Plan */}
      <div className="space-y-6 relative z-10 text-[#B8B3AF]">
        <h2 className="text-xl font-bold text-[#F5F2EE] border-b border-white/10 pb-2">
          1. Applicability to Premium Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Plan 1 */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#F5F2EE] text-sm">3 Months Pass (₹59)</h3>
              <span className="text-[11px] font-bold text-[#D8BD82] bg-[#D8BD82]/15 px-2.5 py-0.5 rounded-full border border-[#D8BD82]/30">
                90 Days
              </span>
            </div>
            <p className="text-xs text-[#B8B3AF] leading-relaxed">
              One-time non-recurring purchase. Non-refundable once successfully activated on the user's account and used without verified technical disruption.
            </p>
          </div>

          {/* Plan 2 */}
          <div className="glass-panel-crimson p-5 rounded-3xl border border-[#C21F2F]/40 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#F5F2EE] text-sm">1 Year Pass (₹179)</h3>
              <span className="text-[11px] font-bold text-[#D8BD82] bg-[#D8BD82]/20 px-2.5 py-0.5 rounded-full border border-[#D8BD82]/40">
                365 Days
              </span>
            </div>
            <p className="text-xs text-[#B8B3AF] leading-relaxed">
              One-time non-recurring purchase. Non-refundable once activated, except in verified cases of duplicate billing or non-activation.
            </p>
          </div>

        </div>
      </div>

      {/* Eligible Refund Scenarios */}
      <div className="space-y-4 relative z-10 text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-[#F5F2EE] border-b border-white/10 pb-2">
          2. Eligible Refund Conditions
        </h2>
        <p className="text-xs text-[#B8B3AF] leading-relaxed">
          You may request a full refund or pass restoration under the following verified technical conditions:
        </p>

        <div className="space-y-3 text-xs text-[#B8B3AF]">
          <div className="flex items-start gap-2.5 p-4 glass-panel rounded-2xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#D8BD82] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F2EE] block mb-0.5">Duplicate / Multiple Charges:</strong>
              If your bank account or UPI was debited more than once for the same transaction due to a network glitch during checkout, the excess charge will be refunded.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-4 glass-panel rounded-2xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#D8BD82] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#F5F2EE] block mb-0.5">Payment Debited but Pass Not Activated:</strong>
              If your payment was successfully processed by PayU / Google Play but the ad-free pass failed to activate within 24 hours and our technical team cannot manually provision it, a full refund will be initiated.
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="space-y-4 relative z-10 text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-[#F5F2EE] border-b border-white/10 pb-2">
          3. Cancellation Rules (No Auto-Debits)
        </h2>
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2 text-xs text-[#B8B3AF]">
          <p>
            Because Less Legal passes are <strong className="text-[#F5F2EE]">one-time fixed-duration purchases</strong> and NOT auto-renewing subscriptions, there is no recurring monthly or annual billing cycle that requires future cancellation.
          </p>
          <p>
            Once your validity period concludes (90 or 365 days), your account automatically returns to standard access without any cancellation action needed from you.
          </p>
        </div>
      </div>

      {/* How to Request Refund */}
      <div className="space-y-4 relative z-10 text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-[#F5F2EE] border-b border-white/10 pb-2">
          4. How to Request a Refund or Rectification
        </h2>
        <p className="text-xs text-[#B8B3AF] leading-relaxed">
          To initiate a refund request for an eligible transaction, please submit a request within <strong className="text-[#F5F2EE]">7 days</strong> of the transaction date with the following details:
        </p>

        <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#B8B3AF]">
          <li>Your registered account email address in Less Legal.</li>
          <li>The payment gateway Transaction ID / Order ID (from PayU or Play Store receipt).</li>
          <li>Date and amount of the transaction (₹59 or ₹179).</li>
          <li>Brief explanation of the technical issue encountered.</li>
        </ul>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-3 rounded-xl btn-crimson text-white font-bold text-xs shadow-md transition-colors"
          >
            Submit Refund Request via Support
          </button>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="space-y-3 relative z-10 text-[#B8B3AF]">
        <h2 className="text-lg font-bold text-[#F5F2EE] border-b border-white/10 pb-2">
          5. Refund Processing Timeline
        </h2>
        <p className="text-xs text-[#B8B3AF] leading-relaxed">
          Approved refunds are processed through the original payment method via the payment gateway (PayU / Google Play). Depending on your issuing bank or payment provider, the refunded amount typically reflects in your source account within <strong className="text-[#F5F2EE]">5 to 7 business days</strong>.
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-[#D8BD82] hover:text-white"
        >
          ← Read Terms & Conditions
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-[#D8BD82] hover:text-white"
        >
          Contact Support Desk →
        </button>
      </div>

    </div>
  );
};
