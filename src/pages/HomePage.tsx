import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, 
  FileText, Calendar, Compass, Scale, Lock, CheckCircle2, 
  Smartphone, Check, Layers, LayoutGrid,
  Search, Zap, Share2, MessageSquare, ChevronRight,
  Copy, Play, ChevronDown
} from 'lucide-react';
import { LTLogo } from '../components/LTLogo';
import { 
  ScrollReveal, StaggerContainer, 
  StaggerItem, GlowingButton, HeroAmbientGlow 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

// Live Converter Units Reference (base in Sq. Ft.)
const SQFT_RATES: Record<string, { label: string; rate: number; region: string }> = {
  sqft: { label: 'Square Feet (Sq. Ft.)', rate: 1, region: 'Standard' },
  acre: { label: 'Acre', rate: 43560, region: 'Universal' },
  bigha: { label: 'Bigha (Standard)', rate: 27225, region: 'North/Central India' },
  guntha: { label: 'Guntha', rate: 1089, region: 'Maharashtra/Gujarat/South' },
  kanal: { label: 'Kanal', rate: 5445, region: 'Punjab/Haryana/J&K' },
  marla: { label: 'Marla', rate: 272.25, region: 'North India' },
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // 1. Interactive Simulator Tab
  const [simTab, setSimTab] = useState<'diary' | 'converter' | 'pdf' | 'whatsapp'>('diary');

  // 2. Feature Search & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Live Land Area Converter State
  const [landValue, setLandValue] = useState<number>(1);
  const [landUnit, setLandUnit] = useState<string>('bigha');
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  // 4. Interactive FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Compute converted land values
  const baseSqFt = (landValue || 0) * SQFT_RATES[landUnit].rate;

  const categories = [
    'All',
    'PDF & Files',
    'Legal Utilities',
    'Calculators & Converters',
    'Learning & Reference',
  ];

  // Filter features based on Category and Search
  const filteredFeatures = SITE_CONFIG.features.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopyValue = (unitKey: string, val: string) => {
    navigator.clipboard.writeText(`${val} ${SQFT_RATES[unitKey].label}`);
    setCopiedUnit(unitKey);
    setTimeout(() => setCopiedUnit(null), 2000);
  };

  const faqs = [
    {
      q: "Is Less Legal affiliated with the Government of India or any Court?",
      a: "No. Less Legal is an entirely independent, private software utility application developed by Less Technologies. It is not affiliated with, endorsed by, or operated by any government body or court authority. All reference materials provided are for educational and informational purposes."
    },
    {
      q: "Does the app require internet to access Bare Acts and Calculators?",
      a: "No! All core 46+ utilities—including Bare Acts reference library, Land Area Converter, PDF Merger/Splitter, Case Diary, and Age Calculator—operate 100% offline directly on your device with zero cloud tracking."
    },
    {
      q: "How does the 'File Transfer (LessShare)' feature work?",
      a: "LessShare establishes a direct device-to-device local Wi-Fi / Hotspot connection to send heavy PDFs and legal documents without uploading anything to cloud servers. It provides instant, confidential local transfers."
    },
    {
      q: "Are the Premium Passes auto-renewing subscriptions?",
      a: "Never. All Premium Passes (3 Months for ₹59 or 1 Year for ₹179) are strict one-time purchases with fixed validity days. We never auto-debit your bank account or store your credit card details."
    },
    {
      q: "What devices are supported by Less Legal?",
      a: "Less Legal is fully optimized for Android smartphones and tablets running Android 7.0 (Nougat) and higher, supporting all modern screen resolutions and dark mode aesthetics."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-32 py-4 sm:py-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      
      {/* 1. HERO SECTION WITH CINEMATIC GLASSMORPHISM */}
      <section className="relative -mt-4 sm:-mt-8 text-slate-900 dark:text-white pt-20 sm:pt-32 pb-16 sm:pb-28 overflow-hidden border-b border-slate-200 dark:border-white/10">
        <HeroAmbientGlow />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-8">
          
          {/* Top Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-800 dark:text-[#D8BD82] text-xs sm:text-sm font-semibold backdrop-blur-xl shadow-xs dark:shadow-lg hover:border-amber-600/60 dark:hover:border-[#D8BD82]/60 transition-all cursor-pointer"
            onClick={() => onNavigate('features')}
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#D8BD82] animate-pulse" />
            <span>Less Legal v8.7.5 • 46+ Integrated Offline Utilities</span>
            <ChevronRight className="w-4 h-4 text-amber-600 dark:text-[#D8BD82]" />
          </motion.div>
          
          {/* Main Title & Brand Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            {/* Orbital Logo Showcase */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-3xl bg-white dark:bg-[#0D0D0F]/80 border border-slate-200 dark:border-white/15 shadow-md dark:shadow-[0_0_40px_rgba(194,31,47,0.3)] backdrop-blur-2xl">
                <LTLogo className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-[#F5F2EE]">
              Legal Knowledge & <br className="hidden sm:inline" />
              <span className="text-gradient-crimson-gold">
                Digital Utilities Suite
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-slate-600 dark:text-[#B8B3AF] font-medium max-w-2xl mx-auto leading-relaxed">
              Designed for advocates, law students, and citizens. Access Bare Acts, Case Diary, PDF workspace, area converters, and court tools offline.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <GlowingButton
              onClick={() => onNavigate('download')}
              variant="primary"
              className="px-8 py-4 text-sm font-bold w-full sm:w-auto shadow-2xl"
            >
              <Download className="w-4.5 h-4.5 group-hover:translate-y-0.5 transition-transform" />
              <span>Get App for Android</span>
            </GlowingButton>
            
            <GlowingButton
              onClick={() => {
                const el = document.getElementById('interactive-simulator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline"
              className="px-8 py-4 text-sm font-bold w-full sm:w-auto"
            >
              <Play className="w-4 h-4 text-[#D8BD82] group-hover:scale-110 transition-transform fill-[#D8BD82]/20" />
              <span>Try Live Interactive Demo</span>
            </GlowingButton>
          </motion.div>

          {/* Trust Badges Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs text-[#B8B3AF]"
          >
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl glass-panel border border-white/10">
              <Zap className="w-4 h-4 text-[#D8BD82] shrink-0" />
              <span>100% Offline Engine</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl glass-panel border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#E03A3E] shrink-0" />
              <span>On-Device Privacy</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl glass-panel border border-white/10">
              <LayoutGrid className="w-4 h-4 text-[#D8BD82] shrink-0" />
              <span>46+ Integrated Tools</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 rounded-2xl glass-panel border border-white/10">
              <Smartphone className="w-4 h-4 text-[#E03A3E] shrink-0" />
              <span>Android 7.0 to 15 Ready</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. INTERACTIVE LIVE APP SIMULATOR SHOWCASE */}
      <section id="interactive-simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C21F2F]/15 border border-[#C21F2F]/30 text-[#E03A3E] text-xs font-bold">
            <Smartphone className="w-4 h-4" />
            Interactive App Preview
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EE] tracking-tight">
            Experience Less Legal Live
          </h2>
          <p className="text-sm text-[#B8B3AF] leading-relaxed">
            Click through the tabs below to test our real interactive utility modules directly on this web page.
          </p>
        </ScrollReveal>

        {/* Simulator Tabs Header */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar max-w-4xl mx-auto">
          <button
            onClick={() => setSimTab('diary')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border ${
              simTab === 'diary'
                ? 'btn-crimson scale-105'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Case Diary & Planner</span>
          </button>

          <button
            onClick={() => setSimTab('converter')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border ${
              simTab === 'converter'
                ? 'btn-crimson scale-105'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Live Area Converter</span>
          </button>

          <button
            onClick={() => setSimTab('pdf')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border ${
              simTab === 'pdf'
                ? 'btn-crimson scale-105'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PDF Engine & Share</span>
          </button>

          <button
            onClick={() => setSimTab('whatsapp')}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border ${
              simTab === 'whatsapp'
                ? 'btn-crimson scale-105'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct WhatsApp</span>
          </button>
        </div>

        {/* Simulator Frame Container */}
        <div className="glass-panel-gradient rounded-3xl p-5 sm:p-8 border border-white/12 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          {/* Subtle Ambient Red Blur Inside Card */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#8B0000]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Phone Header Mockup */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C21F2F]/20 border border-[#C21F2F]/40 flex items-center justify-center text-[#E03A3E]">
                <Scale className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F5F2EE] flex items-center gap-2">
                  <span>Less Legal Interface</span>
                  <span className="text-[10px] bg-[#D8BD82]/20 text-[#D8BD82] px-2.5 py-0.5 rounded-full border border-[#D8BD82]/40 font-semibold">
                    100% Offline
                  </span>
                </div>
                <div className="text-[11px] text-[#B8B3AF]">Android Application Sandbox</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#B8B3AF]">
              <Lock className="w-3.5 h-3.5 text-[#D8BD82]" />
              <span className="hidden sm:inline">On-Device Encrypted</span>
            </div>
          </div>

          {/* Active Tab Screen Content */}
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CASE DIARY */}
            {simTab === 'diary' && (
              <motion.div
                key="diary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#B8B3AF]">
                    <span className="font-bold text-[#D8BD82]">Today's Hearing Schedule (Advocate Chamber)</span>
                    <span>3 Active Cases</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#F5F2EE]">Sharma vs. State of UP</div>
                        <div className="text-[11px] text-[#B8B3AF]">Court No. 4 • Criminal Appeal • Item #12</div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#C21F2F]/20 text-[#E03A3E] px-2.5 py-1 rounded-lg border border-[#C21F2F]/40">
                        Arguments
                      </span>
                    </div>

                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#F5F2EE]">Verma Infra vs. City Development</div>
                        <div className="text-[11px] text-[#B8B3AF]">District Tribunal • Arbitration • Item #5</div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#D8BD82]/20 text-[#D8BD82] px-2.5 py-1 rounded-lg border border-[#D8BD82]/40">
                        Evidence Stage
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-[#0A0A0C]/90 rounded-xl border border-white/10 text-center">
                    <div className="text-xl font-extrabold text-[#E03A3E]">24</div>
                    <div className="text-[10px] text-[#B8B3AF]">Pending Tasks</div>
                  </div>
                  <div className="p-3.5 bg-[#0A0A0C]/90 rounded-xl border border-white/10 text-center">
                    <div className="text-xl font-extrabold text-[#D8BD82]">100%</div>
                    <div className="text-[10px] text-[#B8B3AF]">Auto-Saved Notes</div>
                  </div>
                  <div className="p-3.5 bg-[#0A0A0C]/90 rounded-xl border border-white/10 text-center col-span-2 sm:col-span-1">
                    <div className="text-xl font-extrabold text-[#F5F2EE]">Offline</div>
                    <div className="text-[10px] text-[#B8B3AF]">Local Database</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: LIVE AREA CONVERTER */}
            {simTab === 'converter' && (
              <motion.div
                key="converter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#D8BD82]">Type Land Quantity & Select Source Unit:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={landValue}
                          onChange={(e) => setLandValue(parseFloat(e.target.value) || 0)}
                          className="w-28 px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-[#F5F2EE] text-sm font-bold focus:outline-none focus:border-[#C21F2F]"
                        />
                        <select
                          value={landUnit}
                          onChange={(e) => setLandUnit(e.target.value)}
                          className="px-3 py-2 bg-slate-900 text-white border border-white/15 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C21F2F]"
                        >
                          {Object.entries(SQFT_RATES).map(([key, u]) => (
                            <option key={key} value={key} className="bg-[#0A0A0C] text-[#F5F2EE]">{u.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-[#B8B3AF]">Calculated Area Base</div>
                      <div className="text-base font-extrabold text-[#D8BD82]">{baseSqFt.toLocaleString()} Sq. Ft.</div>
                    </div>
                  </div>

                  {/* Calculated Conversions Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    {Object.entries(SQFT_RATES).map(([key, u]) => {
                      const convertedVal = (baseSqFt / u.rate).toFixed(2);
                      const isSelected = key === landUnit;

                      return (
                        <div 
                          key={key} 
                          onClick={() => handleCopyValue(key, convertedVal)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#C21F2F]/20 border-[#C21F2F]/60 text-white' 
                              : 'bg-white/5 border-white/10 hover:border-white/20 text-[#B8B3AF]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-[#B8B3AF] mb-1">
                            <span>{u.label}</span>
                            {copiedUnit === key ? <Check className="w-3 h-3 text-[#D8BD82]" /> : <Copy className="w-3 h-3 text-[#77736F]" />}
                          </div>
                          <div className="text-sm font-extrabold text-[#F5F2EE]">{convertedVal}</div>
                          <div className="text-[9px] text-[#D8BD82]/80 mt-0.5">{u.region}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: PDF ENGINE & LESS SHARE */}
            {simTab === 'pdf' && (
              <motion.div
                key="pdf"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-[#D8BD82]">PDF Document Processing & Local Transfer</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                      <FileText className="w-5 h-5 text-[#E03A3E] mb-1" />
                      <div className="text-xs font-bold text-[#F5F2EE]">Merge & Split PDFs</div>
                      <div className="text-[10px] text-[#B8B3AF]">Combine multiple court filings into a single indexed PDF.</div>
                    </div>

                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                      <Lock className="w-5 h-5 text-[#D8BD82] mb-1" />
                      <div className="text-xs font-bold text-[#F5F2EE]">Encrypt & Password</div>
                      <div className="text-[10px] text-[#B8B3AF]">Add 256-bit passwords to secure client documents.</div>
                    </div>

                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                      <Share2 className="w-5 h-5 text-[#E03A3E] mb-1" />
                      <div className="text-xs font-bold text-[#F5F2EE]">LessShare Transfer</div>
                      <div className="text-[10px] text-[#B8B3AF]">Send files peer-to-peer via local Wi-Fi offline.</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: DIRECT WHATSAPP */}
            {simTab === 'whatsapp' && (
              <motion.div
                key="whatsapp"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-[#D8BD82]">Direct WhatsApp Utility (No Contact Saving Required)</div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 max-w-md mx-auto">
                    <div className="text-xs text-[#B8B3AF]">Quickly send WhatsApp legal memos or notice drafts to clients without cluttering your phone contact book.</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        disabled
                        value="+91 98765 43210"
                        className="flex-1 px-3 py-2 bg-[#0A0A0C] border border-white/15 rounded-xl text-xs text-[#F5F2EE]"
                      />
                      <button className="px-4 py-2 btn-crimson text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* 3. PRODUCT ECOSYSTEM GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#D8BD82]/30 text-[#D8BD82] text-xs font-bold">
            <LayoutGrid className="w-3.5 h-3.5" />
            Product Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EE] tracking-tight">
            Built by Less Technologies
          </h2>
          <p className="text-sm text-[#B8B3AF] leading-relaxed">
            Discover our suite of independent digital tools designed to simplify daily workflows.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.products.map((product) => {
            const isFlagship = product.category === 'Flagship Product';
            const isAvailable = product.status === 'Available';

            return (
              <StaggerItem key={product.id}>
                <div className={`group relative p-6 rounded-3xl transition-all duration-300 h-full flex flex-col ${
                  isFlagship 
                    ? 'glass-panel-crimson text-[#F5F2EE]' 
                    : 'glass-card text-[#F5F2EE]'
                }`}>
                  
                  {isFlagship && (
                    <div className="absolute top-0 right-0 -mt-3 mr-4">
                      <span className="bg-gradient-to-r from-[#D8BD82] to-[#C7A96B] text-[#080808] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                        Flagship App
                      </span>
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#E03A3E] flex items-center justify-center mb-5 transition-transform group-hover:scale-110">
                    <Scale className="w-6 h-6" />
                  </div>

                  <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-[#F5F2EE]">
                        {product.name}
                      </h3>
                      {!isAvailable && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#77736F] bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#B8B3AF] leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    {isAvailable ? (
                      <button
                        onClick={() => product.downloadUrl && onNavigate('download')}
                        className="w-full py-2.5 rounded-xl text-xs font-bold btn-crimson flex items-center justify-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Get App</span>
                      </button>
                    ) : (
                      <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-[#77736F] flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5" />
                        <span>In Development</span>
                      </button>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* 4. SEARCHABLE & FILTERABLE FEATURE CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D8BD82]">
              Complete Integrated Suite
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EE] tracking-tight mt-1">
              Explore All 46 Features
            </h2>
            <p className="text-sm text-[#B8B3AF] mt-1 max-w-xl">
              Filter by category or search any legal tool, calculator, or PDF utility in real-time.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#77736F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search features (e.g. Bare Acts, Bigha)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs text-[#F5F2EE]"
            />
          </div>
        </ScrollReveal>

        {/* Filter Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'btn-crimson font-bold'
                  : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feature Items Grid */}
        <StaggerContainer key={`${selectedCategory}-${searchQuery}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFeatures.slice(0, 12).map((item) => (
            <StaggerItem key={item.id}>
              <div className="glass-card p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#D8BD82] bg-[#D8BD82]/15 px-2.5 py-0.5 rounded-full border border-[#D8BD82]/30">
                      {item.category}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#E03A3E] shrink-0" />
                  </div>

                  <h3 className="text-base font-bold text-[#F5F2EE]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#B8B3AF] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                  {item.highlights.map((tag, hIdx) => (
                    <span key={hIdx} className="text-[10px] font-medium text-[#B8B3AF] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      • {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl p-6">
            <Search className="w-8 h-8 text-[#77736F] mx-auto mb-2" />
            <div className="text-sm font-bold text-[#F5F2EE]">No features found matching "{searchQuery}"</div>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 text-xs font-semibold text-[#D8BD82] underline"
            >
              Clear filters and view all 46 tools
            </button>
          </div>
        )}

        {filteredFeatures.length > 12 && (
          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('features')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-glass font-bold text-xs"
            >
              <span>View Remaining {filteredFeatures.length - 12} Features</span>
              <ArrowRight className="w-4 h-4 text-[#E03A3E]" />
            </button>
          </div>
        )}
      </section>

      {/* 5. FOUR PILLARS OF EXCELLENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D8BD82]">
            Engineered for Security & Speed
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EE] tracking-tight">
            Why Choose Less Legal?
          </h2>
          <p className="text-sm text-[#B8B3AF]">
            Built from the ground up to guarantee user privacy, zero cloud dependency, and effortless practice organization.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C21F2F]/20 text-[#E03A3E] border border-[#C21F2F]/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F2EE]">100% On-Device Privacy</h3>
            <p className="text-xs text-[#B8B3AF] leading-relaxed">
              Your client notes, hearing schedules, and PDF documents stay strictly on your local Android device storage. Zero cloud telemetry.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8BD82]/20 text-[#D8BD82] border border-[#D8BD82]/40 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F2EE]">Lightning Fast & Offline</h3>
            <p className="text-xs text-[#B8B3AF] leading-relaxed">
              Launch Bare Acts, perform land unit conversions, and draft legal memos instantly without requiring active internet access.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C21F2F]/20 text-[#E03A3E] border border-[#C21F2F]/40 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F2EE]">All-in-One PDF Suite</h3>
            <p className="text-xs text-[#B8B3AF] leading-relaxed">
              Merge, split, protect, and compress legal filings effortlessly. Transfer heavy files directly device-to-device with LessShare.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8BD82]/20 text-[#D8BD82] border border-[#D8BD82]/40 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F5F2EE]">Fixed-Validity Passes</h3>
            <p className="text-xs text-[#B8B3AF] leading-relaxed">
              Transparent one-time purchases for ad-free access. Zero auto-renewing subscriptions or unexpected bank debits.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING & AD-FREE PASSES */}
      <section className="glass-panel-gradient py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden border border-white/15 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#8B0000]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-[#D8BD82]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          <ScrollReveal direction="up" className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#D8BD82]/15 text-[#D8BD82] border border-[#D8BD82]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#D8BD82]" />
              Transparent Passes
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F5F2EE]">
              Upgrade to 100% Ad-Free Practice
            </h2>
            <p className="text-sm sm:text-base text-[#B8B3AF] max-w-2xl mx-auto">
              Enjoy uninterrupted access to all tools and resources with fixed-validity passes. No auto-renewing subscriptions.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            
            {/* 3 Months Pass */}
            <div className="glass-panel rounded-2xl p-6 border border-white/12 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#F5F2EE]">3 Months Pass</span>
                  <span className="text-[10px] font-bold text-[#D8BD82] bg-[#D8BD82]/15 px-2.5 py-0.5 rounded-full border border-[#D8BD82]/30">
                    90 Days Validity
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-[#F5F2EE]">₹59</span>
                  <span className="text-xs text-[#B8B3AF]">/ one-time payment</span>
                </div>
                <p className="text-xs text-[#B8B3AF] mb-4">
                  Full access to all 46 tools ad-free for 90 days.
                </p>
                <ul className="space-y-2 text-xs text-[#B8B3AF]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E03A3E] shrink-0" />
                    <span>Ad-free tool navigation & PDF utilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E03A3E] shrink-0" />
                    <span>Strict one-time purchase (No recurring fee)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('premium')}
                className="w-full py-3 rounded-xl btn-glass font-bold text-xs"
              >
                View Pass Terms
              </button>
            </div>

            {/* 1 Year Pass (Best Value) */}
            <div className="glass-panel-crimson glow-crimson-gold rounded-2xl p-6 border-2 relative flex flex-col justify-between space-y-6">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D8BD82] to-[#C7A96B] text-[#080808] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
                Best Value
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#D8BD82]">1 Year Pass</span>
                  <span className="text-[10px] font-bold text-[#D8BD82] bg-[#D8BD82]/20 px-2.5 py-0.5 rounded-full border border-[#D8BD82]/40">
                    365 Days Validity
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-[#F5F2EE]">₹179</span>
                  <span className="text-xs text-[#B8B3AF]">/ one-time payment</span>
                </div>
                <p className="text-xs text-[#B8B3AF] mb-4">
                  Full access to all 46 tools ad-free for 1 full year.
                </p>
                <ul className="space-y-2 text-xs text-[#F5F2EE]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8BD82] shrink-0" />
                    <span>Ad-free tool navigation & PDF utilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8BD82] shrink-0" />
                    <span>365 days uninterrupted validity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D8BD82] shrink-0" />
                    <span>Strict one-time purchase (No recurring fee)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('premium')}
                className="w-full py-3 rounded-xl btn-crimson font-bold text-xs"
              >
                Get 1 Year Pass
              </button>
            </div>

          </div>

          <div className="pt-2 text-xs text-[#77736F]">
            Purchases are made securely inside the Android application via certified Play Store / PayU gateway.
          </div>

        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal direction="up" className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D8BD82]">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EE] tracking-tight">
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div 
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden transition-all border border-white/10"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#F5F2EE] focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#77736F] shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#E03A3E]' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#B8B3AF] leading-relaxed border-t border-white/10 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up">
          <div className="p-8 sm:p-14 glass-panel-gradient rounded-3xl border border-white/15 shadow-2xl max-w-4xl mx-auto space-y-6 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-[#C21F2F] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#C21F2F]/40 border border-white/20">
              <Smartphone className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EE] tracking-tight">
                Ready to Simplify Your Legal Workflow?
              </h2>
              <p className="text-xs sm:text-sm text-[#B8B3AF] max-w-xl mx-auto">
                Download Less Legal today on your Android smartphone or tablet to access offline Bare Acts, PDF converters, and Case Diary.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <GlowingButton
                onClick={() => onNavigate('download')}
                variant="primary"
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK</span>
              </GlowingButton>
              
              <GlowingButton
                onClick={() => onNavigate('about')}
                variant="secondary"
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold"
              >
                <span>About Less Technologies</span>
              </GlowingButton>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#77736F]">
              <span>Android 7.0+ Minimum</span>
              <span>•</span>
              <span>100% On-Device Storage</span>
              <span>•</span>
              <span>Independent & Factual</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
