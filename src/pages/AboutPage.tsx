import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Scale, ShieldCheck, FileCheck, Lock, Smartphone, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
          <Scale className="w-3.5 h-3.5" />
          <span>About Less Legal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Purpose, Utility & Philosophy
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {SITE_CONFIG.shortDescription}
        </p>
      </div>

      {/* Non-Governmental Affiliation Declaration (Prominent & Factual) */}
      <div className="p-6 sm:p-8 bg-amber-50/80 rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-amber-950">
            Official Independence & Non-Government Declaration
          </h2>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">
          <strong>Less Legal is an independent software application</strong> developed to provide digital utilities, calculators, and educational legal reference materials.
        </p>
        <p className="text-xs text-amber-800 leading-relaxed">
          Less Legal is <strong>NOT</strong> affiliated with, associated with, authorized by, endorsed by, or in any way officially connected to the Government of India, the Supreme Court of India, any High Court, District Court, Bar Council, or any ministry or department of the central or state governments. All official government portal links provided in the app are purely informational shortcuts to public resources.
        </p>
      </div>

      {/* What Less Legal Does */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        <div className="neo-box p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              What is Less Legal?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Less Legal was created to bridge the gap between complex legal workflows and everyday digital convenience. Rather than juggling multiple standalone apps for file operations, fee calculations, hearing schedules, and statutory lookups, Less Legal combines them into a cohesive Android utility suite.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Native Android performance and layout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Optimized for low-bandwidth and offline usability</span>
            </div>
          </div>
        </div>

        <div className="neo-box p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Privacy & Local Processing
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Legal documents and notes are sensitive. Less Legal is engineered with an on-device architecture: PDF merging, splitting, reading, and notes are processed directly on your Android hardware rather than transmitted to remote servers.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No unauthorized cloud uploading of private PDFs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Encrypted local direct device sharing via Less Share</span>
            </div>
          </div>
        </div>

      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Our Core Principles</h2>
          <p className="text-sm text-slate-600">Built around utility, transparency, and accuracy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Factual Transparency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We present factual statutory references, exact formulas for calculations, and straightforward descriptions of what each feature can and cannot do.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Honest Pricing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ad-free access is offered through transparent one-time passes (₹59 for 3 Months or ₹179 for 1 Year). We never perform hidden recurring subscription debits.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Advisory Substitution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Less Legal provides informational tools and calculation utilities. We explicitly remind users that no digital tool replaces qualified legal counsel for active litigation.
            </p>
          </div>

        </div>
      </div>

      {/* Call to actions */}
      <div className="p-8 bg-slate-900 text-white rounded-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Explore Less Legal Tools</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Review our complete catalog of verified features or download the app on Android.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('features')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Explore All Features
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
          >
            Contact & Support
          </button>
        </div>
      </div>

    </div>
  );
};
