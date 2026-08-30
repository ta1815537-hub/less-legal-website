import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Shield, Lock, FileText, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
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
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Security Commitment</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy for Less Legal Android App
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-700/80">
          <span>Effective Date: March 1, 2025</span>
          <span>•</span>
          <span>Last Updated: March 2025</span>
          <span>•</span>
          <span>Application: Less Legal (Android)</span>
        </div>
      </div>

      {/* Summary Highlight Box */}
      <div className="bg-indigo-50/70 rounded-2xl p-6 border border-indigo-100 space-y-2 text-xs text-indigo-950">
        <div className="font-bold text-sm text-indigo-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Core Privacy Summary</span>
        </div>
        <p className="leading-relaxed">
          Less Legal is committed to transparent, minimal data practices. Your sensitive files (PDFs, case notes, diary records) are processed locally on your Android device. We do NOT sell your personal data. Payment transactions for ad-free passes are handled securely by certified payment processors (PayU / Google Play Billing).
        </p>
      </div>

      {/* Policy Content Sections */}
      <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 space-y-8 text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            1. Introduction & Scope
          </h2>
          <p>
            This Privacy Policy describes how <strong>Less Legal</strong> ("we", "our", or "the application") handles information when you install, access, or use our mobile application on the Android operating system and visit our official website.
          </p>
          <p>
            By downloading or using Less Legal, you agree to the collection and use of information in accordance with this policy. If you do not agree with any terms of this policy, please do not use the application.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            2. Information We Collect
          </h2>
          <p>
            We collect only the minimum information necessary to provide application functionality and security:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Authentication & Account Information:</strong> If you choose to sign in via Google Authentication or Firebase Auth, we receive basic profile details such as your display name, email address, and unique user ID to maintain your account state and purchase records.
            </li>
            <li>
              <strong>Device & Diagnostic Data:</strong> Automatic technical metrics including device model, operating system version, unique device identifiers (for AdMob / Firebase analytics), crash logs, and network connection status to ensure app stability.
            </li>
            <li>
              <strong>App Usage Preferences:</strong> Non-sensitive application configuration preferences such as bookmark states, theme settings, and tool configuration.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            3. On-Device File & PDF Processing
          </h2>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">Your documents remain strictly on your device:</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When you use our PDF Tools (Merge, Split, Compress, Lock/Unlock) or the PDF Reader, document processing occurs natively on your Android device's hardware. <strong>Less Legal does NOT upload, store, or transmit the contents of your PDF files to external cloud servers.</strong>
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            4. Less Share Local File Transfer
          </h2>
          <p>
            The Less Share feature utilizes direct local connectivity (Wi-Fi hotspot / local network protocol) to transfer files directly between paired devices. Files transferred via Less Share do not pass through or get logged on remote servers.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            5. Payment & Transaction Information
          </h2>
          <p>
            When purchasing a Premium Pass (₹59 for 3 Months or ₹179 for 1 Year), financial transactions are processed by certified third-party payment gateways including <strong>PayU Payments Private Limited</strong> and/or <strong>Google Play Billing</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>No Card Storage by Less Legal:</strong> Less Legal never collects, processes, or stores your credit/debit card numbers, UPI PINs, CVV codes, or net banking passwords. All payment authorization occurs on PCI-DSS certified gateway environments.
            </li>
            <li>
              <strong>Transaction Confirmation Records:</strong> We receive only non-sensitive order confirmation details (such as Transaction ID, timestamp, plan purchased, and payment status) to activate and verify your ad-free pass.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            6. Advertising & Google AdMob
          </h2>
          <p>
            The free version of Less Legal displays third-party advertisements served by Google AdMob. Google AdMob may use advertising identifiers (such as Google Advertising ID / AAID) and cookies to serve contextual advertisements. Users who purchase an active Premium Pass enjoy a 100% ad-free experience for the validity period.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            7. Third-Party Service Providers
          </h2>
          <p>
            We may employ third-party services for essential infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Google Play Services:</strong> Core Android system integration & billing</li>
            <li><strong>Firebase (Google LLC):</strong> Authentication and crash reporting</li>
            <li><strong>Google AdMob:</strong> Banner and interstitial ad delivery (free tier only)</li>
            <li><strong>PayU Payments:</strong> Secure payment gateway processing</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            8. Data Security & Storage
          </h2>
          <p>
            We employ commercially reasonable technical and administrative safeguards to protect any data collected against unauthorized access, loss, or misuse. All network communications with authentication or verification servers utilize secure HTTPS / TLS encryption.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            9. User Rights & Data Deletion
          </h2>
          <p>
            You have the right to request access to or deletion of your account and associated transaction verification records. To request account data removal, please contact our support team or use the account deletion option inside the app settings.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            10. Children's Privacy
          </h2>
          <p>
            Less Legal is designed for general audiences, students, and legal practitioners. We do not knowingly collect personal identifiable information from children under the age of 13. If you become aware that a child has provided us with personal data, please contact us for immediate removal.
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/80 pb-2">
            11. Contact for Privacy Inquiries
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Grievance Officer via our <button onClick={() => onNavigate('contact')} className="text-indigo-600 font-bold underline">Contact Page</button>
            {hasEmail && <> or email us directly at <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-indigo-600 font-bold underline">{SITE_CONFIG.supportEmail}</a></>}.
          </p>
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('terms')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          Read Terms & Conditions →
        </button>
        <button
          onClick={() => onNavigate('refund')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          Read Refund & Cancellation Policy →
        </button>
      </div>

    </div>
  );
};
