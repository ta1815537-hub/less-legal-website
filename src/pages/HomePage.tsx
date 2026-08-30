import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, 
  FileText, Calendar, Compass, Scale, Lock, CheckCircle2, 
  Smartphone, Check, Layers, LayoutGrid,
  Search, Zap, Share2, MessageSquare, ChevronRight,
  Copy, Play, ChevronDown, UserCheck
} from 'lucide-react';
import { LTLogo } from '../components/LTLogo';
import { 
  ScrollReveal, StaggerContainer, 
  StaggerItem, GlowingButton, HeroAmbientGlow 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { sanitizePhoneNumber, isRateLimited, isSafeUrl } from '../utils/security';

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
  const { t } = useLanguage();
  const [founderImgErr, setFounderImgErr] = useState(false);

  // 1. Interactive Simulator Tab
  const [simTab, setSimTab] = useState<'diary' | 'converter' | 'pdf' | 'whatsapp'>('diary');

  // 2. Feature Search & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Live Land Area Converter State
  const [landValue, setLandValue] = useState<number>(1);
  const [landUnit, setLandUnit] = useState<string>('bigha');
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  // 4. Real Working Direct WhatsApp State
  const [waNumber, setWaNumber] = useState<string>('');

  const handleOpenWhatsApp = () => {
    if (isRateLimited('whatsapp_trigger', 1500)) return;
    const cleanDigits = sanitizePhoneNumber(waNumber).replace(/\D/g, '');
    if (!cleanDigits) {
      alert(t.common?.verifiedNotice ? 'कृपया एक मोबाइल नंबर दर्ज करें (10 अंक)' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    let fullNumber = cleanDigits;
    if (cleanDigits.length === 10) {
      fullNumber = '91' + cleanDigits;
    }
    const targetUrl = `https://wa.me/${fullNumber}`;
    if (isSafeUrl(targetUrl)) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

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
      a: "No! All core 46+ utilities—including Bare Acts reference library, Land Area Converter, PDF Merger/Splitter, Case Diary, and Age Calculator—operate directly on your device with high speed and zero cloud tracking."
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
      <section className="relative -mt-4 sm:-mt-6 text-slate-900 dark:text-white pt-6 sm:pt-10 pb-12 sm:pb-20 overflow-hidden border-b border-slate-200 dark:border-white/10">
        <HeroAmbientGlow />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4 sm:space-y-6">
          
          {/* Main Title & Brand Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3 sm:space-y-4 max-w-4xl mx-auto"
          >
            {/* Orbital Logo Showcase - Shifted Up Near Header */}
            <div className="flex justify-center mb-3">
              <div className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-[#0D0D0F]/80 border border-slate-200 dark:border-white/15 shadow-md dark:shadow-[0_0_40px_rgba(194,31,47,0.3)] backdrop-blur-2xl">
                <LTLogo className="w-14 h-14 sm:w-20 sm:h-20" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-[#F5F2EE]">
              Legal Knowledge & <br className="hidden sm:inline" />
              <span className="text-gradient-crimson-gold">
                Digital Utilities Suite
              </span>
            </h1>
            
            <p className="text-sm sm:text-xl text-slate-600 dark:text-[#B8B3AF] font-medium max-w-2xl mx-auto leading-relaxed">
              Designed for advocates, law students, and citizens. Access Bare Acts, Case Diary, PDF workspace, area converters, and court tools seamlessly.
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
            className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-xs text-[#B8B3AF]"
          >
            <div className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-2xl glass-panel border border-white/10 whitespace-nowrap badge-one-line">
              <Zap className="w-3.5 h-3.5 text-[#D8BD82] shrink-0" />
              <span className="whitespace-nowrap badge-one-line">Fast On-Device Engine</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-2xl glass-panel border border-white/10 whitespace-nowrap badge-one-line">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E03A3E] shrink-0" />
              <span className="whitespace-nowrap badge-one-line">On-Device Privacy</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-2xl glass-panel border border-white/10 whitespace-nowrap badge-one-line">
              <LayoutGrid className="w-3.5 h-3.5 text-[#D8BD82] shrink-0" />
              <span className="whitespace-nowrap badge-one-line">46+ Integrated Tools</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 sm:p-3 rounded-2xl glass-panel border border-white/10 whitespace-nowrap badge-one-line">
              <Smartphone className="w-3.5 h-3.5 text-[#E03A3E] shrink-0" />
              <span className="whitespace-nowrap badge-one-line">Android 7.0 to 15 Ready</span>
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
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar max-w-4xl mx-auto px-1">
          <button
            onClick={() => setSimTab('diary')}
            className={`shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap badge-one-line border active-click-scale ${
              simTab === 'diary'
                ? 'btn-crimson text-white border-[#C21F2F]'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0 text-[#E03A3E]" />
            <span className="whitespace-nowrap badge-one-line">Case Diary & Planner</span>
          </button>

          <button
            onClick={() => setSimTab('converter')}
            className={`shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap badge-one-line border active-click-scale ${
              simTab === 'converter'
                ? 'btn-crimson text-white border-[#C21F2F]'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 text-[#D8BD82]" />
            <span className="whitespace-nowrap badge-one-line">Live Area Converter</span>
          </button>

          <button
            onClick={() => setSimTab('pdf')}
            className={`shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap badge-one-line border active-click-scale ${
              simTab === 'pdf'
                ? 'btn-crimson text-white border-[#C21F2F]'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0 text-[#E03A3E]" />
            <span className="whitespace-nowrap badge-one-line">PDF Engine & Share</span>
          </button>

          <button
            onClick={() => setSimTab('whatsapp')}
            className={`shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap badge-one-line border active-click-scale ${
              simTab === 'whatsapp'
                ? 'btn-crimson text-white border-[#C21F2F]'
                : 'glass-panel text-[#B8B3AF] hover:text-[#F5F2EE] hover:border-white/20'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-[#25D366]" />
            <span className="whitespace-nowrap badge-one-line">Direct WhatsApp</span>
          </button>
        </div>

        {/* Simulator Frame Container */}
        <div className="glass-panel-gradient rounded-3xl p-4 sm:p-8 border border-white/12 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          {/* Subtle Ambient Red Blur Inside Card */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#8B0000]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Phone Header Mockup */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#C21F2F]/20 border border-[#C21F2F]/40 flex items-center justify-center text-[#E03A3E] shrink-0">
                <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F5F2EE] flex items-center gap-2 whitespace-nowrap badge-one-line">
                  <span className="whitespace-nowrap badge-one-line">Less Legal Interface</span>
                  <span className="text-[10px] bg-[#D8BD82]/20 text-[#D8BD82] px-2 py-0.5 rounded-full border border-[#D8BD82]/40 font-semibold whitespace-nowrap badge-one-line">
                    On-Device
                  </span>
                </div>
                <div className="text-[11px] text-[#B8B3AF] whitespace-nowrap badge-one-line">Android Application Sandbox</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#B8B3AF] shrink-0">
              <Lock className="w-3.5 h-3.5 text-[#D8BD82] shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap badge-one-line">On-Device Encrypted</span>
            </div>
          </div>

          {/* Active Tab Screen Content */}
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CASE DIARY */}
            {simTab === 'diary' && (
              <motion.div
                key="diary"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#B8B3AF] gap-2">
                    <span className="font-bold text-[#D8BD82] whitespace-nowrap badge-one-line">Today's Hearing Schedule</span>
                    <span className="whitespace-nowrap badge-one-line shrink-0">3 Active Cases</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 sm:p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-[#F5F2EE] truncate">Sharma vs. State of UP</div>
                        <div className="text-[11px] text-[#B8B3AF] truncate">Court No. 4 • Criminal Appeal • Item #12</div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#C21F2F]/20 text-[#E03A3E] px-2.5 py-1 rounded-lg border border-[#C21F2F]/40 whitespace-nowrap badge-one-line shrink-0">
                        Arguments
                      </span>
                    </div>

                    <div className="p-3 sm:p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-[#F5F2EE] truncate">Verma Infra vs. City Development</div>
                        <div className="text-[11px] text-[#B8B3AF] truncate">District Tribunal • Arbitration • Item #5</div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#D8BD82]/20 text-[#D8BD82] px-2.5 py-1 rounded-lg border border-[#D8BD82]/40 whitespace-nowrap badge-one-line shrink-0">
                        Evidence Stage
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-[#0A0A0C]/90 rounded-xl border border-white/10 text-center">
                    <div className="text-xl font-extrabold text-[#E03A3E]">24</div>
                    <div className="text-[10px] text-[#B8B3AF] whitespace-nowrap badge-one-line">Pending Tasks</div>
                  </div>
                  <div className="p-3.5 bg-[#0A0A0C]/90 rounded-xl border border-white/10 text-center">
                    <div className="text-xl font-extrabold text-[#D8BD82]">100%</div>
                    <div className="text-[10px] text-[#B8B3AF] whitespace-nowrap badge-one-line">Auto-Saved Notes</div>
                  </div>
                  <div className="p-3.5 bg-[#0A0A0C]/90 rounded-xl border border-white/10 text-center col-span-2 sm:col-span-1">
                    <div className="text-xl font-extrabold text-[#F5F2EE]">Local</div>
                    <div className="text-[10px] text-[#B8B3AF] whitespace-nowrap badge-one-line">On-Device Database</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: LIVE AREA CONVERTER */}
            {simTab === 'converter' && (
              <motion.div
                key="converter"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#D8BD82] whitespace-nowrap badge-one-line block">Type Quantity & Source Unit:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={landValue}
                          onChange={(e) => setLandValue(parseFloat(e.target.value) || 0)}
                          className="w-24 sm:w-28 px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-[#F5F2EE] text-sm font-bold focus:outline-none focus:border-[#C21F2F]"
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

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-[#B8B3AF] whitespace-nowrap badge-one-line">Calculated Area Base</div>
                      <div className="text-base font-extrabold text-[#D8BD82] whitespace-nowrap badge-one-line">{baseSqFt.toLocaleString()} Sq. Ft.</div>
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
                            <span className="whitespace-nowrap badge-one-line">{u.label}</span>
                            {copiedUnit === key ? <Check className="w-3 h-3 text-[#D8BD82] shrink-0" /> : <Copy className="w-3 h-3 text-[#77736F] shrink-0" />}
                          </div>
                          <div className="text-sm font-extrabold text-[#F5F2EE] whitespace-nowrap badge-one-line">{convertedVal}</div>
                          <div className="text-[9px] text-[#D8BD82]/80 mt-0.5 whitespace-nowrap badge-one-line">{u.region}</div>
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-[#D8BD82] whitespace-nowrap badge-one-line">PDF Document Processing & Local Transfer</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                      <FileText className="w-5 h-5 text-[#E03A3E] mb-1" />
                      <div className="text-xs font-bold text-[#F5F2EE] whitespace-nowrap badge-one-line">Merge & Split PDFs</div>
                      <div className="text-[10px] text-[#B8B3AF]">Combine multiple court filings into a single indexed PDF.</div>
                    </div>

                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                      <Lock className="w-5 h-5 text-[#D8BD82] mb-1" />
                      <div className="text-xs font-bold text-[#F5F2EE] whitespace-nowrap badge-one-line">Encrypt & Password</div>
                      <div className="text-[10px] text-[#B8B3AF]">Add 256-bit passwords to secure client documents.</div>
                    </div>

                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                      <Share2 className="w-5 h-5 text-[#E03A3E] mb-1" />
                      <div className="text-xs font-bold text-[#F5F2EE] whitespace-nowrap badge-one-line">LessShare Transfer</div>
                      <div className="text-[10px] text-[#B8B3AF]">Send files peer-to-peer via direct local Wi-Fi.</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: DIRECT WHATSAPP */}
            {simTab === 'whatsapp' && (
              <motion.div
                key="whatsapp"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-[#0A0A0C]/90 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#D8BD82] whitespace-nowrap badge-one-line">
                    <span>Direct WhatsApp Utility</span>
                    <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-2 py-0.5 rounded-md border border-[#25D366]/40">Real Working Tool</span>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 max-w-lg">
                    <div className="text-xs text-[#B8B3AF] leading-relaxed">
                      Enter any phone number below to open a direct WhatsApp chat window without saving the number to your contact list.
                    </div>
                    
                    {/* Compact input & Left-aligned Chat Now Button */}
                    <div className="flex flex-wrap items-center justify-start gap-2.5 pt-1">
                      {/* Compact Number Input Box */}
                      <div className="flex items-center gap-1.5 bg-[#0A0A0C] border border-white/15 rounded-xl px-3 py-2 w-36 sm:w-44 focus-within:border-[#C21F2F] transition-colors">
                        <span className="text-xs font-bold text-[#D8BD82] shrink-0">+91</span>
                        <input
                          type="tel"
                          value={waNumber}
                          onChange={(e) => setWaNumber(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleOpenWhatsApp();
                          }}
                          placeholder="9876543210"
                          className="w-full bg-transparent text-xs font-semibold text-[#F5F2EE] focus:outline-none"
                          maxLength={15}
                        />
                      </div>

                      {/* Small Chat Now Button moved to Left Side */}
                      <button 
                        onClick={handleOpenWhatsApp}
                        className="px-3 py-2 btn-crimson text-white font-bold text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap badge-one-line shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
                        title="Open WhatsApp Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#25D366]" />
                        <span className="whitespace-nowrap badge-one-line">Chat Now</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-[#77736F] flex items-center gap-1 pt-0.5">
                      <Lock className="w-3 h-3 text-[#D8BD82] shrink-0" />
                      <span>Opens WhatsApp app or web directly on your device. Zero data saved.</span>
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

      {/* FOUNDER PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="relative z-10">
          <div className="p-6 sm:p-10 rounded-3xl glass-panel-gradient border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden relative">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Founder Image Thumbnail */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative w-48 sm:w-56 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-amber-600/30 dark:border-[#D8BD82]/40 shadow-xl bg-[#0D131F]">
                  {!founderImgErr ? (
                    <img 
                      src="/images/founder.jpg" 
                      alt="Anurag Gurauli — Founder of Less Technologies"
                      onError={() => setFounderImgErr(true)}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#0F172A] to-[#1A0A0D] flex flex-col items-center justify-center p-4 text-center">
                      <Scale className="w-10 h-10 text-[#D8BD82] mb-2" />
                      <div className="text-sm font-bold text-[#F5F2EE]">{t.founder.name}</div>
                      <div className="text-[10px] text-[#D8BD82]">{t.founder.role}</div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-black/80 backdrop-blur-xs text-center">
                    <span className="text-[10px] font-bold text-[#D8BD82] tracking-wider uppercase">{t.founder.badge}</span>
                  </div>
                </div>
              </div>

              {/* Founder Info & CTA */}
              <div className="md:col-span-8 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-900 dark:text-[#D8BD82] text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-[#C21F2F]" />
                  <span>{t.home.founderPreviewBadge}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#F5F2EE]">
                  {t.home.founderPreviewTitle}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 dark:text-[#B8B3AF] leading-relaxed">
                  {t.home.founderPreviewText}
                </p>

                <p className="text-xs text-amber-800 dark:text-[#D8BD82] font-semibold italic">
                  {t.founder.shortQuote}
                </p>

                <div className="pt-2">
                  <GlowingButton
                    variant="primary"
                    onClick={() => onNavigate('founder')}
                    className="px-6 py-3 text-xs font-bold"
                  >
                    <span>{t.common.meetFounder}</span>
                  </GlowingButton>
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>
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
            <h3 className="text-base font-bold text-[#F5F2EE]">Lightning Fast Performance</h3>
            <p className="text-xs text-[#B8B3AF] leading-relaxed">
              Launch Bare Acts, perform land unit conversions, and draft legal memos instantly with smooth on-device processing.
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
                Download Less Legal today on your Android smartphone or tablet to access Bare Acts, PDF converters, and Case Diary.
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
