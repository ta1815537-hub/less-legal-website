import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { AppMockupPreview } from '../components/AppMockupPreview';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, 
  FileText, Calendar, Compass, Calculator, 
  BookMarked, Scale, Lock, CheckCircle2, 
  Layers, Smartphone, Check
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 sm:space-y-28 py-8 sm:py-12 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Official Android App Platform</span>
              <span className="text-indigo-400">•</span>
              <span className="text-slate-600 font-medium">Utility & Reference Suite</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                LESS LEGAL
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Legal Knowledge + Useful Digital Tools in One App
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Less Legal is an Android application designed to bring useful legal resources, practical utilities, PDF tools, calculation hubs, and everyday digital productivity tools together in one lightweight, intuitive interface.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-cta-download"
                onClick={() => onNavigate('download')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-200 flex items-center justify-center gap-3 group"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Less Legal</span>
              </button>

              <button
                id="hero-cta-features"
                onClick={() => onNavigate('features')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-md shadow-slate-200/50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Key Factual Trust Points */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">On-Device Processing</div>
                  <div className="text-[11px] text-slate-500">PDFs processed locally</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">No Recurring Billing</div>
                  <div className="text-[11px] text-slate-500">Fixed one-time passes</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-xs flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Independent Utility</div>
                  <div className="text-[11px] text-slate-500">Unbiased reference app</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Neomorphic App Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <AppMockupPreview />
          </div>

        </div>
      </section>

      {/* 2. CORE VALUE HIGHLIGHTS */}
      <section className="bg-slate-100/70 py-14 sm:py-16 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Why Less Legal
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Advocates, Students & Everyday Citizens
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Combining essential day-to-day productivity tools with fast offline legal references.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="neo-box p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Document & PDF Tools</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Merge multiple case records, split petitions, compress file sizes, and view PDFs on-device without relying on external cloud storage.
              </p>
            </div>

            {/* Card 2 */}
            <div className="neo-box p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Personal Case Diary</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maintain hearing schedules, next court dates, procedural stage records, and client notes in a dedicated organizer.
              </p>
            </div>

            {/* Card 3 */}
            <div className="neo-box p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Calculators & Converters</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculate court fee estimations, compute financial interests, and convert regional Indian land units (Bigha, Guntha, Acre, Kanal).
              </p>
            </div>

            {/* Card 4 */}
            <div className="neo-box p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Bare Acts & Glossary</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant reference to core Indian Bare Acts, Latin maxims, legal terms, and curated foundational legal courses.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FEATURED TOOLS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Verified Toolset
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              What You Get Inside Less Legal
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              All tools are built specifically for Android to deliver fast, responsive utility performance.
            </p>
          </div>

          <button
            onClick={() => onNavigate('features')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View all 16 features</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: PDF Tools & Less Share */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  PDF & Files
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">PDF Tools & Less Share</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Merge documents, split large filings, password-protect confidential paperwork, and share files directly device-to-device.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Merge & Split PDFs securely on-device</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Fast PDF Reader with bookmarks & search</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Less Share local direct device file transfer</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-indigo-600 font-semibold flex items-center justify-between">
              <span>On-device processing</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Feature 2: Case Diary & Quick Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                  Legal Utilities
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Case Diary & Schedule</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Personal daily planner to organize case stages, hearing dates, client notes, and quick legal memos.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Court hearing schedules & case stage notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Quick Notes for instant memo drafting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Important official court and legal links</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-purple-600 font-semibold flex items-center justify-between">
              <span>Daily Practice Organizer</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
          </div>

          {/* Feature 3: Calculators & Bare Acts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Calculators & Laws
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Calculators & Knowledge</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Specialized converters for regional land area units, court fee estimates, Bare Acts library, and legal maxims glossary.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Land unit conversion (Bigha, Guntha, Acre, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Court fee calculations & interest math</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Statutory Bare Acts & Legal Glossary</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-blue-600 font-semibold flex items-center justify-between">
              <span>Instant Conversion</span>
              <Calculator className="w-4 h-4 text-blue-600" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. TRANSPARENT PREMIUM PASSES PREVIEW */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upgrade to Ad-Free Experience
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Enjoy uninterrupted access to all tools and resources with fixed-validity one-time passes. No auto-renewing subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            
            {/* Plan 1: 3 Months */}
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-300">3 Months Access</span>
                  <span className="text-xs text-indigo-300 font-semibold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    90 Days Pass
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">₹59</span>
                  <span className="text-xs text-slate-400">/ one-time payment</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Provides 100% ad-free experience across all utility tools for 3 full months.
                </p>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Ad-free tool navigation & PDF utilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>One-time purchase (No auto-debit)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/80">
                <button
                  onClick={() => onNavigate('premium')}
                  className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors text-center"
                >
                  View Plan Details & Terms
                </button>
              </div>
            </div>

            {/* Plan 2: 1 Year */}
            <div className="bg-gradient-to-b from-indigo-900/60 to-slate-800/90 rounded-2xl p-6 border-2 border-indigo-500 shadow-2xl relative flex flex-col justify-between">
              <div className="absolute -top-3 right-6 bg-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                Best Value
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-indigo-200">1 Year Access</span>
                  <span className="text-xs text-emerald-300 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    365 Days Pass
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">₹179</span>
                  <span className="text-xs text-slate-400">/ one-time payment</span>
                </div>
                <p className="text-xs text-slate-300 mb-6">
                  Provides 100% ad-free experience across all utility tools for 1 full year.
                </p>
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ad-free tool navigation & PDF utilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>365 days uninterrupted validity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>One-time purchase (No auto-debit)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/80">
                <button
                  onClick={() => onNavigate('premium')}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors text-center"
                >
                  View Plan Details & Terms
                </button>
              </div>
            </div>

          </div>

          <div className="pt-2 text-xs text-slate-400">
            Purchases are made securely inside the Android application via certified payment gateway (PayU / Play Store).
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION & DOWNLOAD HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="neo-box p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
            <Smartphone className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Get Started with Less Legal
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Download the official Android application to access legal reference resources, PDF tools, and calculators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('download')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download for Android</span>
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
            >
              About Less Legal
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span>Minimum: Android 7.0+</span>
            <span>•</span>
            <span>Target: Mobile & Tablet</span>
            <span>•</span>
            <span>Independent & Factual</span>
          </div>
        </div>
      </section>

    </div>
  );
};
