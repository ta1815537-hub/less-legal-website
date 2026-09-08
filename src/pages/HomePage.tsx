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
import { AppLogo } from '../components/AppLogo';
import { ThreeDDeviceShowcase } from '../components/ThreeDDeviceShowcase';
import { 
  ScrollReveal, StaggerContainer, 
  StaggerItem, GlowingButton, HeroAmbientGlow 
} from '../components/MotionWrappers';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { sanitizePhoneNumber, isRateLimited, isSafeUrl } from '../utils/security';
import { DynamicAppsShowcase } from '../components/DynamicAppsShowcase';
import { DynamicNoticeBoard } from '../components/DynamicNoticeBoard';
import { DynamicPromoBanner } from '../components/DynamicPromoBanner';
import { TaskDiscoveryWidget } from '../components/tools/TaskDiscoveryWidget';
import { TOTAL_TOOLS_COUNT } from '../tools/toolRegistry';

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
    <div className="flex flex-col gap-6 sm:gap-8 py-2 overflow-hidden transition-colors duration-300 pb-2">
      
      {/* 1. HERO SECTION: LESS CREATION PARENT BRAND */}
      <section className="relative text-slate-900 dark:text-white pt-2 sm:pt-4 pb-4 sm:pb-6 overflow-hidden flex items-center">
        <HeroAmbientGlow />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-5 sm:space-y-7 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Column: Brand Statement & Action CTAs */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-4 sm:space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start"
            >
              <div className="flex flex-col gap-2.5 sm:gap-3 items-center sm:items-start w-full">
                
                {/* Brand Studio Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  <span>{t.home.heroBadge || "LESS CREATION • TECHNOLOGY & PRODUCT STUDIO"}</span>
                </div>

                {/* Primary Company Headline */}
                <div className="w-full flex flex-col gap-1 mt-0.5">
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.2rem] font-black tracking-tight leading-[1.1] text-center sm:text-left">
                    <span className="block hero-gradient-title-1 animate-text-gradient-flow">
                      {isHindi ? t.home.heroTitlePart1 : "Simpler Tool"}
                    </span>
                    <span className="block mt-1 hero-gradient-title-2 animate-text-gradient-flow">
                      {isHindi ? t.home.heroTitlePart2 : "Greater Impact."}
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

        {/* Seamless Soft Bottom Shadow & Blend - Eliminates any visible hard cut */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-[#F4F8FD] via-[#F4F8FD]/50 to-transparent dark:from-[#0B0F1D] dark:via-[#0B0F1D]/50 dark:to-transparent pointer-events-none z-[5]" 
          aria-hidden="true"
        />
      </section>

      {/* Dynamic Promo Banner & Flash Notice Board (rendered directly without phantom spacing) */}
      <DynamicPromoBanner onNavigate={onNavigate} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      <DynamicNoticeBoard onNavigate={onNavigate} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Task-First Discovery & Search Hub */}
      <section id="task-discovery-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 scroll-mt-28">
        <div className="bg-gradient-to-br from-blue-50/40 via-sky-50/10 to-transparent dark:from-blue-950/10 dark:via-transparent dark:to-transparent border border-blue-100/50 dark:border-white/5 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-500/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />
          
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 dark:border-blue-700/40 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isHindi ? 'त्वरित ऑन-डिवाइस टूल्स' : 'SMART ON-DEVICE UTILITIES'}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isHindi ? 'क्या काम करना है? बस खोजें और शुरू करें' : 'Describe your task to find the right tool instantly'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {isHindi 
                ? `${TOTAL_TOOLS_COUNT} मुफ्त व 100% सुरक्षित टूल्स। आपकी फाइलें और डेटा पूरी तरह आपके डिवाइस पर सुरक्षित रहते हैं, कभी किसी सर्वर पर अपलोड नहीं होते।`
                : `${TOTAL_TOOLS_COUNT} browser-based utilities that process files 100% privately on your device. Zero mandatory sign-ups, zero server uploads, absolute security.`}
            </p>
          </ScrollReveal>

          <TaskDiscoveryWidget />
        </div>
      </section>

      {/* 2. PRODUCT ECOSYSTEM SECTION */}
      <section id="product-ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-28">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 dark:border-blue-700/40 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.home.ecosystemBadge || "PRODUCT ECOSYSTEM"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.home.ecosystemTitle || "Products Built for Real-World Use"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t.home.ecosystemSub || "Purposeful digital applications crafted for clarity, utility, and everyday efficiency."}
          </p>
        </ScrollReveal>

        {/* Dynamic Apps & Tools Showcase (Cards Managed via Admin Control Center) */}
        <DynamicAppsShowcase onNavigate={onNavigate} showAllLink={true} />

        {/* Ecosystem Grid: Flagship Hero Product */}
        <div className="max-w-4xl mx-auto w-full">
          
          {/* Flagship Product Card: Less Legal */}
          <div className="animated-card rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white dark:from-[#111827] dark:via-[#0F172A] dark:to-[#1E293B] border-2 border-blue-500/40 dark:border-blue-400/30 shadow-[0_20px_50px_rgba(59,130,246,0.18)] flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                <span>{t.home.flagshipBadge || "FLAGSHIP PRODUCT"}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                {isHindi ? "सक्रिय उत्पाद • एंड्रॉइड ऐप" : "Active Product • Android App"}
              </span>
            </div>

            {/* Product Body */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <AppLogo className="w-14 h-14 shadow-md shrink-0" showShadow={false} />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {t.home.flagshipTitle || "Less Legal"}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {isHindi ? "ऑल-इन-वन स्मार्ट कानूनी वर्कस्पेस" : "All-in-One Smart Legal Workspace"}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
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
                  isHindi ? "ऑफ़लाइन लेस-शेयर" : "Offline LessShare"
                ].map((tag, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-5 border-t border-blue-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollToSection('flagship-section')}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line"
                >
                  <span>{isHindi ? "लाइव डेमो व विवरण देखें" : "Explore Flagship App"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('download')}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#131C31] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{isHindi ? "APK डाउनलोड करें" : "Download APK"}</span>
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isHindi ? "निःशुल्क संस्करण + लाइफटाइम पास" : "Free Edition + Lifetime Pass"}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. LESS LEGAL FLAGSHIP SHOWCASE & LIVE SIMULATOR */}
      <section id="flagship-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 scroll-mt-28 overflow-hidden">
        {/* Simulator Tabs Header - Compact & non-repeating to guarantee 100% centering of the simulator */}
        <div className="w-full max-w-3xl mx-auto pb-1 px-1">
          <div 
            ref={simTabRef} 
            className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar w-full gap-2 py-2 select-none cursor-grab scroll-smooth"
          >
            {[
              { id: 'diary', icon: Calendar, label: t.home.simDiary, iconColor: 'text-blue-600 dark:text-blue-400' },
              { id: 'converter', icon: Compass, label: t.home.simConverter, iconColor: 'text-blue-600 dark:text-blue-400' },
              { id: 'pdf', icon: FileText, label: t.home.simPdf, iconColor: 'text-blue-600 dark:text-blue-400' },
              { id: 'whatsapp', icon: MessageSquare, label: t.home.simWhatsapp, iconColor: 'text-[#25D366]' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSimTab(tab.id as typeof simTab)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap border active-click-scale ${
                  simTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.2)]'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-blue-200/40 dark:border-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-500/10 shadow-xs'
                }`}
              >
                <tab.icon className={`w-4 h-4 shrink-0 ${tab.iconColor}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Frame Container */}
        <div className="animated-card bg-white/95 dark:bg-[#111827]/95 backdrop-blur-2xl rounded-3xl p-4 sm:p-8 border border-blue-500/25 dark:border-blue-500/30 shadow-[0_20px_50px_rgba(59,130,246,0.15)] max-w-4xl mx-auto relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Mock Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap badge-one-line">
                  <span className="whitespace-nowrap badge-one-line">{t.home.simInterfaceLabel}</span>
                  <span className="text-[10px] bg-blue-500/10 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20 dark:border-blue-400/20 font-semibold whitespace-nowrap badge-one-line">
                    {t.home.simOnDeviceBadge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap badge-one-line">{t.home.simSandboxSub}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-600 dark:text-slate-400 shrink-0">
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
        <div className="animated-card relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-slate-50 to-[#F1F5F9] dark:from-[#090D1A] dark:via-[#02040A] dark:to-[#0B0F19] text-slate-900 dark:text-white border-2 border-slate-200/90 dark:border-[#E5BA55]/40 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(229,186,85,0.12)] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 select-none">
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
                ? 'सभी आवश्यक टूल्स, केस डायरी, बेयर एक्ट्स और भविष्य के अपडेट्स का स्थायी लाभ। कोई आवर्ती शुल्क नहीं।'
                : 'Unlock all smart tools, case diary, custom Bare Acts & free lifetime upgrades with a one-time pass.'}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-red-50/20 dark:bg-red-950/10 border-2 border-red-500/30 dark:border-red-500/20 rounded-2xl p-4 sm:p-5 w-full lg:w-72 shrink-0 space-y-3 shadow-[0_10px_30px_rgba(239,68,68,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
              {language === 'hi' ? 'बचत ₹800' : 'SAVE ₹800'}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-xs text-red-500 dark:text-red-400 line-through decoration-red-500 decoration-2 font-bold">₹899</span>
                <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs animate-pulse">89.9% OFF</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                ₹99 <span className="text-xs text-slate-500 font-bold">/ {language === 'hi' ? 'एक बार' : 'Lifetime'}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('premium')}
              className="red-shimmer-button w-full py-2.5 px-2 rounded-xl uppercase tracking-wider text-[10px] sm:text-xs font-black cursor-pointer shadow-md flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap overflow-hidden"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white shrink-0" />
              <span className="whitespace-nowrap">{language === 'hi' ? 'प्रीमियम पास लें' : 'Get Lifetime Pass'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. WHY LESS CREATION: 5 FOUNDATIONAL PILLARS */}
      <section id="why-less-creation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-28">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 dark:border-blue-700/40 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{t.home.whyBadge || "ENGINEERING PHILOSOPHY"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.home.whyTitle || "Why Less Creation?"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t.home.whySubtitle || "The five foundational principles that guide everything we build."}
          </p>
        </ScrollReveal>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {t.home.whyPillars.map((pillar, idx) => {
            const icons = [Compass, Target, Shield, Lock, Users];
            const PillarIcon = icons[idx % icons.length];
            return (
              <div 
                key={idx}
                className="animated-card p-6 rounded-3xl bg-white/90 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-black/40 space-y-3 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
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
                <div className="pt-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  0{idx + 1} • {isHindi ? "आधारभूत सिद्धांत" : "Core Pillar"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MISSION & MANIFESTO SECTION */}
      <section id="mission-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 scroll-mt-28">
        
        {/* Section Header directly on natural background */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/25 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.home.missionBadge || "OUR MANIFESTO & MISSION"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.home.missionTitle || "Technology should not feel complicated."}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t.home.missionSubtitle || "At Less Creation, our focus is on making useful digital technology easier to understand, straightforward to navigate, and accessible to everyone."}
          </p>
        </ScrollReveal>

        {/* Real Mission Message Card (Obsidian Gold & Warm Amber Luxury Aesthetic) */}
        <ScrollReveal direction="up" className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 bg-gradient-to-br from-slate-900 via-[#12131A] to-[#1A1516] text-white border-2 border-amber-500/40 dark:border-amber-400/35 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.2)] overflow-hidden">
            
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Top Seal / Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-5 mb-6 sm:mb-8 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider uppercase text-amber-400">
                    LESS CREATION MANIFESTO
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium font-serif italic">
                    अप्राप्यं नाम नेहास्ति धीरस्य व्यवसायिन:
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? "मार्गदर्शक सिद्धांत" : "Guiding Philosophy"}</span>
              </div>
            </div>

            {/* Core Inspiring Quote Body */}
            <div className="relative z-10 space-y-4 my-2 text-center sm:text-left">
              <span className="text-4xl sm:text-6xl text-amber-400/40 font-serif leading-none select-none block -mb-4 sm:-mb-6">“</span>
              <blockquote className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-100 leading-snug tracking-tight font-serif italic px-2 sm:px-4">
                {t.home.missionQuote || "When technology removes unnecessary hurdles and respects human time, it transforms everyday work into effortless progress."}
              </blockquote>
              <span className="text-4xl sm:text-6xl text-amber-400/40 font-serif leading-none select-none block text-right -mt-2">”</span>
            </div>

            {/* Footer Attribution */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-semibold text-slate-300">{isHindi ? "मानव-केंद्रित सॉफ़्टवेयर निर्माण" : "Human-Centered Engineering Principle"}</span>
              </div>
              <div className="font-mono text-[11px] text-amber-400/80">
                #BuildWithIntegrity
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* Connected Innovation Pipeline (Directly on canvas, responsive across all screens) */}
        <ScrollReveal direction="up" className="max-w-5xl mx-auto space-y-4 pt-2">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isHindi ? "हमारा विकास चक्र" : "Our Product Development Journey"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {[
              { step: "01", label: isHindi ? "विचार" : "Idea", sub: isHindi ? "समस्या की खोज" : "Discovery", color: "from-blue-500 to-sky-500" },
              { step: "02", label: isHindi ? "समस्या" : "Problem", sub: isHindi ? "जटिलता का विश्लेषण" : "Root Analysis", color: "from-sky-500 to-cyan-500" },
              { step: "03", label: isHindi ? "सरल तकनीक" : "Simple Tech", sub: isHindi ? "कम जटिल समाधान" : "Clean Code", color: "from-cyan-500 to-emerald-500" },
              { step: "04", label: isHindi ? "उपयोगी उत्पाद" : "Useful Product", sub: isHindi ? "वास्तविक उपयोगिता" : "Utility App", color: "from-emerald-500 to-amber-500" },
              { step: "05", label: isHindi ? "वास्तविक प्रभाव" : "Real Impact", sub: isHindi ? "समय की बचत" : "Human Progress", color: "from-amber-500 to-orange-500" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="relative rounded-2xl p-4 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 text-center space-y-2 hover:-translate-y-1 transition-all duration-300 shadow-xs group"
              >
                <div className={`w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr ${item.color} text-white font-black text-xs flex items-center justify-center shadow-sm`}>
                  {item.step}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

      </section>

      {/* 6. TRUST & SECURITY SECTION */}
      <section id="trust-security" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-28">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-900/30 border border-emerald-500/20 dark:border-emerald-700/40 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.home.trustBadge || "TRUST & TECHNICAL INTEGRITY"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.home.trustTitle || "Built on Real Security & Privacy"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
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
                className="animated-card p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-black/40 space-y-3 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
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
      <section id="founder-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <ScrollReveal direction="up">
          <div className="animated-card relative p-6 sm:p-10 md:p-12 rounded-[32px] bg-gradient-to-br from-white via-white/95 to-slate-50/90 dark:from-[#0E1526] dark:via-[#0D1424] dark:to-[#080D1A] border border-slate-200/90 dark:border-white/12 shadow-[0_25px_60px_rgba(37,99,235,0.12)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-2xl">
            
            {/* Ambient Lighting Gradients */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-amber-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Image Column: Luxury Framing with Glowing Accents */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative group w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
                  {/* Outer Floating Glow on hover */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/25 via-blue-600/30 to-cyan-400/25 rounded-[2rem] blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  
                  <div className="relative rounded-[1.75rem] overflow-hidden bg-slate-900 border-2 border-slate-200/80 dark:border-white/15 shadow-2xl isolate">
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                      {!founderImgErr ? (
                        <img 
                          src="/images/anurag_tiwari.jpg" 
                          alt="Anurag Gurauli — Founder of Less Creation & Advocate"
                          onError={() => setFounderImgErr(true)}
                          className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-b from-slate-900 via-[#0F172A] to-[#070B14] flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
                            <Scale className="w-8 h-8" />
                          </div>
                          <div className="text-base font-black text-white">Anurag Gurauli</div>
                          <div className="text-xs text-amber-400 font-bold mt-0.5">Founder, Less Creation</div>
                        </div>
                      )}
                      
                      {/* Interactive Bottom Identity Banner */}
                      <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-amber-500/40 text-center shadow-2xl">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                          <Scale className="w-3 h-3 fill-slate-950 shrink-0" />
                          <span>FOUNDER & ADVOCATE</span>
                        </div>
                        <h4 className="text-sm font-black text-white tracking-wide uppercase mt-1 leading-tight">
                          Anurag Gurauli
                        </h4>
                        <p className="text-[10px] text-amber-200/90 font-bold leading-tight mt-0.5">
                          Founder, Less Creation • Advocate, High Court
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Column */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-center lg:text-left">
                
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mx-auto lg:mx-0 border border-blue-500/20 dark:border-blue-500/30 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>{t.home.founderPreviewBadge || "MEET THE FOUNDER"}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    {t.home.founderPreviewTitle || "Created by an Advocate for Real-World Utility"}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                    {t.home.founderPreviewText || "Anurag Gurauli, Advocate practicing before the Allahabad High Court, founded Less Creation to eliminate friction from legal research, document management, and everyday digital productivity."}
                  </p>
                </div>

                {/* Key Pillars Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{isHindi ? "इलाहाबाद उच्च न्यायालय अधिवक्ता" : "Allahabad High Court Advocate"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{isHindi ? "100% ऑन-डिवाइस डेटा सुरक्षा" : "On-Device Privacy First"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{isHindi ? "स्वतंत्र सॉफ्टवेयर आर्किटेक्ट" : "Independent Software Studio"}</span>
                  </span>
                </div>

                {/* High Quality Quote Callout */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-transparent dark:from-[#131C31] dark:via-[#11192C] dark:to-transparent border border-blue-200/60 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic font-medium text-left relative shadow-2xs">
                  <div className="text-2xl font-serif text-blue-500/40 leading-none mb-1">“</div>
                  <p className="leading-relaxed">
                    {isHindi 
                      ? "तकनीक तब सार्थक बनती है जब वह किसी उपयोगी कार्य को अधिक सरल, सुरक्षित और हर नागरिक के लिए सुलभ बनाती है। लेस क्रिएशन इसी विचार के साथ बनाया जा रहा है।"
                      : "Technology is truly meaningful when it removes friction from essential legal workflows and makes authentic knowledge accessible to every Indian."}
                  </p>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 not-italic mt-2.5 flex items-center gap-1.5">
                    <span className="w-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    <span>Anurag Gurauli • Founder & Creator</span>
                  </div>
                </div>

                {/* Interactive Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => onNavigate('founder')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-black rounded-xl shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>{isHindi ? "संस्थापक प्रोफाइल व विज़न पढ़ें" : "Read Founder's Story"}</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('about')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/90 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-extrabold rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isHindi ? "लेस क्रिएशन के बारे में" : "About Less Creation"}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-28">
        <ScrollReveal direction="up" className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t.home.faqBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.home.faqTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t.home.faqSub}
          </p>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div 
                key={idx}
                className="animated-card bg-white/90 dark:bg-[#111827]/90 backdrop-blur-2xl rounded-2xl overflow-hidden transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
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
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
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
      <section id="final-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-mt-28">
        <ScrollReveal direction="up">
          <div className="animated-card p-8 sm:p-12 bg-gradient-to-br from-white/95 via-blue-50/50 to-indigo-50/30 dark:from-[#111827] dark:via-[#0F172A] dark:to-[#1E293B] backdrop-blur-2xl rounded-3xl border-2 border-blue-400/35 dark:border-blue-500/30 shadow-[0_20px_50px_rgba(59,130,246,0.15)] max-w-4xl mx-auto space-y-5 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30 border border-white/20">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t.home.finalCtaTitle || "Explore what we're creating."}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
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
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-[#131C31] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isHindi ? "लेस लीगल डाउनलोड करें" : "Get Less Legal"}</span>
              </button>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-600 dark:text-slate-400 font-bold">
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
