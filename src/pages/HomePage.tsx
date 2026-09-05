import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, 
  FileText, Calendar, Compass, Scale, Lock, CheckCircle2, 
  Smartphone, Check, Layers, LayoutGrid, Music, Edit3,
  Search, Zap, Share2, MessageSquare, ChevronRight,
  Copy, Play, ChevronDown, UserCheck, Gavel, BookOpen, Scan, Calculator, Grid,
  Rocket, Star, Users, Clock, User, Quote, Lightbulb, Target, Landmark
} from 'lucide-react';
import { LTLogo } from '../components/LTLogo';
import { ThreeDDeviceShowcase } from '../components/ThreeDDeviceShowcase';
import { 
  ScrollReveal, StaggerContainer, 
  StaggerItem, GlowingButton, HeroAmbientGlow 
} from '../components/MotionWrappers';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { sanitizePhoneNumber, isRateLimited, isSafeUrl } from '../utils/security';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

// Live Converter Units Reference (base in Sq. Ft.)
const SQFT_RATES: Record<string, { label: string; rate: number; region: string }> = {
  sqft: { label: 'वर्ग फुट (Sq. Ft.)', rate: 1, region: 'मानक (Standard)' },
  acre: { label: 'एकड़ (Acre)', rate: 43560, region: 'यूनिवर्सल' },
  bigha: { label: 'बीघा (Bigha)', rate: 27225, region: 'उत्तर/मध्य भारत' },
  guntha: { label: 'गुंठा (Guntha)', rate: 1089, region: 'महाराष्ट्र/गुजरात/दक्षिण' },
  kanal: { label: 'कनाल (Kanal)', rate: 5445, region: 'पंजाब/हरियाणा/J&K' },
  marla: { label: 'मरला (Marla)', rate: 272.25, region: 'उत्तर भारत' },
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [founderImgErr, setFounderImgErr] = useState(false);

  // Auto-scroll refs
  const simTabRef = useAutoScroll(0.7);
  const categoriesRef = useAutoScroll(0.7);

  const getProductDesc = (prod: (typeof SITE_CONFIG.products)[0]) => {
    if (language === 'hi') {
      if (prod.id === 'prod-less-legal') return 'कानून पेशेवरों और नागरिकों के लिए कानूनी ज्ञान एवं डिजिटल उपयोगिताएँ।';
      if (prod.id === 'prod-faget-app') return 'भारतीय लोगों के लिए इवेंट्स प्रबंधन ऐप। (Events management app for Indian Peoples)';
      if (prod.id === 'prod-less-music') return 'भारतीय संस्कृति का 3000+ ऑफ़लाइन संगीत हब। (3000+ offline music Hub of India\'s culture)';
      if (prod.id === 'prod-less-notes') return 'सरल और तेज़ उत्पादकता नोट्स एवं त्वरित दस्तावेज़ पैड।';
    }
    return prod.description;
  };

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
      alert(language === 'hi' ? 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
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
    { key: 'All', label: t.featuresPage.categories.all },
    { key: 'PDF & Files', label: t.featuresPage.categories.pdfFiles },
    { key: 'Legal Utilities', label: t.featuresPage.categories.legalUtilities },
    { key: 'Calculators & Converters', label: t.featuresPage.categories.calculatorsConverters },
    { key: 'Learning & Reference', label: t.featuresPage.categories.learningReference },
  ];

  // Category translation mapping
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'PDF & Files': return t.featuresPage.categories.pdfFiles;
      case 'Legal Utilities': return t.featuresPage.categories.legalUtilities;
      case 'Calculators & Converters': return t.featuresPage.categories.calculatorsConverters;
      case 'Learning & Reference': return t.featuresPage.categories.learningReference;
      default: return category;
    }
  };

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

  const faqs = t.home.faqs;

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8 overflow-hidden transition-colors duration-300">
      
      {/* 1. HERO SECTION WITH CINEMATIC GLASSMORPHISM & STUDIO FLOOR */}
      <section className="relative text-slate-900 dark:text-white pt-2 sm:pt-4 pb-8 sm:pb-12 overflow-hidden">
        <HeroAmbientGlow />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-8 sm:space-y-10">
          
          {/* Split Side-by-Side Grid for Laptop & Tablet Modes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Column: Brand Logo, App Name, Title, Subtitle & Action CTAs */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 sm:space-y-7 text-center sm:text-left flex flex-col items-center sm:items-start"
            >
              <div className="flex flex-col gap-3.5 sm:gap-4 items-center sm:items-start w-full">
                
                {/* Hero Status Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-900/30 border border-blue-200/80 dark:border-blue-700/40 text-[#2563EB] dark:text-blue-400 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-2xs backdrop-blur-md">
                  <Zap className="w-3.5 h-3.5 fill-[#2563EB] dark:fill-blue-400 text-[#2563EB] dark:text-blue-400" />
                  FLAGSHIP PRODUCT STUDIO
                </div>

                {/* Main Headline */}
                <div className="w-full flex flex-col gap-1.5 mt-1">
                  <h1 className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black tracking-tight leading-[1.04] text-slate-900 dark:text-white">
                    <span className="block text-slate-900 dark:text-slate-100">Less Legal :</span>
                    <span className="block mt-1">
                      All in One <span className="text-[#2563EB] dark:text-[#3B82F6]">Smart App</span>
                    </span>
                  </h1>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2 sm:mt-3">
                    {language === 'hi' ? 'पावरफुल डिजिटल टूल्स : मेड सिंपल' : 'Powerful Digital Tools : Made Simple'}
                  </h2>
                </div>
                
                {/* Subtitle Paragraph */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-[#B8B3AF] font-medium max-w-xl leading-relaxed mt-1">
                  {t.home.heroSubtitle}
                </p>
              </div>

              {/* Features Icons Grid (6 Items in a neat row) */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 w-full max-w-full sm:max-w-xl">
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-indigo-100/70 dark:bg-indigo-900/30 flex items-center justify-center shadow-xs border border-indigo-200/60 dark:border-indigo-800/40 group-hover:scale-105 transition-transform">
                    <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">Case Diary</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100/70 dark:bg-emerald-900/30 flex items-center justify-center shadow-xs border border-emerald-200/60 dark:border-emerald-800/40 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">Bare Acts</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-red-100/70 dark:bg-red-900/30 flex items-center justify-center shadow-xs border border-red-200/60 dark:border-red-800/40 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">PDF Tools</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-100/70 dark:bg-blue-900/30 flex items-center justify-center shadow-xs border border-blue-200/60 dark:border-blue-800/40 group-hover:scale-105 transition-transform">
                    <Scan className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">Scanner</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-100/70 dark:bg-amber-900/30 flex items-center justify-center shadow-xs border border-amber-200/60 dark:border-amber-800/40 group-hover:scale-105 transition-transform">
                    <Calculator className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">Calculations</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-purple-100/70 dark:bg-purple-900/30 flex items-center justify-center shadow-xs border border-purple-200/60 dark:border-purple-800/40 group-hover:scale-105 transition-transform">
                    <Grid className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">22+ Tools</span>
                </div>
              </div>

              {/* Action CTAs Row */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start justify-center sm:justify-start gap-4 pt-2 w-full">
                <button
                  onClick={() => onNavigate('download')}
                  className="flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-[#E02636] hover:bg-[#C21F2F] text-white shadow-[0_10px_25px_rgba(224,38,54,0.35)] transition-all transform hover:scale-[1.02] active:scale-95 w-full sm:w-auto shrink-0 group cursor-pointer"
                >
                  <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform shrink-0" />
                  <div className="text-left">
                    <div className="text-base sm:text-lg font-black leading-tight">Download Less Legal</div>
                    <div className="text-[10px] sm:text-xs font-semibold text-red-100 leading-tight mt-0.5">For Android (APK / Play Store)</div>
                  </div>
                </button>

                {/* Apple App Store Block */}
                <div className="flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-[#0D0D12] hover:bg-black text-white shadow-xl w-full sm:w-auto cursor-default shrink-0 transition-colors">
                  <svg className="w-6 h-6 fill-current text-white shrink-0 drop-shadow" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.24-9.94-1.81-14.77-6.14-3.32-2.92-7.25-7.65-11.8-14.19-6.3-8.99-11.23-18.72-14.77-29.2-3.54-10.48-5.31-20.35-5.31-29.61 0-12.28 3.12-22.58 9.38-30.9 6.25-8.32 14.16-12.58 23.71-12.78 4.67 0 9.77 1.15 15.3 3.44 5.53 2.29 9.38 3.44 11.55 3.44 2.06 0 5.96-1.15 11.71-3.44 5.75-2.29 10.66-3.35 14.73-3.18 10.15.53 18.23 4.29 24.26 11.27-9.08 5.53-13.52 13.1-13.31 22.7.21 7.57 3.09 13.9 8.64 18.99 5.55 5.09 12.22 7.9 20.02 8.44-2.53 7.42-6.02 14.91-10.47 22.48zM119.22 31.75c0-6.12 2.22-11.83 6.66-17.13 4.44-5.3 9.94-8.58 16.5-9.84.21 1.06.32 2.02.32 2.87 0 6.02-2.25 11.72-6.75 17.1-4.5 5.38-10.05 8.71-16.65 9.98-.08-.98-.08-1.96-.08-2.98z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-base sm:text-lg font-bold leading-tight">App Store</div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-400 leading-tight mt-0.5">Coming Soon for iOS</div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 mt-4 w-full text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-[#2563EB]" />
                  <div className="flex flex-col leading-tight text-left">
                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">10K+</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Happy Users</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
                  <div className="flex flex-col leading-tight text-left">
                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">4.8</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">User Rating</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  <div className="flex flex-col leading-tight text-left">
                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">Trusted</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Safe & Secure</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Rocket className="w-6 h-6 text-blue-500" />
                  <div className="flex flex-col leading-tight text-left">
                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white">27+</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Useful Tools</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 3D Interactive Android Device Showcase + Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 w-full flex justify-center items-center"
            >
              <ThreeDDeviceShowcase imageSrc="/Screenshot.jpg" language={language} />
            </motion.div>
          </div>

          {/* Bottom Feature Bar (Frosted Glass Pill Container) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="rounded-3xl sm:rounded-full bg-white/85 dark:bg-white/5 backdrop-blur-2xl border border-white/90 dark:border-white/10 shadow-[0_20px_45px_-12px_rgba(37,99,235,0.08)] py-5 px-6 sm:px-10 flex flex-wrap items-center justify-between gap-6 w-full"
          >
            <div className="flex items-center gap-3.5 group cursor-default">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0">
                <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-tight">Simple Interface</span>
                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Easy for everyone</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0">
                <Clock className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-tight">Save Time</span>
                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Get work done faster</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0">
                <Smartphone className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-tight">All in One</span>
                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Multiple tools in one app</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-tight">100% Secure</span>
                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Your data is safe</span>
              </div>
            </div>
            
            {/* Decorative Cursive Handwriting */}
            <div className="hidden xl:block transform -rotate-3 text-right">
              <div className="font-serif italic font-extrabold text-lg sm:text-xl text-[#2563EB] dark:text-[#60A5FA] tracking-wide leading-tight">
                Less Effort
              </div>
              <div className="font-serif italic font-extrabold text-xl sm:text-2xl text-[#2563EB] dark:text-[#60A5FA] tracking-wide leading-tight -mt-0.5">
                More Possibilities
              </div>
              <div className="w-full h-1 rounded-full bg-gradient-to-r from-transparent via-[#2563EB] to-transparent opacity-80 mt-1" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. INTERACTIVE LIVE APP SIMULATOR SHOWCASE */}
      <section id="interactive-simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-6 space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C21F2F]/15 border border-[#C21F2F]/30 text-[#C21F2F] dark:text-[#E03A3E] text-xs font-bold">
            <Smartphone className="w-4 h-4" />
            {t.home.simBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.simTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
            {t.home.simSub}
          </p>
        </ScrollReveal>

        {/* Simulator Tabs Header */}
        <div className="overflow-hidden w-full pb-4 mask-edges-x max-w-7xl mx-auto px-1">
          <div ref={simTabRef} className="flex items-center overflow-x-auto no-scrollbar w-full select-none cursor-grab">
            {[...Array(4)].map((_, arrayIdx) => (
              <div key={arrayIdx} className="flex items-center gap-2 pr-2 shrink-0">
                {[
                  { id: 'diary', icon: Calendar, label: t.home.simDiary, iconColor: 'text-[#C21F2F] dark:text-[#E03A3E]' },
                  { id: 'converter', icon: Compass, label: t.home.simConverter, iconColor: 'text-[#C21F2F] dark:text-[#E03A3E]' },
                  { id: 'pdf', icon: FileText, label: t.home.simPdf, iconColor: 'text-[#C21F2F] dark:text-[#E03A3E]' },
                  { id: 'whatsapp', icon: MessageSquare, label: t.home.simWhatsapp, iconColor: 'text-[#25D366]' }
                ].map((tab) => (
                  <button
                    key={`${tab.id}-${arrayIdx}`}
                    onClick={() => setSimTab(tab.id as typeof simTab)}
                    className={`shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap badge-one-line border active-click-scale ${
                      simTab === tab.id
                        ? 'btn-crimson text-white border-[#C21F2F]'
                        : 'bg-white dark:bg-white/5 text-slate-700 dark:text-[#B8B3AF] border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-[#F5F2EE] shadow-xs'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 shrink-0 ${tab.iconColor}`} />
                    <span className="whitespace-nowrap badge-one-line">{tab.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Simulator Frame Container */}
        <div className="glass-panel-gradient rounded-3xl p-4 sm:p-8 border border-slate-200 dark:border-white/12 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          {/* Subtle Ambient Red Blur Inside Card */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#8B0000]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Phone Header Mockup */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3.5 mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#C21F2F]/20 border border-[#C21F2F]/40 flex items-center justify-center text-[#C21F2F] dark:text-[#E03A3E] shrink-0">
                <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2 whitespace-nowrap badge-one-line">
                  <span className="whitespace-nowrap badge-one-line">{t.home.simInterfaceLabel}</span>
                  <span className="text-[10px] bg-amber-500/10 dark:bg-[#D8BD82]/20 text-amber-700 dark:text-[#D8BD82] px-2 py-0.5 rounded-full border border-amber-600/30 dark:border-[#D8BD82]/40 font-semibold whitespace-nowrap badge-one-line">
                    {t.home.simOnDeviceBadge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simSandboxSub}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-600 dark:text-[#B8B3AF] shrink-0">
              <Lock className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap badge-one-line">{t.home.simEncryptedLabel}</span>
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
                <div className="bg-white dark:bg-[#0A0A0C]/90 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#B8B3AF] gap-2">
                    <span className="font-bold text-[#C21F2F] dark:text-[#E03A3E] whitespace-nowrap badge-one-line">{t.home.simScheduleTitle}</span>
                    <span className="whitespace-nowrap badge-one-line shrink-0">{t.home.simActiveCases}</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] truncate">Sharma vs. State of UP</div>
                        <div className="text-[11px] text-slate-600 dark:text-[#B8B3AF] truncate">Court No. 4 • Criminal Appeal • Item #12</div>
                      </div>
                      <span className="text-[10px] font-bold bg-red-100 dark:bg-[#C21F2F]/20 text-red-700 dark:text-[#E03A3E] px-2.5 py-1 rounded-lg border border-red-200 dark:border-[#C21F2F]/40 whitespace-nowrap badge-one-line shrink-0">
                        {t.home.simArgumentsStage}
                      </span>
                    </div>

                    <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] truncate">Verma Infra vs. City Development</div>
                        <div className="text-[11px] text-slate-600 dark:text-[#B8B3AF] truncate">District Tribunal • Arbitration • Item #5</div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 dark:bg-[#D8BD82]/20 text-amber-700 dark:text-[#D8BD82] px-2.5 py-1 rounded-lg border border-amber-200 dark:border-[#D8BD82]/40 whitespace-nowrap badge-one-line shrink-0">
                        {t.home.simEvidenceStage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-white dark:bg-[#0A0A0C]/90 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none text-center">
                    <div className="text-xl font-extrabold text-[#C21F2F] dark:text-[#E03A3E]">24</div>
                    <div className="text-[10px] text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simPendingTasks}</div>
                  </div>
                  <div className="p-3.5 bg-white dark:bg-[#0A0A0C]/90 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none text-center">
                    <div className="text-xl font-extrabold text-[#C21F2F] dark:text-[#E03A3E]">100%</div>
                    <div className="text-[10px] text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simAutoSavedNotes}</div>
                  </div>
                  <div className="p-3.5 bg-white dark:bg-[#0A0A0C]/90 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none text-center col-span-2 sm:col-span-1">
                    <div className="text-xl font-extrabold text-slate-900 dark:text-[#F5F2EE]">Local</div>
                    <div className="text-[10px] text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simOnDeviceDb}</div>
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
                <div className="bg-white dark:bg-[#0A0A0C]/90 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#C21F2F] dark:text-[#E03A3E] whitespace-nowrap badge-one-line block">{t.home.simTypeQuantity}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={landValue}
                          onChange={(e) => setLandValue(parseFloat(e.target.value) || 0)}
                          className="w-24 sm:w-28 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl text-slate-900 dark:text-[#F5F2EE] text-sm font-bold focus:outline-none focus:border-[#C21F2F]"
                        />
                        <select
                          value={landUnit}
                          onChange={(e) => setLandUnit(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C21F2F]"
                        >
                          {Object.entries(SQFT_RATES).map(([key, u]) => (
                            <option key={key} value={key} className="bg-white dark:bg-[#0A0A0C] text-slate-900 dark:text-[#F5F2EE]">{u.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simBaseSqFt}</div>
                      <div className="text-base font-extrabold text-[#C21F2F] dark:text-[#E03A3E] whitespace-nowrap badge-one-line">{baseSqFt.toLocaleString()} Sq. Ft.</div>
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
                              ? 'bg-red-50 dark:bg-[#C21F2F]/20 border-red-300 dark:border-[#C21F2F]/60 text-red-900 dark:text-white shadow-sm dark:shadow-none' 
                              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-[#B8B3AF]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#B8B3AF] mb-1">
                            <span className="whitespace-nowrap badge-one-line">{u.label}</span>
                            {copiedUnit === key ? <Check className="w-3 h-3 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> : <Copy className="w-3 h-3 text-slate-400 dark:text-[#77736F] shrink-0" />}
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{convertedVal}</div>
                          <div className="text-[9px] text-[#C21F2F] dark:text-[#E03A3E]/80 mt-0.5 whitespace-nowrap badge-one-line">{u.region}</div>
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
                <div className="bg-white dark:bg-[#0A0A0C]/90 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-3">
                  <div className="text-xs font-bold text-[#C21F2F] dark:text-[#E03A3E] whitespace-nowrap badge-one-line">{t.home.simPdfProcessingTitle}</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <FileText className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E] mb-1" />
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{t.home.simPdfMergeTitle}</div>
                      <div className="text-[10px] text-slate-600 dark:text-[#B8B3AF]">{t.home.simPdfMergeDesc}</div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <Lock className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E] mb-1" />
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{t.home.simPdfEncryptTitle}</div>
                      <div className="text-[10px] text-slate-600 dark:text-[#B8B3AF]">{t.home.simPdfEncryptDesc}</div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
                      <Share2 className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E] mb-1" />
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{t.home.simPdfTransferTitle}</div>
                      <div className="text-[10px] text-slate-600 dark:text-[#B8B3AF]">{t.home.simPdfTransferDesc}</div>
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
                <div className="bg-white dark:bg-[#0A0A0C]/90 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#C21F2F] dark:text-[#E03A3E] whitespace-nowrap badge-one-line">
                    <span>{t.home.simWhatsappTitle}</span>
                    <span className="text-[10px] bg-green-100 dark:bg-[#25D366]/20 text-green-700 dark:text-[#25D366] px-2 py-0.5 rounded-md border border-green-200 dark:border-[#25D366]/40">{language === 'hi' ? 'वास्तविक टूल' : 'Real Working Tool'}</span>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 space-y-3 max-w-lg">
                    <div className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                      {t.home.simWhatsappSub}
                    </div>
                    
                    {/* Compact input & Left-aligned Chat Now Button */}
                    <div className="flex flex-wrap items-center justify-start gap-2.5 pt-1">
                      {/* Compact Number Input Box */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 w-36 sm:w-44 focus-within:border-[#C21F2F] transition-colors">
                        <span className="text-xs font-bold text-[#C21F2F] dark:text-[#E03A3E] shrink-0">+91</span>
                        <input
                          type="tel"
                          value={waNumber}
                          onChange={(e) => setWaNumber(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleOpenWhatsApp();
                          }}
                          placeholder="9876543210"
                          className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-[#F5F2EE] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                          maxLength={15}
                        />
                      </div>

                      {/* Small Chat Now Button moved to Left Side */}
                      <button 
                        onClick={handleOpenWhatsApp}
                        className="px-3 py-2 btn-crimson text-white font-bold text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap badge-one-line shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
                        title={t.home.simWhatsappBtn}
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#25D366]" />
                        <span className="whitespace-nowrap badge-one-line">{t.home.simWhatsappBtn}</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-[#77736F] flex items-center gap-1 pt-0.5">
                      <Lock className="w-3 h-3 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
                      <span>{language === 'hi' ? 'व्हाट्सएप ऐप या वेब को सीधे आपके डिवाइस पर खोलता है। शून्य डेटा सहेजा गया।' : 'Opens WhatsApp app or web directly on your device. Zero data saved.'}</span>
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
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-700 dark:text-[#D8BD82] text-xs font-bold">
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.home.ecosystemBadge || "Product Ecosystem"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.ecosystemTitle || "Built by Less Creation"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
            {t.home.ecosystemSub || "Discover our suite of independent digital tools designed to simplify daily workflows."}
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE_CONFIG.products.map((product) => {
            const isFlagship = product.category === 'Flagship Product';
            const isAvailable = product.status === 'Available';

            let IconComp = Scale;
            if (product.iconName === 'Calendar') IconComp = Calendar;
            if (product.iconName === 'Music') IconComp = Music;
            if (product.iconName === 'Edit3') IconComp = Edit3;

            return (
              <StaggerItem key={product.id} interactive={true}>
                <div className={`group relative p-6 rounded-3xl transition-all duration-300 h-full flex flex-col flash-card-animation ${
                  isFlagship 
                    ? 'glass-panel-crimson text-slate-900 dark:text-[#F5F2EE]' 
                    : 'glass-card text-slate-900 dark:text-[#F5F2EE]'
                }`}>
                  
                  {isFlagship && (
                    <div className="absolute top-0 right-0 -mt-3 mr-4">
                      <span className="bg-gradient-to-r from-[#D8BD82] to-[#C7A96B] text-[#080808] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                        {language === 'hi' ? 'प्रमुख ऐप (Flagship)' : 'Flagship App'}
                      </span>
                    </div>
                  )}

                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#C21F2F] dark:text-[#E03A3E] flex items-center justify-center mb-5 transition-transform group-hover:scale-110">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F2EE]">
                        {product.name}
                      </h3>
                      {!isAvailable && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-[#D8BD82] bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 whitespace-nowrap">
                          {language === 'hi' ? 'विकास में (In Development)' : 'In Development'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                      {getProductDesc(product)}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                    {isAvailable ? (
                      <button
                        onClick={() => product.downloadUrl && onNavigate('download')}
                        className="w-full py-2.5 rounded-xl text-xs font-bold btn-crimson flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'ऐप प्राप्त करें' : 'Get App'}</span>
                      </button>
                    ) : (
                      <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#77736F] flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
                        <span>{language === 'hi' ? 'विकास में (In Development)' : 'In Development'}</span>
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
          <div className="p-6 sm:p-10 rounded-[28px] bg-white/95 dark:bg-[#121622]/95 border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden relative backdrop-blur-xl">
            
            {/* Background glowing effects for the section */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10">
              
              {/* Left Column: Image & Quote */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                {/* Image Card */}
                <div className="relative rounded-[24px] p-2 bg-gradient-to-b from-slate-100 to-white dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/10 shadow-lg group">
                  <div className="relative w-full aspect-[4/5] rounded-[18px] overflow-hidden bg-slate-900 isolate">
                    {!founderImgErr ? (
                      <img 
                        src="/images/anurag_tiwari.jpg" 
                        alt="Anurag Gurauli — Founder of Less Creation"
                        onError={() => setFounderImgErr(true)}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 rounded-[18px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center rounded-[18px]">
                        <Scale className="w-10 h-10 text-amber-500 mb-2" />
                        <div className="text-sm font-bold text-white">{t.founder.name}</div>
                        <div className="text-[10px] text-amber-400">{t.founder.role}</div>
                      </div>
                    )}
                    
                    {/* Compact Professional Name Plate (Patti) Overlay */}
                    <div className="absolute bottom-2 inset-x-2.5 p-2 sm:p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-center shadow-md">
                      {/* Golden Accent Patti Header */}
                      <div className="inline-block px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs leading-none">
                        FOUNDER & ADVOCATE
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase mt-0.5 leading-tight">Anurag Gurauli</h4>
                      <p className="text-[10px] text-amber-200/90 font-semibold leading-tight mt-0.5">
                        Founder, Less Creation • Advocate, High Court
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quote Card */}
                <div className="rounded-[20px] bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-5 relative">
                  <Quote className="w-6 h-6 text-red-500/40 absolute top-4 left-4" />
                  <div className="pl-8">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">
                      {isHindi 
                        ? 'प्रौद्योगिकी को उपयोगी ज्ञान, कानूनी उपकरण और डिजिटल सेवाओं को सभी के लिए आसान बनाना चाहिए।'
                        : 'Technology should make useful knowledge, legal tools and digital services easier to access.'}
                    </p>
                    <p className="text-[11px] font-bold text-[#C21F2F] mt-3">
                      — Anurag Gurauli
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle Column: Text & Features */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-[#C21F2F] dark:text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-100 dark:border-red-900/30">
                    <User className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'संस्थापक से मिलें' : 'MEET THE FOUNDER'}</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                    {isHindi ? 'वास्तविक उपयोगिता के लिए एक' : 'Created by an Advocate for'}{' '}
                    <span className="text-[#C21F2F]">{isHindi ? 'अधिवक्ता द्वारा निर्मित' : 'Real-World Utility'}</span>
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isHindi 
                      ? 'अनुराग गुरौली, इलाहाबाद उच्च न्यायालय में कार्यरत अधिवक्ता ने, कानूनी पहुंच और रोजमर्रा के डिजिटल कार्यों को आसान बनाने के लिए Less Creation की स्थापना की।' 
                      : 'Anurag Gurauli, Advocate practicing before the Allahabad High Court, founded Less Creation to simplify legal access and everyday digital tasks.'}
                  </p>
                </div>

                {/* 4 Feature Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Card 1 */}
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[#C21F2F] dark:text-red-400 shrink-0">
                      <Gavel className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {isHindi ? 'कानूनी पृष्ठभूमि' : 'Legal Background'}
                    </span>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {isHindi ? 'समस्या केंद्रित' : 'Problem Focused'}
                    </span>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {isHindi ? 'उपयोगकर्ता दृष्टिकोण' : 'User First Approach'}
                    </span>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {isHindi ? 'व्यावहारिक समाधान' : 'Practical Solutions'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isHindi 
                    ? 'Less Creation एक सरल विचार पर बना है: प्रौद्योगिकी को उपयोगी ज्ञान, कानूनी उपकरण और डिजिटल सेवाओं को सभी के लिए आसान बनाना चाहिए।' 
                    : 'Less Creation is built around a simple idea: technology should make useful knowledge, legal tools and digital services easier to access for everyone.'}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('founder')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C21F2F] hover:bg-[#A61825] text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    <User className="w-4 h-4" />
                    <span>{isHindi ? 'संस्थापक के बारे में अधिक जानें' : 'Know More About Founder'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Right Column: Graphic & Sidebar Card */}
              <div className="lg:col-span-3 flex flex-col justify-center items-center lg:items-end space-y-8 mt-6 lg:mt-0 relative">
                
                {/* Handwriting Graphic Text */}
                <div className="text-center lg:text-right relative mt-4 lg:mt-0">
                  <p className="font-serif italic text-2xl sm:text-3xl text-slate-800 dark:text-slate-200 leading-tight">
                    {isHindi ? 'लोगों के लिए' : 'Law'}<br />
                    {isHindi ? 'कानूनी तकनीक' : 'Technology'}<br />
                    {isHindi ? '' : 'For People'}
                  </p>
                  <svg className="absolute -bottom-4 right-0 w-32 h-4 text-[#C21F2F]" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                {/* Built with Real Experience Card */}
                <div className="w-full lg:max-w-[220px] xl:max-w-[240px] bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400">
                    <Landmark className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      {isHindi ? 'वास्तविक अनुभव से निर्मित' : 'Built with Real Experience'}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isHindi 
                        ? 'वास्तविक उपयोग के लिए डिज़ाइन किए गए व्यावहारिक कानूनी इनसाइट्स।' 
                        : 'Practical legal insights designed for real-world use cases.'}
                    </p>
                  </div>
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#C21F2F] dark:text-[#E03A3E]">
              {t.home.featureSectionBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight mt-1">
              {t.home.featureSectionTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#B8B3AF] mt-1 max-w-xl">
              {t.home.featureSectionSub}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 dark:text-[#77736F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'सुविधाएं खोजें (जैसे Bare Acts, Bigha)...' : 'Search features (e.g. Bare Acts, Bigha)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/95 dark:bg-[#121622]/95 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-[#F5F2EE] focus:outline-none focus:border-[#C21F2F] shadow-sm transition-all"
            />
          </div>
        </ScrollReveal>

        {/* Filter Categories Bar */}
        <div className="overflow-hidden w-full pb-2 mask-edges-x">
          <div ref={categoriesRef} className="flex items-center overflow-x-auto no-scrollbar w-full select-none cursor-grab">
            {[...Array(4)].map((_, arrayIdx) => (
              <div key={arrayIdx} className="flex items-center gap-2 pr-2 shrink-0">
                {categories.map((cat, idx) => (
                  <button
                    key={`${cat.key}-${idx}-${arrayIdx}`}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap badge-one-line transition-all cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'btn-crimson font-bold text-white shadow-md'
                        : 'bg-white/95 dark:bg-[#121622]/95 backdrop-blur-md text-slate-700 dark:text-[#B8B3AF] border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-[#F5F2EE] shadow-sm'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Items Grid */}
        <div className="min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredFeatures.slice(0, 12).map((item, idx) => {
                const colorThemes = [
                  { iconBg: 'bg-indigo-100 dark:bg-indigo-950/40 text-[#2563EB]', icon: Scale, catBg: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200/70' },
                  { iconBg: 'bg-red-100 dark:bg-red-950/40 text-[#E02636]', icon: FileText, catBg: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200/70' },
                  { iconBg: 'bg-emerald-100 dark:bg-emerald-950/40 text-[#059669]', icon: BookOpen, catBg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/70' },
                  { iconBg: 'bg-amber-100 dark:bg-amber-950/40 text-[#D97706]', icon: Calculator, catBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200/70' },
                  { iconBg: 'bg-purple-100 dark:bg-purple-950/40 text-[#7C3AED]', icon: Calendar, catBg: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200/70' },
                  { iconBg: 'bg-blue-100 dark:bg-blue-950/40 text-[#0284C7]', icon: Scan, catBg: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200/70' }
                ];
                const theme = colorThemes[idx % colorThemes.length];
                const IconComp = theme.icon;

                return (
                  <motion.div 
                    key={item.id}
                    whileHover={{ y: -4 }}
                    className="rounded-[24px] bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-[#121622] dark:via-[#182035] dark:to-[#121622] border border-blue-100/70 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_35px_-8px_rgba(37,99,235,0.12)] hover:border-blue-300 dark:hover:border-blue-700/50 p-5 sm:p-6 flex flex-col justify-between transition-all group backdrop-blur-xl"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${theme.catBg} leading-tight whitespace-nowrap`}>
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.highlights.map((tag, hIdx) => (
                          <span key={hIdx} className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div 
                        onClick={() => onNavigate('features')}
                        className="pt-3 border-t border-blue-100/80 dark:border-white/10 flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors flex items-center gap-1.5">
                          <span>{language === 'hi' ? 'टूल खोलें' : 'Open Tool'}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>

                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl p-6">
            <Search className="w-8 h-8 text-[#77736F] mx-auto mb-2" />
            <div className="text-sm font-bold text-[#F5F2EE]">No features found matching "{searchQuery}"</div>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 text-xs font-semibold text-[#D8BD82] underline"
            >
              Clear filters and view all 22 tools
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#C21F2F] dark:text-[#E03A3E]">
            Engineered for Security & Speed
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            Why Choose Less Legal?
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#B8B3AF]">
            Built from the ground up to guarantee user privacy, zero cloud dependency, and effortless practice organization.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card flash-card-animation p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">100% On-Device Privacy</h3>
            <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
              Your client notes, hearing schedules, and PDF documents stay strictly on your local Android device storage. Zero cloud telemetry.
            </p>
          </div>

          <div className="glass-card flash-card-animation p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-[#D8BD82] border border-amber-600/40 dark:border-[#D8BD82]/40 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">Lightning Fast Performance</h3>
            <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
              Launch Bare Acts, perform land unit conversions, and draft legal memos instantly with smooth on-device processing.
            </p>
          </div>

          <div className="glass-card flash-card-animation p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#E03A3E] border border-[#C21F2F]/40 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">All-in-One PDF Suite</h3>
            <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
              Merge, split, protect, and compress legal filings effortlessly. Transfer heavy files directly device-to-device with LessShare.
            </p>
          </div>

          <div className="glass-card flash-card-animation p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-[#D8BD82] border border-amber-600/40 dark:border-[#D8BD82]/40 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">Fixed-Validity Passes</h3>
            <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
              Transparent one-time purchases for ad-free access. Zero auto-renewing subscriptions or unexpected bank debits.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING & AD-FREE PASSES */}
      <section className="glass-panel-gradient py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden border border-slate-200 dark:border-white/15 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#8B0000]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-[#C21F2F]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          <ScrollReveal direction="up" className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 dark:bg-[#D8BD82]/15 text-amber-700 dark:text-[#D8BD82] border border-amber-600/30 dark:border-[#D8BD82]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E]" />
              {t.premiumPage.badge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F2EE]">
              {t.premiumPage.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#B8B3AF] max-w-2xl mx-auto">
              {t.premiumPage.subtitle}
            </p>
          </ScrollReveal>

          <div className="max-w-xl mx-auto text-left">
            <div className="relative">
              <div className="glass-panel-crimson flash-card-animation glow-crimson-gold rounded-3xl p-6 sm:p-8 border-2 border-amber-600/40 dark:border-[#D8BD82]/40 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#C21F2F] dark:text-[#E03A3E]">
                      {language === 'hi' ? 'स्थायी लाइफटाइम पास (स्पेशल ऑफर)' : 'Lifetime Premium Pass (Special Offer)'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 dark:text-[#080808] bg-amber-500/20 dark:bg-[#D8BD82] px-3 py-1 rounded-full border border-amber-600/40 dark:border-transparent whitespace-nowrap animate-pulse">
                      {language === 'hi' ? 'सीमित समय ऑफर' : 'Limited Time Offer'}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extrabold text-[#C21F2F] dark:text-[#E03A3E]">₹99</span>
                    <span className="text-xs text-slate-500 dark:text-[#B8B3AF] line-through">₹179</span>
                    <span className="text-xs text-slate-600 dark:text-[#B8B3AF]">
                      {language === 'hi' ? '/ एकमुश्त स्थायी भुगतान' : '/ one-time lifetime payment'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#B8B3AF] mb-4 leading-relaxed font-semibold">
                    {language === 'hi' 
                      ? 'स्पेशल ऑफर! अब सिर्फ ₹99 के एकमुश्त भुगतान में आपकी पंजीकृत ईमेल आईडी (Registered Email) को स्थायी (Permanently) रूप से लाइफटाइम प्रीमियम बना दिया जाएगा।' 
                      : 'Special Offer! Single ₹99 purchase permanently links Lifetime Premium status to your registered Email ID forever.'}
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#B8B3AF]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                      <span>{language === 'hi' ? 'आपकी पंजीकृत ईमेल आईडी पर हमेशा के लिए विज्ञापन-मुक्त अनुभव' : '100% ad-free experience bound to your Email ID forever'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                      <span>{language === 'hi' ? 'सभी 46+ टूल्स, केस डायरी एवं पीडीएफ वर्कस्पेस की अनलॉक्ड पहुँच' : 'Unlocked access to all 46+ tools, case diary & PDF workspace'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                      <span>{language === 'hi' ? 'कोई आवर्ती शुल्क नहीं, कोई ऑटो-डेबिट नहीं' : 'Strictly one-time payment with zero recurring auto-debit'}</span>
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => onNavigate('premium')}
                  className="w-full py-3.5 rounded-xl btn-crimson font-bold text-xs cursor-pointer text-white shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{language === 'hi' ? 'लाइफटाइम पास विवरण एवं खरीद (₹99)' : 'Get Lifetime Pass (₹99)'}</span>
                </button>
              </div>

              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D8BD82] to-[#C7A96B] text-[#080808] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-lg z-10">
                {language === 'hi' ? 'स्थायी पास' : 'PERMANENT PASS'}
              </div>
            </div>
          </div>
          <div className="pt-2 text-xs text-slate-500 dark:text-[#77736F]">
            {language === 'hi' ? 'खरीदारी सीधे Less Legal एंड्रॉइड ऐप के भीतर प्रमाणित भुगतान गेटवे के माध्यम से की जाती है।' : 'Purchases are made securely inside the Android application via certified Play Store / Razorpay gateway.'}
          </div>

        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal direction="up" className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C21F2F] dark:text-[#E03A3E]">
            {t.home.faqBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.faqTitle}
          </h2>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div 
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden transition-all border border-slate-200 dark:border-white/10"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-[#F5F2EE] focus:outline-none cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-[#77736F] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C21F2F] dark:text-[#E03A3E]' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-700 dark:text-[#B8B3AF] leading-relaxed border-t border-slate-200 dark:border-white/10 pt-3">
                        {faq.a}
                      </div>
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
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
                {language === 'hi' ? 'अपने कानूनी वर्कफ़्लो को सरल बनाने के लिए तैयार हैं?' : 'Ready to Simplify Your Legal Workflow?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF] max-w-xl mx-auto">
                {language === 'hi' ? 'Bare Acts, PDF कन्वर्टर्स और केस डायरी एक्सेस करने के लिए आज ही अपने एंड्रॉइड स्मार्टफोन या टैबलेट पर Less Legal डाउनलोड करें।' : 'Download Less Legal today on your Android smartphone or tablet to access Bare Acts, PDF converters, and Case Diary.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <GlowingButton
                onClick={() => onNavigate('download')}
                variant="primary"
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'hi' ? 'एंड्रॉइड APK डाउनलोड करें' : 'Download Android APK'}</span>
              </GlowingButton>
              
              <GlowingButton
                onClick={() => onNavigate('about')}
                variant="secondary"
                className="w-full sm:w-auto px-8 py-4 text-sm font-bold"
              >
                <span>Less Creation {language === 'hi' ? 'के बारे में' : 'About'}</span>
              </GlowingButton>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-600 dark:text-[#77736F]">
              <span>{language === 'hi' ? 'एंड्रॉइड 7.0+ न्यूनतम' : 'Android 7.0+ Minimum'}</span>
              <span>•</span>
              <span>{language === 'hi' ? '100% ऑन-डिवाइस स्टोरेज' : '100% On-Device Storage'}</span>
              <span>•</span>
              <span>{language === 'hi' ? 'स्वतंत्र और तथ्यात्मक' : 'Independent & Factual'}</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
