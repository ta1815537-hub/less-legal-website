import React, { useState } from 'react';
import { ToolDefinition } from '../../../types';
import { 
  FileCheck, CheckCircle, Scale, Hourglass, BookMarked, 
  Copy, Check, Search, AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface LegalToolsViewProps {
  tool: ToolDefinition;
}

const LATIN_MAXIMS = [
  { latin: 'Audi Alteram Partem', meaning: 'Hear the other side (Rule of natural justice; no one should be condemned unheard)', hi: 'दूसरे पक्ष को भी सुना जाए (प्राकृतिक न्याय का सिद्धांत)' },
  { latin: 'Res Ipsa Loquitur', meaning: 'The thing speaks for itself (Used in tort law when negligence is obvious)', hi: 'घटना स्वयं प्रमाण है' },
  { latin: 'Mens Rea', meaning: 'Guilty mind (The mental element of an intention to commit a crime)', hi: 'आपराधिक मनःस्थिति / दुर्भावना' },
  { latin: 'Actus Non Facit Reum Nisi Mens Sit Rea', meaning: 'An act does not make a person guilty unless the mind is also guilty', hi: 'केवल कार्य किसी को दोषी नहीं बनाता जब तक मन में अपराध भावना न हो' },
  { latin: 'Caveat Emptor', meaning: 'Let the buyer beware', hi: 'क्रेता सावधान रहे' },
  { latin: 'De Minimis Non Curat Lex', meaning: 'The law does not concern itself with trifles (trivial matters)', hi: 'कानून तुच्छ बातों पर ध्यान नहीं देता' },
  { latin: 'Ex Nudo Pacto Non Oritur Actio', meaning: 'No action arises from a bare agreement made without consideration', hi: 'बिना प्रतिफल (Consideration) के समझौते पर वाद नहीं हो सकता' },
  { latin: 'Ignorantia Facti Excusat, Ignorantia Juris Non Excusat', meaning: 'Ignorance of fact excuses, but ignorance of law does not excuse', hi: 'तथ्य की अज्ञानता क्षम्य है, कानून की अज्ञानता क्षम्य नहीं है' },
  { latin: 'Nemo Debet Esse Judex In Propria Causa', meaning: 'No one should be a judge in their own cause (Rule against bias)', hi: 'कोई भी व्यक्ति अपने ही मामले में न्यायाधीश नहीं हो सकता' },
  { latin: 'Ubi Jus Ibi Remedium', meaning: 'Where there is a right, there is a remedy', hi: 'जहाँ अधिकार है, वहाँ उपचार भी है' },
  { latin: 'Damnum Sine Injuria', meaning: 'Damage without legal injury (Loss suffered without violation of legal right)', hi: 'कानूनी क्षति के बिना हानि (वाद योग्य नहीं)' },
  { latin: 'Injuria Sine Damno', meaning: 'Violation of legal right without actual damage (Actionable per se, e.g. Ashby v. White)', hi: 'वास्तविक नुकसान के बिना कानूनी अधिकार का हनन' },
  { latin: 'Quid Pro Quo', meaning: 'Something for something (Consideration in contracts)', hi: 'एक वस्तु के बदले दूसरी वस्तु (प्रतिफल)' },
  { latin: 'Habeas Corpus', meaning: 'You shall have the body (Writ to produce an illegally detained person before the court)', hi: 'बन्दी प्रत्यक्षीकरण (गैरकानूनी हिरासत से मुक्ति)' },
  { latin: 'Mandamus', meaning: 'We command (Writ to perform a public statutory duty)', hi: 'परमादेश' },
  { latin: 'Certiorari', meaning: 'To be certified (Writ to quash lower court/tribunal order passed without jurisdiction)', hi: 'उत्प्रेषण' },
];

const LIMITATION_SCHEDULE = [
  { category: 'Money Recovery on Promissory Note / Loan', days: 1095, period: '3 Years', startingPoint: 'Date of execution or default' },
  { category: 'Specific Performance of Contract', days: 1095, period: '3 Years', startingPoint: 'Date fixed for performance, or when plaintiff has notice of refusal' },
  { category: 'Recovery of Immovable Property (Title / Ownership)', days: 4380, period: '12 Years', startingPoint: 'When possession of defendant becomes adverse' },
  { category: 'Cheque Bounce Notice (Sec 138 NI Act)', days: 30, period: '30 Days', startingPoint: 'Date of receipt of cheque dishonour memo from bank' },
  { category: 'Cheque Bounce Complaint Filing (Sec 138 NI Act)', days: 30, period: '30 Days / 1 Month', startingPoint: 'After expiry of 15 days of demand notice without payment' },
  { category: 'Appeal to High Court (Civil / Criminal)', days: 90, period: '90 Days', startingPoint: 'Date of decree, order, or sentence' },
  { category: 'Revision Petition to High Court / Sessions', days: 90, period: '90 Days', startingPoint: 'Date of the impugned order' },
  { category: 'Consumer Complaint (Consumer Protection Act)', days: 730, period: '2 Years', startingPoint: 'Date on which the cause of action arose' },
];

export const LegalToolsView: React.FC<LegalToolsViewProps> = ({ tool }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // 1. Filename Generator
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [docParty, setDocParty] = useState('Verma');
  const [docType, setDocType] = useState('Agreement');
  const [docVersion, setDocVersion] = useState('v1.0');
  const [copiedFilename, setCopiedFilename] = useState(false);

  // 2. Document Checklist
  const [activeChecklistType, setActiveChecklistType] = useState<'property' | 'civilSuit' | 'chequeBounce'>('property');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // 3. Court Fee Calculator
  const [suitValuation, setSuitValuation] = useState<number>(500000);
  const [claimType, setClaimType] = useState<'moneyRecovery' | 'declaration' | 'eviction'>('moneyRecovery');

  // 4. Limitation Calculator
  const [causeOfActionDate, setCauseOfActionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedLimitationIdx, setSelectedLimitationIdx] = useState<number>(0);

  // 5. Glossary Search
  const [glossaryQuery, setGlossaryQuery] = useState('');

  // Filename result
  const cleanParty = docParty.trim().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
  const cleanType = docType.trim().replace(/\s+/g, '_');
  const generatedFilename = `${docDate}_${cleanParty}_${cleanType}_${docVersion}.pdf`;

  // Court Fee Estimate (Standard Ad-Valorem Curve)
  const calculateCourtFee = (val: number, type: string) => {
    if (val <= 0) return 0;
    if (type === 'declaration') return 500; // Fixed nominal fee in many states
    // Standard ad-valorem scale approximation:
    if (val <= 100000) return Math.round(val * 0.05); // ~5%
    if (val <= 500000) return Math.round(5000 + (val - 100000) * 0.04);
    if (val <= 1000000) return Math.round(21000 + (val - 500000) * 0.03);
    return Math.min(200000, Math.round(36000 + (val - 1000000) * 0.02)); // Typical statutory cap
  };

  const estimatedFee = calculateCourtFee(suitValuation, claimType);

  // Limitation Date
  const currentLimitation = LIMITATION_SCHEDULE[selectedLimitationIdx];
  const calculateLimitationEnd = (startStr: string, days: number) => {
    const d = new Date(startStr);
    if (isNaN(d.getTime())) return 'Invalid date';
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const limitationExpiry = calculateLimitationEnd(causeOfActionDate, currentLimitation.days);

  // Filtered Maxims
  const filteredMaxims = LATIN_MAXIMS.filter(m => 
    m.latin.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
    m.meaning.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
    m.hi.includes(glossaryQuery)
  );

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Disclaimer:</strong> These utilities provide general reference guidelines and standardized formatting aids. They do not constitute formal legal counsel. State-specific court fee amendments and high court rules should be verified independently with a practicing advocate.
        </p>
      </div>

      {/* 1. Professional Filename Generator */}
      {tool.slug === 'filename-generator' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date (YYYY-MM-DD):</label>
              <input
                type="date"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client / Party Name:</label>
              <input
                type="text"
                value={docParty}
                onChange={(e) => setDocParty(e.target.value)}
                placeholder="e.g. Sharma"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Document Category:</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs"
              >
                <option value="Agreement">Agreement</option>
                <option value="Legal_Notice">Legal Notice</option>
                <option value="Affidavit">Affidavit</option>
                <option value="Civil_Suit">Civil Suit / Plaint</option>
                <option value="Writ_Petition">Writ Petition</option>
                <option value="Bail_Application">Bail Application</option>
                <option value="Court_Order">Court Order / Judgment</option>
                <option value="Invoice">Tax Invoice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Version / Tag:</label>
              <select
                value={docVersion}
                onChange={(e) => setDocVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs"
              >
                <option value="v1.0">v1.0 (First Draft)</option>
                <option value="v2.0">v2.0 (Revised)</option>
                <option value="Final">Final</option>
                <option value="Signed_Executed">Signed & Executed</option>
                <option value="Certified_Copy">Certified Copy</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <code className="text-sm font-black font-mono text-slate-900 dark:text-white break-all">
              {generatedFilename}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedFilename);
                setCopiedFilename(true);
                setTimeout(() => setCopiedFilename(false), 2000);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              {copiedFilename ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFilename ? 'Copied' : 'Copy Filename'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Document Checklist */}
      {tool.slug === 'document-checklist' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'property', label: 'Property Sale Registry Checklist' },
              { id: 'civilSuit', label: 'Civil Suit / Plaint Court Filing' },
              { id: 'chequeBounce', label: 'Section 138 NI Act Cheque Bounce' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveChecklistType(c.id as any); setCheckedItems({}); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  activeChecklistType === c.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {(activeChecklistType === 'property' ? [
              'Title Deed (Chain of original title documents for past 30 years)',
              'Encumbrance Certificate (EC from Sub-Registrar office)',
              'Khata Certificate / Revenue extract (Jamabandi / Form 7/12)',
              'Approved Building Layout Plan & NOC from local municipal body',
              'Property Tax Paid Receipts (latest financial year)',
              'PAN Card & Aadhaar of both Buyer and Seller + 2 passport photos',
              'Two Independent Witnesses with valid Government photo ID cards',
              'Stamp Duty e-Challan / Stamp Duty Receipt',
            ] : activeChecklistType === 'civilSuit' ? [
              'Plaint drafted with concise statement of material facts (Order VI CPC)',
              'Affidavit verifying the plaint (sworn before Oath Commissioner)',
              'Vakalatnama signed by plaintiff with advocate welfare stamp attached',
              'List of Documents relied upon (Order VII Rule 14 CPC)',
              'Original documents or certified true copies supporting cause of action',
              'Court fee stamp affixed in accordance with Court Fees Act',
              'Process fee and process memo for issuance of summons to defendants',
              'Copy of notice of suit under Section 80 CPC (if against Government)',
            ] : [
              'Original dishonoured cheque with bank signature/memo',
              'Bank Return Memo citing reason (e.g. "Funds Insufficient")',
              'Copy of Statutory Legal Demand Notice issued within 30 days of memo',
              'Original Postal Dispatch Receipt (Speed Post / Registered AD)',
              'Postal Tracking Delivery Report confirming service of notice',
              'Affidavit of complainant under Section 145 NI Act',
              'Evidence of underlying legally enforceable debt or liability',
            ]).map((item, idx) => {
              const isChecked = Boolean(checkedItems[item]);
              return (
                <div
                  key={idx}
                  onClick={() => setCheckedItems(prev => ({ ...prev, [item]: !isChecked }))}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10 hover:border-blue-400'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-white/20'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Court Fee Calculator */}
      {tool.slug === 'court-fee-calculator' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Suit / Claim Valuation (₹):
              </label>
              <input
                type="number"
                value={suitValuation}
                onChange={(e) => setSuitValuation(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nature of Suit:
              </label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs font-semibold"
              >
                <option value="moneyRecovery">Money Recovery (Ad-Valorem Scale)</option>
                <option value="declaration">Declaratory Suit with Consequential Relief</option>
                <option value="eviction">Tenant Eviction & Mesne Profits</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
            <span className="text-xs uppercase font-bold text-slate-500">Estimated Ad-Valorem Court Fee</span>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
              ₹{estimatedFee.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              *Approximate guideline based on standard High Court fee schedules. Check state Stamp Act for exact rates.
            </p>
          </div>
        </div>
      )}

      {/* 4. Limitation Period Reference */}
      {tool.slug === 'legal-limitation-calculator' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Type of Action / Suit:
              </label>
              <select
                value={selectedLimitationIdx}
                onChange={(e) => setSelectedLimitationIdx(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs font-semibold"
              >
                {LIMITATION_SCHEDULE.map((item, idx) => (
                  <option key={idx} value={idx}>{item.category} ({item.period})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date Cause of Action Arose / Default Date:
              </label>
              <input
                type="date"
                value={causeOfActionDate}
                onChange={(e) => setCauseOfActionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs font-bold"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Prescribed Period:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentLimitation.period} ({currentLimitation.days} Days)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Starting Point:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-right">{currentLimitation.startingPoint}</span>
            </div>
            <div className="pt-2 border-t border-blue-200 dark:border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Last Date to File (Limitation Expiry):</span>
              <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">{limitationExpiry}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Legal Glossary & Latin Maxims */}
      {tool.slug === 'legal-glossary-lookup' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={glossaryQuery}
              onChange={(e) => setGlossaryQuery(e.target.value)}
              placeholder="Search Latin maxims or legal terms (e.g. Mens Rea, Audi Alteram, Habeas Corpus)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-xs sm:text-sm focus:outline-blue-500"
            />
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredMaxims.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif italic font-bold text-sm text-blue-600 dark:text-blue-400">
                    {item.latin}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {item.hi}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
