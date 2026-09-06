import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, 
  FileText, Calendar, Compass, Scale, Lock, CheckCircle2, 
  Smartphone, Check, Layers, LayoutGrid, Music, Edit3,
  Search, Zap, Share2, MessageSquare, ChevronRight,
  Copy, Play, ChevronDown, UserCheck, Gavel, BookOpen, Scan, Calculator, Grid,
  Rocket, Star, Users, Clock, User, Quote, Lightbulb, Target, Landmark,
  Shield, Server, Award, Cpu, RefreshCw, KeyRound, ExternalLink, HelpCircle
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
  const [liftedProducts, setLiftedProducts] = useState<Record<string, boolean>>({});
  const [liftedFeatures, setLiftedFeatures] = useState<Record<string, boolean>>({});

  // Sync countdown timer with the Navbar top banner
  const [timeLeft, setTimeLeft] = useState({ hours: 38, minutes: 47, seconds: 12 });

  React.useEffect(() => {
    const STORAGE_KEY = 'less_legal_promo_target_v3_38h';
    let targetTime = localStorage.getItem(STORAGE_KEY);
    
    if (!targetTime) {
      const newTarget = Date.now() + (38 * 3600 + 47 * 60 + 12) * 1000;
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
      targetTime = newTarget.toString();
    }

    const interval = setInterval(() => {
      const difference = parseInt(targetTime!) - Date.now();
      if (difference <= 0) {
        const newTarget = Date.now() + (38 * 3600 + 47 * 60 + 12) * 1000;
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
      } else {
        const h = Math.floor(difference / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Interactive Live Simulator State
  const [simTab, setSimTab] = useState<'diary' | 'converter' | 'pdf' | 'whatsapp'>('diary');
  const simTabRef = useAutoScroll(0.7);
  const categoriesRef = useAutoScroll(0.7);

  // 1. Live Land Converter State
  const [landValue, setLandValue] = useState<number>(1);
  const [landUnit, setLandUnit] = useState<string>('bigha');
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  // 2. Search & Category State for Catalog
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // 3. Direct WhatsApp Tool State
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

  // Interactive FAQ Accordion State
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
    <div className="space-y-10 sm:space-y-14 py-2 sm:py-4 overflow-hidden transition-colors duration-300 pb-16">
      
      {/* 1. HERO SECTION: LESS CREATION PARENT BRAND */}
      <section className="relative text-slate-900 dark:text-white pt-1 sm:pt-4 pb-6 sm:pb-10 overflow-hidden">
        <HeroAmbientGlow />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-6 sm:space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Column: Brand Statement & Action CTAs */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-5 sm:space-y-7 text-center sm:text-left flex flex-col items-center sm:items-start"
            >
              <div className="flex flex-col gap-2.5 sm:gap-3.5 items-center sm:items-start w-full">
                
                {/* Brand Studio Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200/90 dark:border-blue-700/40 text-blue-700 dark:text-blue-300 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-2xs backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{t.home.heroBadge || "LESS CREATION • TECHNOLOGY & PRODUCT STUDIO"}</span>
                </div>

                {/* Primary Company Headline */}
                <div className="w-full flex flex-col gap-1 mt-0.5">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.8rem] font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                    <span className="block text-slate-900 dark:text-slate-100">
                      {isHindi ? t.home.heroTitlePart1 : "Technology that makes"}
                    </span>
                    <span className="block mt-0.5 text-blue-600 dark:text-blue-400">
                      {isHindi ? t.home.heroTitlePart2 : "difficult things simple."}
                    </span>
                  </h1>
                </div>
                
                {/* Core Brand Description */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-[#B8B3AF] font-medium max-w-xl leading-relaxed mt-0.5">
                  {t.home.heroSubtitle || "Less Creation builds simple, useful and affordable digital products designed to solve real-world problems."}
                </p>
              </div>

              {/* Action CTAs Row */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start justify-center sm:justify-start gap-3.5 sm:gap-4 pt-2 w-full">
                {/* Primary CTA: Explore Products */}
                <button
                  id="hero-explore-products-btn"
                  onClick={() => scrollToSection('product-ecosystem')}
                  className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:via-blue-600 hover:to-sky-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_14px_32px_rgba(37,99,235,0.45)] border border-white/20 transition-all transform hover:scale-[1.02] active:scale-95 w-full sm:w-auto shrink-0 group cursor-pointer font-extrabold text-sm sm:text-base whitespace-nowrap badge-one-line"
                >
                  <LayoutGrid className="w-5 h-5 shrink-0" />
                  <span>{t.home.ctaExploreProducts || "Explore Products"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Secondary CTA: Discover Flagship App (Less Legal) */}
                <button
                  id="hero-discover-flagship-btn"
                  onClick={() => scrollToSection('flagship-section')}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-white/90 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200/90 dark:border-white/15 shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02] active:scale-95 w-full sm:w-auto shrink-0 cursor-pointer font-bold text-sm sm:text-base whitespace-nowrap badge-one-line backdrop-blur-md"
                >
                  <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{t.home.ctaDiscoverLessLegal || "Discover Less Legal"}</span>
                </button>
              </div>

              {/* Trust Indicators Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 w-full text-slate-800 dark:text-slate-200 border-t border-slate-200/70 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold leading-tight">{t.home.trustFastEngine}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold leading-tight">{t.home.trustPrivacy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold leading-tight">{t.home.trustToolsCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold leading-tight">{t.home.trustAndroidReady}</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 3D Interactive Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 w-full flex justify-center items-center"
            >
              <ThreeDDeviceShowcase imageSrc="/Screenshot.jpg" language={language} />
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. PRODUCT ECOSYSTEM SECTION */}
      <section id="product-ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-white/5 border border-blue-500/20 dark:border-blue-400/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.home.ecosystemBadge || "PRODUCT ECOSYSTEM"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.ecosystemTitle || "Products Built for Real-World Use"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#B8B3AF] leading-relaxed max-w-2xl mx-auto">
            {t.home.ecosystemSub || "Purposeful digital applications crafted for clarity, utility, and everyday efficiency."}
          </p>
        </ScrollReveal>

        {/* Ecosystem Grid: 1 Flagship Hero Card + 3 Innovation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Flagship Product Card: Less Legal (Occupies 7 cols on desktop) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white dark:from-[#111827] dark:via-[#0F172A] dark:to-[#1E293B] border-2 border-blue-500/50 dark:border-blue-400/40 shadow-[0_20px_50px_rgba(59,130,246,0.18)] flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                <span>{t.home.flagshipBadge || "FLAGSHIP PRODUCT"}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {isHindi ? "उपलब्ध • एंड्रॉइड 7.0+" : "Available • Android 7.0+"}
              </span>
            </div>

            {/* Product Body */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {t.home.flagshipTitle || "Less Legal"}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {isHindi ? "ऑल-इन-वन स्मार्ट कानूनी वर्कस्पेस" : "All-in-One Smart Legal Workspace"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {t.home.flagshipDesc || "An all-in-one smart workspace bringing practical legal utilities, reference tools, PDF tools and everyday productivity features together."}
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  isHindi ? "बेयर एक्ट्स लाइब्रेरी" : "Bare Acts Library",
                  isHindi ? "पीडीएफ टूल्स सूट" : "PDF Suite",
                  isHindi ? "केस डायरी व प्लानर" : "Case Diary",
                  isHindi ? "क्षेत्रफल कनवर्टर" : "Area Converter",
                  isHindi ? "डायरेक्ट व्हाट्सएप" : "Direct WhatsApp",
                  isHindi ? "ऑफलाइन लेस-शेयर" : "Offline LessShare"
                ].map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-blue-200/60 dark:border-white/10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection('flagship-section')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line"
              >
                <span>{isHindi ? "लाइव डेमो व विवरण देखें" : "Explore Flagship App"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('download')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isHindi ? "APK डाउनलोड करें" : "Download APK"}</span>
              </button>
            </div>
          </div>

          {/* Secondary Products / Innovation Pipeline (Occupies 5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            
            {/* Card 1: Less Docs & Notes */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Less Docs & Notes</h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 whitespace-nowrap">
                  {t.home.upcomingBadge || "In R&D"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isHindi 
                  ? "त्वरित नोट्स और सुरक्षित स्थानीय भंडारण के लिए ऑन-डिवाइस ड्राफ्टिंग एवं ओसीआर कैप्चर।" 
                  : "Lightweight on-device drafting, instant markdown, and OCR capture designed for rapid notes and secure local storage."}
              </p>
            </div>

            {/* Card 2: Less Finance & Tools */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Less Finance & Tools</h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 whitespace-nowrap">
                  {isHindi ? "भविष्य की अवधारणा" : "Future Concept"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isHindi 
                  ? "साधारण ब्याज, स्टाम्प शुल्क और ईएमआई कैलकुलेटर जो वित्तीय गणनाओं को सहज बनाते हैं।" 
                  : "Simple interest, stamp duty, EMI calculators, and statutory financial estimates made intuitive and instant."}
              </p>
            </div>

            {/* Card 3: Less AI Studio */}
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm space-y-2 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Less AI Studio</h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 whitespace-nowrap">
                  {isHindi ? "अन्वेषण में" : "In Exploration"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isHindi 
                  ? "दस्तावेज़ सारांशीकरण और कानूनी पाठ अनुक्रमण के लिए निजी ऑन-डिवाइस एआई सहायक।" 
                  : "Private on-device AI helpers for document summarization, legal text indexing, and rapid query parsing."}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. LESS LEGAL FLAGSHIP SHOWCASE & LIVE SIMULATOR */}
      <section id="flagship-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Smartphone className="w-4 h-4" />
            <span>{t.home.simBadge}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.simTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed max-w-2xl mx-auto">
            {t.home.simSub}
          </p>
        </ScrollReveal>

        {/* Simulator Tabs Header */}
        <div className="overflow-hidden w-full pb-2 mask-edges-x max-w-7xl mx-auto px-1">
          <div ref={simTabRef} className="flex items-center overflow-x-auto no-scrollbar w-full select-none cursor-grab">
            {[...Array(4)].map((_, arrayIdx) => (
              <div key={arrayIdx} className="flex items-center gap-2 pr-2 shrink-0">
                {[
                  { id: 'diary', icon: Calendar, label: t.home.simDiary, iconColor: 'text-blue-600 dark:text-blue-400' },
                  { id: 'converter', icon: Compass, label: t.home.simConverter, iconColor: 'text-blue-600 dark:text-blue-400' },
                  { id: 'pdf', icon: FileText, label: t.home.simPdf, iconColor: 'text-blue-600 dark:text-blue-400' },
                  { id: 'whatsapp', icon: MessageSquare, label: t.home.simWhatsapp, iconColor: 'text-[#25D366]' }
                ].map((tab) => (
                  <button
                    key={`${tab.id}-${arrayIdx}`}
                    onClick={() => setSimTab(tab.id as typeof simTab)}
                    className={`shrink-0 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap badge-one-line border active-click-scale ${
                      simTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-blue-500 shadow-[0_4px_15px_rgba(59,130,246,0.25)]'
                        : 'bg-white/75 dark:bg-slate-900/40 backdrop-blur-md text-slate-700 dark:text-[#B8B3AF] border-blue-200/40 dark:border-blue-800/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-500/5 shadow-xs'
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
        <div className="bg-white/80 dark:bg-[#0B132B]/80 backdrop-blur-2xl rounded-3xl p-4 sm:p-8 border border-blue-500/25 dark:border-blue-400/20 shadow-[0_20px_50px_rgba(59,130,246,0.15)] max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Mock Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3.5 mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2 whitespace-nowrap badge-one-line">
                  <span className="whitespace-nowrap badge-one-line">{t.home.simInterfaceLabel}</span>
                  <span className="text-[10px] bg-blue-500/10 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20 dark:border-blue-400/20 font-semibold whitespace-nowrap badge-one-line">
                    {t.home.simOnDeviceBadge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simSandboxSub}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-600 dark:text-[#B8B3AF] shrink-0">
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
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
                <div className="bg-gradient-to-br from-blue-50/60 via-white/80 to-sky-50/40 dark:from-[#111827]/90 dark:via-[#0F172A]/85 dark:to-[#1E293B]/90 backdrop-blur-xl p-4 rounded-2xl border border-blue-400/35 dark:border-blue-500/25 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#B8B3AF] gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap badge-one-line">{t.home.simScheduleTitle}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 whitespace-nowrap badge-one-line shrink-0">
                      {isHindi ? 'नमूना डेटा (Sample Data)' : 'Demo Preview • Sample Data'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 sm:p-3.5 bg-white/50 dark:bg-[#0F172A]/40 rounded-xl border border-blue-200/50 dark:border-blue-800/25 flex items-center justify-between gap-2 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] truncate">Sharma vs. State of UP <span className="text-[10px] font-normal text-slate-400">(Sample)</span></div>
                        <div className="text-[11px] text-slate-600 dark:text-[#B8B3AF] truncate">Court No. 4 • Criminal Appeal • Item #12</div>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/30 whitespace-nowrap badge-one-line shrink-0">
                        {t.home.simArgumentsStage}
                      </span>
                    </div>

                    <div className="p-3 sm:p-3.5 bg-white/50 dark:bg-[#0F172A]/40 rounded-xl border border-blue-200/50 dark:border-blue-800/25 flex items-center justify-between gap-2 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] truncate">Verma Infra vs. City Development <span className="text-[10px] font-normal text-slate-400">(Sample)</span></div>
                        <div className="text-[11px] text-slate-600 dark:text-[#B8B3AF] truncate">District Tribunal • Arbitration • Item #5</div>
                      </div>
                      <span className="text-[10px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-lg border border-sky-500/30 whitespace-nowrap badge-one-line shrink-0">
                        {t.home.simEvidenceStage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-gradient-to-br from-blue-50/50 to-white/80 dark:from-[#111827]/70 dark:to-[#0F172A]/80 rounded-xl border border-blue-200/50 dark:border-blue-800/25 shadow-xs text-center">
                    <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">24</div>
                    <div className="text-[10px] text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simPendingTasks}</div>
                  </div>
                  <div className="p-3.5 bg-gradient-to-br from-blue-50/50 to-white/80 dark:from-[#111827]/70 dark:to-[#0F172A]/80 rounded-xl border border-blue-200/50 dark:border-blue-800/25 shadow-xs text-center">
                    <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">100%</div>
                    <div className="text-[10px] text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simAutoSavedNotes}</div>
                  </div>
                  <div className="p-3.5 bg-gradient-to-br from-blue-50/50 to-white/80 dark:from-[#111827]/70 dark:to-[#0F172A]/80 rounded-xl border border-blue-200/50 dark:border-blue-800/25 shadow-xs text-center col-span-2 sm:col-span-1">
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
                <div className="bg-gradient-to-br from-blue-50/60 via-white/80 to-sky-50/40 dark:from-[#111827]/90 dark:via-[#0F172A]/85 dark:to-[#1E293B]/90 backdrop-blur-xl p-4 rounded-2xl border border-blue-400/35 dark:border-blue-500/25 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap badge-one-line block">{t.home.simTypeQuantity}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={landValue}
                          onChange={(e) => setLandValue(parseFloat(e.target.value) || 0)}
                          className="w-24 sm:w-28 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/15 rounded-xl text-slate-900 dark:text-[#F5F2EE] text-sm font-bold focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={landUnit}
                          onChange={(e) => setLandUnit(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                        >
                          {Object.entries(SQFT_RATES).map(([key, u]) => (
                            <option key={key} value={key} className="bg-white dark:bg-[#0A0A0C] text-slate-900 dark:text-[#F5F2EE]">{u.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap badge-one-line">{t.home.simBaseSqFt}</div>
                      <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap badge-one-line">{baseSqFt.toLocaleString()} Sq. Ft.</div>
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
                          className={`p-3 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 duration-300 ${
                            isSelected 
                              ? 'bg-blue-500/10 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100 shadow-xs' 
                              : 'bg-white/40 dark:bg-slate-900/30 border-blue-200/40 dark:border-blue-800/20 hover:border-blue-400/30 hover:bg-blue-500/5 text-slate-600 dark:text-[#B8B3AF]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-[#B8B3AF] mb-1">
                            <span className="whitespace-nowrap badge-one-line">{u.label}</span>
                            {copiedUnit === key ? <Check className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" /> : <Copy className="w-3 h-3 text-slate-400 dark:text-[#77736F] shrink-0" />}
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{convertedVal}</div>
                          <div className="text-[9px] text-blue-600 dark:text-blue-400 mt-0.5 whitespace-nowrap badge-one-line">{u.region}</div>
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
                <div className="bg-gradient-to-br from-blue-50/60 via-white/80 to-sky-50/40 dark:from-[#111827]/90 dark:via-[#0F172A]/85 dark:to-[#1E293B]/90 backdrop-blur-xl p-4 rounded-2xl border border-blue-400/35 dark:border-blue-500/25 shadow-sm space-y-3">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap badge-one-line">{t.home.simPdfProcessingTitle}</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-white/50 dark:bg-[#0F172A]/40 rounded-xl border border-blue-200/50 dark:border-blue-800/25 space-y-1 hover:-translate-y-0.5 transition-all duration-300">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{t.home.simPdfMergeTitle}</div>
                      <div className="text-[10px] text-slate-600 dark:text-[#B8B3AF]">{t.home.simPdfMergeDesc}</div>
                    </div>

                    <div className="p-3.5 bg-white/50 dark:bg-[#0F172A]/40 rounded-xl border border-blue-200/50 dark:border-blue-800/25 space-y-1 hover:-translate-y-0.5 transition-all duration-300">
                      <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                      <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] whitespace-nowrap badge-one-line">{t.home.simPdfEncryptTitle}</div>
                      <div className="text-[10px] text-slate-600 dark:text-[#B8B3AF]">{t.home.simPdfEncryptDesc}</div>
                    </div>

                    <div className="p-3.5 bg-white/50 dark:bg-[#0F172A]/40 rounded-xl border border-blue-200/50 dark:border-blue-800/25 space-y-1 hover:-translate-y-0.5 transition-all duration-300">
                      <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
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
                <div className="bg-gradient-to-br from-blue-50/60 via-white/80 to-sky-50/40 dark:from-[#111827]/90 dark:via-[#0F172A]/85 dark:to-[#1E293B]/90 backdrop-blur-xl p-4 rounded-2xl border border-blue-400/35 dark:border-blue-500/25 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap badge-one-line">
                    <span>{t.home.simWhatsappTitle}</span>
                    <span className="text-[10px] bg-green-100 dark:bg-[#25D366]/20 text-green-700 dark:text-[#25D366] px-2 py-0.5 rounded-md border border-green-200 dark:border-[#25D366]/40">{language === 'hi' ? 'वास्तविक टूल' : 'Real Working Tool'}</span>
                  </div>
                  
                  <div className="p-4 bg-white/55 dark:bg-[#0F172A]/45 rounded-xl border border-blue-200/50 dark:border-blue-800/25 space-y-3 max-w-lg">
                    <div className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                      {t.home.simWhatsappSub}
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-start gap-2.5 pt-1">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 w-36 sm:w-44 focus-within:border-blue-500 transition-colors">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">+91</span>
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

                      <button 
                        onClick={handleOpenWhatsApp}
                        className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 whitespace-nowrap badge-one-line shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
                        title={t.home.simWhatsappBtn}
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#25D366]" />
                        <span className="whitespace-nowrap badge-one-line">{t.home.simWhatsappBtn}</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-[#77736F] flex items-center gap-1 pt-0.5">
                      <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{language === 'hi' ? 'व्हाट्सएप ऐप या वेब को सीधे आपके डिवाइस पर खोलता है। शून्य डेटा सहेजा गया।' : 'Opens WhatsApp app or web directly on your device. Zero data saved.'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Lifetime Pass Banner Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-slate-50 to-[#F1F5F9] dark:from-[#090D1A] dark:via-[#02040A] dark:to-[#0B0F19] text-slate-900 dark:text-white border-2 border-slate-200/90 dark:border-[#E5BA55]/40 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(229,186,85,0.12)] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 select-none">
          <div className="space-y-3 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-[#E5BA55]/50 text-amber-700 dark:text-[#E5BA55] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-amber-500 dark:fill-[#E5BA55]" />
              <span>{language === 'hi' ? 'सीमित समय - लाइफटाइम पास' : 'LIMITED TIME - LIFETIME ACCESS'}</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {language === 'hi' 
                ? 'लेस लीगल स्थायी प्रीमियम मेंबरशिप' 
                : 'Less Legal Permanent Lifetime Access'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-medium leading-relaxed">
              {language === 'hi'
                ? 'सभी 30+ टूल्स, केस डायरी, बेयर एक्ट्स और भविष्य के अपडेट्स का स्थायी लाभ। कोई आवर्ती शुल्क नहीं।'
                : 'Unlock all 30+ smart tools, case diary, custom Bare Acts & free lifetime upgrades with a one-time pass.'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-[#E5BA55]/20 rounded-2xl p-4 sm:p-5 w-full lg:w-72 shrink-0 space-y-3 shadow-xs">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-slate-400 line-through font-bold">₹329</span>
                <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">70% OFF</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                ₹99 <span className="text-xs text-slate-500 font-bold">/ {language === 'hi' ? 'एक बार' : 'Lifetime'}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('premium')}
              className="gold-shimmer-button w-full py-2.5 rounded-xl uppercase tracking-wider text-xs font-black cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-950 shrink-0" />
              <span>{language === 'hi' ? 'प्रीमियम पास लें' : 'Get Lifetime Pass'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHY LESS CREATION: 5 FOUNDATIONAL PILLARS */}
      <section id="why-less-creation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-white/5 border border-blue-500/20 dark:border-blue-400/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{t.home.whyBadge || "ENGINEERING PHILOSOPHY"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.whyTitle || "Why Less Creation?"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#B8B3AF] leading-relaxed max-w-2xl mx-auto">
            {t.home.whySubtitle || "The five foundational principles that guide everything we build."}
          </p>
        </ScrollReveal>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.home.whyPillars.map((pillar, idx) => {
            const icons = [Compass, Target, Shield, Lock, Users];
            const PillarIcon = icons[idx % icons.length];
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm space-y-3 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <PillarIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  0{idx + 1} • {isHindi ? "आधारभूत सिद्धांत" : "Core Pillar"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MISSION SECTION */}
      <section id="mission-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-blue-900/90 via-slate-900 to-slate-950 text-white border border-blue-500/30 shadow-2xl relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>{t.home.missionBadge || "OUR MISSION"}</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {t.home.missionTitle || "Technology should not feel complicated."}
              </h2>
              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                {t.home.missionSubtitle || "At Less Creation, our focus is on making useful digital technology easier to understand, easier to use, and accessible to everyone."}
              </p>
            </div>

            {/* Quote Banner */}
            <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center italic text-sm sm:text-base text-blue-100 font-medium">
              {t.home.missionQuote || "“When technology removes friction and respects human time, it transforms daily work into effortless progress.”"}
            </div>

            {/* Architecture Pipeline Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 max-w-4xl mx-auto text-center">
              {[
                { step: "01", label: isHindi ? "विचार" : "Idea" },
                { step: "02", label: isHindi ? "समस्या" : "Problem" },
                { step: "03", label: isHindi ? "सरल तकनीक" : "Simple Tech" },
                { step: "04", label: isHindi ? "उपयोगी उत्पाद" : "Useful Product" },
                { step: "05", label: isHindi ? "वास्तविक प्रभाव" : "Real Impact" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] font-bold text-blue-300">{item.step}</div>
                  <div className="text-xs font-bold text-white whitespace-nowrap">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. TRUST & SECURITY SECTION */}
      <section id="trust-security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-900/30 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.home.trustBadge || "TRUST & TECHNICAL INTEGRITY"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.trustTitle || "Built on Real Security & Privacy"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#B8B3AF] leading-relaxed max-w-2xl mx-auto">
            {t.home.trustSub || "We only claim technical capabilities that are genuinely implemented in our software."}
          </p>
        </ScrollReveal>

        {/* 4 Trust Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {t.home.trustCards.map((card, idx) => {
            const icons = [Cpu, Lock, KeyRound, Server];
            const CardIcon = icons[idx % icons.length];
            return (
              <div 
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-sm space-y-3 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <CardIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? "सत्यापित सुरक्षा" : "Verified Standard"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOUNDER PREVIEW SECTION */}
      <section id="founder-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="p-5 sm:p-8 md:p-10 rounded-3xl bg-white/95 dark:bg-[#121622]/95 border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden relative backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              
              {/* Image Column: Compact on mobile, rich on desktop */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-stretch">
                <div className="relative rounded-2xl p-1.5 sm:p-2 bg-gradient-to-b from-slate-100 to-white dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/10 shadow-md w-full max-w-[210px] sm:max-w-[260px] lg:max-w-none">
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 isolate">
                    {!founderImgErr ? (
                      <img 
                        src="/images/anurag_tiwari.jpg" 
                        alt="Anurag Gurauli — Founder of Less Creation"
                        onError={() => setFounderImgErr(true)}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center rounded-xl">
                        <Scale className="w-10 h-10 text-amber-500 mb-2" />
                        <div className="text-sm font-bold text-white">Anurag Gurauli</div>
                        <div className="text-[10px] text-amber-400">Founder, Less Creation</div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 inset-x-2 p-1.5 sm:p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-center shadow-md">
                      <div className="inline-block px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[8.5px] uppercase tracking-wider">
                        FOUNDER & ADVOCATE
                      </div>
                      <h4 className="text-xs font-black text-white tracking-wide uppercase mt-0.5 leading-tight">Anurag Gurauli</h4>
                      <p className="text-[9.5px] text-amber-200/90 font-semibold leading-tight mt-0.5">
                        Founder, Less Creation • Advocate, High Court
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Column */}
              <div className="lg:col-span-8 flex flex-col justify-center space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0">
                    <User className="w-3.5 h-3.5" />
                    <span>{t.home.founderPreviewBadge || "MEET THE FOUNDER"}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {t.home.founderPreviewTitle || "Created by an Advocate for Real-World Utility"}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {t.home.founderPreviewText || "Anurag Gurauli, Advocate practicing before the Allahabad High Court, founded Less Creation to simplify legal access and everyday digital tasks."}
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic font-medium text-left">
                  {isHindi 
                    ? "“तकनीक तब सार्थक बनती है जब वह किसी उपयोगी कार्य को अधिक सरल और अधिक सुलभ बनाती है। लेस क्रिएशन इसी विचार के साथ बनाया जा रहा है।”"
                    : "“Technology is truly meaningful when it removes friction from essential tasks and makes knowledge accessible to everyone.”"}
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 not-italic mt-2">
                    — Anurag Gurauli • Founder, Less Creation
                  </div>
                </div>

                <div className="pt-1 flex justify-center lg:justify-start">
                  <button
                    onClick={() => onNavigate('founder')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-bold rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <User className="w-4 h-4" />
                    <span>{isHindi ? "संस्थापक के बारे में अधिक जानें" : "Read Founder's Story"}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal direction="up" className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t.home.faqBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
            {t.home.faqTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#B8B3AF]">
            {t.home.faqSub}
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div 
                key={idx}
                className="bg-white/80 dark:bg-[#0B132B]/80 backdrop-blur-2xl rounded-2xl overflow-hidden transition-all duration-300 border border-blue-200/40 dark:border-blue-500/20 shadow-xs hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-[#F5F2EE] focus:outline-none cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-[#77736F] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
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
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-700 dark:text-[#B8B3AF] leading-relaxed border-t border-blue-100 dark:border-blue-900/30 pt-3">
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

      {/* 9. FINAL CALL TO ACTION */}
      <section id="final-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal direction="up">
          <div className="p-8 sm:p-14 bg-gradient-to-br from-white/95 via-blue-50/50 to-indigo-50/30 dark:from-[#111827]/95 dark:via-[#0F172A]/90 dark:to-[#1E293B]/90 backdrop-blur-2xl rounded-3xl border-2 border-blue-400/35 dark:border-blue-500/25 shadow-[0_20px_50px_rgba(59,130,246,0.15)] max-w-4xl mx-auto space-y-6 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30 border border-white/20">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-[#F5F2EE] tracking-tight">
                {t.home.finalCtaTitle || "Explore what we're creating."}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF] max-w-xl mx-auto font-medium">
                {t.home.finalCtaSub || "Experience simple, secure software designed to solve real-world challenges."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection('product-ecosystem')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-sm shadow-[0_10px_25px_rgba(37,99,235,0.35)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line flex items-center justify-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{t.home.ctaExploreProducts || "Explore Products"}</span>
              </button>
              
              <button
                onClick={() => onNavigate('download')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/15 shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isHindi ? "लेस लीगल डाउनलोड करें" : "Get Less Legal"}</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-600 dark:text-[#77736F] font-bold">
              <span>Less Creation Studio</span>
              <span>•</span>
              <span>{isHindi ? "100% ऑन-डिवाइस सुरक्षा" : "100% On-Device Privacy"}</span>
              <span>•</span>
              <span>{isHindi ? "स्वतंत्र सॉफ्टवेयर ब्रांड" : "Independent Software Brand"}</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
