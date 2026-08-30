import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { FileText, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
          <FileText className="w-3.5 h-3.5" />
          <span>Service Agreement</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-700/80">
          <span>Effective Date: March 1, 2025</span>
          <span>•</span>
          <span>Last Updated: March 2025</span>
          <span>•</span>
          <span>Application: Less Legal (Android)</span>
        </div>
      </div>

      {/* Prominent Legal Advice Disclaimer in Terms */}
      <div className="bg-amber-50/90 rounded-2xl p-6 border border-amber-200 space-y-2 text-xs text-amber-950">
        <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Informational Utility & No Legal Advice Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          The materials, Bare Acts, calculation tools, court fee estimators, and guides provided within Less Legal are for general reference and educational purposes only. Less Legal does not provide legal advice, representation, or formal legal opinions. No advocate-client relationship is formed. Users must independently verify statutory provisions with qualified legal professionals.
        </p>
      </div>

      {/* Terms Content */}
      <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 space-y-8 text-sm leading-relaxed">
        
        {/* 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By downloading, installing, accessing, or using the <strong>Less Legal</strong> Android application or this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of the application immediately.
          </p>
        </section>

        {/* 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            2. Permitted Use & User Responsibilities
          </h2>
          <p>
            You are granted a non-exclusive, non-transferable, revocable license to use Less Legal strictly for personal, educational, or professional utility purposes on your compatible Android device. You agree that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You will not reverse engineer, decompile, or disassemble any part of the application binary.</li>
            <li>You will not use the app for any unlawful purpose or to process documents that violate applicable laws.</li>
            <li>You are solely responsible for maintaining the confidentiality of your device and any notes or case diary data stored on it.</li>
          </ul>
        </section>

        {/* 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            3. Premium Passes & Billing Terms
          </h2>
          <p>
            Less Legal offers optional paid Premium Passes providing an ad-free interface and full utility access:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Available Passes:</strong> ₹59 for 3 Months (90 days validity) and ₹179 for 1 Year (365 days validity).
            </li>
            <li>
              <strong>One-Time, Non-Recurring Purchases:</strong> Passes are one-time payments for a fixed validity duration. They are <strong>NOT</strong> automatically renewing subscriptions. We do not store payment instruments or perform recurring debits.
            </li>
            <li>
              <strong>Expiration & Reversion:</strong> Upon expiration of the validity period, the account automatically reverts to standard ad-supported access unless a new pass is manually purchased by the user.
            </li>
            <li>
              <strong>No Lifetime Claims:</strong> Less Legal does not sell lifetime access passes. Validity is strictly tied to the purchased plan duration.
            </li>
          </ul>
        </section>

        {/* 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            4. Payment Gateway & Transaction Processing
          </h2>
          <p>
            Payments are processed through authorized payment intermediaries including <strong>PayU</strong> and/or <strong>Google Play Billing</strong>. By completing a transaction, you agree to the payment provider's terms of service. Less Legal does not store sensitive cardholder data.
          </p>
        </section>

        {/* 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            5. Intellectual Property
          </h2>
          <p>
            All application software code, user interface designs, logos, graphics, and compilation of tools are the intellectual property of Less Legal. Public statutory Bare Acts and official court links referenced within the app belong to their respective governmental and public domain repositories.
          </p>
        </section>

        {/* 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, Less Legal and its developers shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The use or inability to use the application or its calculation tools.</li>
            <li>Any discrepancies in court fee estimations, land unit conversions, or statutory text.</li>
            <li>Loss of local case diary records or notes resulting from device malfunction or data clearing.</li>
          </ul>
        </section>

        {/* 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            7. Modifications to Service & Terms
          </h2>
          <p>
            We reserve the right to modify or discontinue features, tools, or these terms to reflect updates in laws or app functionality. Notice of material changes will be indicated by the "Last Updated" date at the top of this page.
          </p>
        </section>

        {/* 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            8. Governing Law & Dispute Resolution
          </h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('privacy')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          ← Read Privacy Policy
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          Read Refund Policy →
        </button>
      </div>

    </div>
  );
};
