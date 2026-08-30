import React, { useState } from 'react';
import { 
  FileText, Calendar, Calculator, Scale, 
  Layers, Lock, Share2, Compass, BookOpen, 
  Search, Shield, CheckCircle2, ChevronRight,
  Sparkles, Home, User, Edit3
} from 'lucide-react';
import { AppLogo } from './AppLogo';

export const AppMockupPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'diary' | 'calc' | 'acts'>('pdf');

  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md">
      {/* Glow highlight under the phone */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-[2.75rem] blur-xl opacity-70 pointer-events-none" />

      {/* Outer Phone Frame */}
      <div className="relative bg-slate-900 p-3 sm:p-4 rounded-[2.5rem] shadow-2xl shadow-slate-900/30 border-4 border-slate-800">
        
        {/* Speaker & Camera Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-8 h-1 rounded-full bg-slate-800" />
        </div>

        {/* Screen Bezel */}
        <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200/80 text-slate-800 flex flex-col h-[520px] sm:h-[560px]">
          
          {/* Android App Status Bar */}
          <div className="pt-6 px-4 pb-2 bg-white flex items-center justify-between text-[11px] font-semibold text-slate-500 border-b border-slate-100">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">4G</span>
              <div className="w-4 h-2 rounded-xs border border-slate-400 p-0.5">
                <div className="w-full h-full bg-slate-700 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Header Inside Phone */}
          <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppLogo className="w-7 h-7" showShadow={false} />
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Less Legal</h4>
                <p className="text-[9px] text-slate-500 font-medium">Android Utilities</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                V8.7.5
              </span>
            </div>
          </div>

          {/* Mockup Interactive Screen View Switcher */}
          <div className="px-3 pt-2.5 pb-1.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'pdf'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              PDF Tools
            </button>
            <button
              onClick={() => setActiveTab('diary')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'diary'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Case Diary
            </button>
            <button
              onClick={() => setActiveTab('calc')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'calc'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Calculators
            </button>
            <button
              onClick={() => setActiveTab('acts')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'acts'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bare Acts
            </button>
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
            
            {/* View 1: PDF Tools */}
            {activeTab === 'pdf' && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      PDF Utilities Hub
                    </span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">
                      On-Device
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Process, merge and protect legal briefs with 100% on-device processing.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">Merge PDFs</div>
                    <div className="text-[9px] text-slate-400">Combine court petitions</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">Protect PDF</div>
                    <div className="text-[9px] text-slate-400">Add secure password</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">PDF Reader</div>
                    <div className="text-[9px] text-slate-400">Fast offline viewer</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-xs">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                      <Share2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800">Less Share</div>
                    <div className="text-[9px] text-slate-400">Direct file transfer</div>
                  </div>
                </div>

                <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-semibold">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>No Cloud File Uploads</span>
                  </div>
                  <span className="text-[9px] text-indigo-600 font-bold">100% Private</span>
                </div>
              </div>
            )}

            {/* View 2: Case Diary */}
            {activeTab === 'diary' && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      Case Diary & Schedule
                    </span>
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                      Organizer
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Track next hearing dates, court venues, and case stage notes.
                  </p>
                </div>

                {/* Case item preview */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-800">Civil Suit No. 104/2024</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Hearing Tomorrow
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 flex items-center justify-between">
                    <span>Court: Courtroom 4, Civil Judge</span>
                    <span className="font-semibold text-slate-700">Stage: Arguments</span>
                  </div>
                  <div className="text-[9px] text-slate-400 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                    Note: Submit additional affidavit along with certified copies.
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-800">Crl. Revision 42/2024</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
                      Next Week
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Stage: Evidence Recording • Courtroom 2
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Calculators */}
            {activeTab === 'calc' && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                      Calculators & Converters
                    </span>
                    <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                      Instant Math
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Court fee estimations and regional land area conversions.
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-bold text-slate-800">Land Unit Converter</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 text-[9px] space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Input: 1 Acre</span>
                      <span className="font-bold text-indigo-700">43,560 Sq Ft</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Bigha (Standard): ~1.61 Bigha</span>
                      <span className="font-bold text-indigo-700">40.00 Guntha</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-800">Court Fee Estimation</span>
                    <span className="text-[9px] font-semibold text-indigo-600">Calculator Hub</span>
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Calculate estimated court fee schedules based on suit valuation.
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Bare Acts */}
            {activeTab === 'acts' && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-indigo-600" />
                      Bare Acts & Legal Glossary
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Statutory provisions, Latin maxims, and legal definitions.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-800">Code of Civil Procedure, 1908</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-800">Indian Contract Act, 1872</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-800">Specific Relief Act, 1963</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[10px]">
                  <div className="font-bold text-indigo-950">Latin Maxim: Res Judicata</div>
                  <div className="text-[9px] text-indigo-800">A matter judged; a case in which there has been a final judgment.</div>
                </div>
              </div>
            )}

          </div>

          {/* Phone Bottom Navigation Bar */}
          <div className="py-2 px-1 bg-white border-t border-slate-100 grid grid-cols-5 items-center justify-between text-[8px] font-bold text-slate-400 text-center">
            <div className="flex flex-col items-center text-indigo-600 px-0.5">
              <Home className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate w-full">Home</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600 text-slate-500 px-0.5">
              <Calculator className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate w-full text-[7.5px] leading-tight">PDF - Calc</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600 text-slate-500 px-0.5">
              <Edit3 className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate w-full text-[7.5px] leading-tight">Diary - Notes</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600 text-slate-500 px-0.5">
              <Sparkles className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate w-full">Quiz</span>
            </div>
            <div className="flex flex-col items-center hover:text-slate-600 text-slate-500 px-0.5">
              <User className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate w-full">Profile</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
