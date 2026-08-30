import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Scale, ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DisclaimerPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
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

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
          <Scale className="w-3.5 h-3.5 text-amber-600" />
          <span>Statutory Notice & Disclaimers</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Legal Disclaimer
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
          <span>Application: Less Legal (Android)</span>
          <span>•</span>
          <span>Scope: Educational, Reference & Digital Utility</span>
        </div>
      </div>

      {/* Non-Government Status Box */}
      <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border-2 border-amber-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-amber-950">
            Official Non-Governmental Status & Purpose Declaration
          </h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-amber-900 leading-relaxed">
          <p>
            <strong>Less Legal is an independent software application.</strong> It is not affiliated with, sponsored by, endorsed by, or operated by the Government of India, any State Government, court, tribunal, judicial department, statutory authority or other government body.
          </p>
          <p>
            Information and legal reference materials provided through the application are intended for general informational and educational purposes only and should not be treated as legal advice, legal representation or a substitute for consultation with a qualified legal professional.
          </p>
          <p>
            Users should independently verify current laws, rules, notifications, judgments and other legal information from authoritative sources before relying upon them.
          </p>
        </div>
      </div>

      {/* Main Disclaimer Points */}
      <div className="prose prose-slate max-w-none text-slate-700 space-y-8 text-sm leading-relaxed">
        
        {/* Point 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            2. General Informational & Utility Purpose Only
          </h2>
          <p>
            The content, tools, calculators, Bare Acts, legal glossary definitions, and materials provided on this website and within the Less Legal Android application are made available solely for general educational, reference, and day-to-day utility purposes.
          </p>
          <p>
            While reasonable efforts are made to keep reference information accurate and updated, statutory provisions, court fee schedules, and regional procedural rules change over time. <strong>Users are strongly advised to independently verify all statutory texts, notifications, and fee calculations with official government gazettes or authoritative court registries.</strong>
          </p>
        </section>

        {/* Point 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            3. No Formal Legal Advice or Advocate-Client Relationship
          </h2>
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-800">
            <p>
              Nothing contained in the Less Legal application or this website constitutes formal legal advice, case assessment, solicitation, or legal representation.
            </p>
            <p>
              Using the application, accessing digital tools, or communicating with our technical support team does <strong>not</strong> create an advocate-client, fiduciary, or confidential advisory relationship.
            </p>
          </div>
          <p>
            If you require legal advice or representation for an active dispute, litigation, petition, or legal matter, you should consult a licensed and qualified advocate or legal practitioner in your relevant jurisdiction.
          </p>
        </section>

        {/* Point 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            4. Calculators & Conversion Tools
          </h2>
          <p>
            Calculations performed by the Court Fee Calculator, Land Unit Converter, and Calculator Hub are mathematical estimations based on standard formulas and regional conversion factors. Variations may exist depending on state-specific amendments, valuation rules, and judicial discretion. Less Legal assumes no responsibility for actions taken based on calculator outputs.
          </p>
        </section>

        {/* Point 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
            5. Case Diary & Data Responsibility
          </h2>
          <p>
            Case Diary and Quick Notes store information locally on your device for personal organization. Users are responsible for verifying court dates directly on official e-Courts cause lists and maintaining independent backups of their case schedules.
          </p>
        </section>

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
          onClick={() => onNavigate('about')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
        >
          Learn More About Less Legal →
        </button>
      </div>

    </div>
  );
};
