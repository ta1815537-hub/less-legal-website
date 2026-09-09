import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, Bot, 
  FileText, Calendar, Compass, Scale, Lock, CheckCircle2, 
  Smartphone, Check, Layers, LayoutGrid, Music, Edit3,
  Search, Zap, Share2, MessageSquare, ChevronRight,
  Copy, Play, ChevronDown, UserCheck, Gavel, BookOpen, Scan, Calculator, Grid,
  Rocket, Star, Users, Clock, User, Quote, Lightbulb, Target, Landmark,
  Shield, Server, Award, Cpu, RefreshCw, KeyRound, ExternalLink, HelpCircle,
  X, PenTool, AlertCircle
} from 'lucide-react';
import { LTLogo } from '../components/LTLogo';
import { AppLogo } from '../components/AppLogo';
import { ThreeDDeviceShowcase } from '../components/ThreeDDeviceShowcase';
import { 
  ScrollReveal, StaggerContainer, 
  StaggerItem, GlowingButton, HeroAmbientGlow 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { DynamicAppsShowcase } from '../components/DynamicAppsShowcase';
import { DynamicNoticeBoard } from '../components/DynamicNoticeBoard';
import { DynamicPromoBanner } from '../components/DynamicPromoBanner';
import { articleService } from '../services/articleService';
import { getDirectCloudImageUrl } from '../utils/adminStorage';

interface HomePageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [founderImgErr, setFounderImgErr] = useState(false);
  const [liftedProducts, setLiftedProducts] = useState<Record<string, boolean>>({});
  const [liftedFeatures, setLiftedFeatures] = useState<Record<string, boolean>>({});

  // Sync countdown timer with the Navbar top banner
  const [timeLeft, setTimeLeft] = useState({ hours: 38, minutes: 47, seconds: 12 });

  useEffect(() => {
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

  // Real-Time Articles Feed State
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [articlesLoading, setArticlesLoading] = useState<boolean>(true);
  const [articleCategory, setArticleCategory] = useState<string>('ALL');
  const [articleSearch, setArticleSearch] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      try {
        const list = await articleService.getPublicArticleSummaries();
        if (isMounted) {
          setArticles(list);
          setArticlesLoading(false);
        }
      } catch {
        if (isMounted) setArticlesLoading(false);
      }
    };

    fetchArticles();

    const unsubscribe = articleService.subscribeToPublicSummaries((updated) => {
      if (isMounted) {
        setArticles(updated);
        setArticlesLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Filtered Articles for Homepage
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchCat = articleCategory === 'ALL' || 
        (a.category && a.category.toLowerCase() === articleCategory.toLowerCase());
      const query = articleSearch.trim().toLowerCase();
      const matchQuery = !query || 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(query)));
      return matchCat && matchQuery;
    });
  }, [articles, articleCategory, articleSearch]);

  const featuredArticle = useMemo(() => {
    return filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  }, [filteredArticles]);

  const recentArticles = useMemo(() => {
    if (featuredArticle && articleCategory === 'ALL' && !articleSearch.trim()) {
      return filteredArticles.filter(a => a.id !== featuredArticle.id).slice(0, 6);
    }
    return filteredArticles.slice(0, 6);
  }, [filteredArticles, featuredArticle, articleCategory, articleSearch]);

  // Format Date Helper
  const formatArticleDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = t.home.faqs;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-2 overflow-hidden transition-colors duration-300 pb-16 sm:pb-24">
      
      {/* 1. HERO SECTION: ADVOCATE ANURAG GURAULI VISION */}
      <section className="relative text-slate-900 dark:text-white pt-6 sm:pt-10 pb-8 sm:pb-12 overflow-hidden flex items-center rounded-3xl min-h-[400px] border border-slate-200/20 dark:border-white/5">
        {/* Clean Ambient Gradient Backdrop */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden rounded-3xl bg-slate-50/50 dark:bg-slate-950/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-cyan-500/[0.04] dark:from-blue-600/[0.08] dark:to-cyan-600/[0.08]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent" />
        </div>

        <HeroAmbientGlow />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 space-y-4 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Column: Brand Statement & Action CTAs */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left flex flex-col items-start min-w-0 w-full"
            >
              <div className="flex flex-col gap-4 items-start w-full min-w-0">
                
                {/* 1. Tagline Badge (Guaranteed 1-Line on All Mobile Screens) */}
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/25 dark:border-blue-700/40 text-blue-600 dark:text-blue-400 text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-wider whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {isHindi ? "प्रौद्योगिकी • डिजिटल सुरक्षा • जागरूकता" : "TECHNOLOGY • DIGITAL SAFETY • AWARENESS"}
                  </span>
                </div>

                {/* 2. Main Headline */}
                <div className="w-full flex flex-col gap-1.5">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.12] text-slate-950 dark:text-white">
                    {isHindi ? "सुरक्षित डिजिटल जीवन के लिए " : "Smart Technology & "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-300 dark:to-cyan-400">
                      {isHindi ? "तकनीक और जागरूकता" : "Cyber Awareness"}
                    </span>
                    {isHindi ? "" : " for a Safer Tomorrow."}
                  </h1>
                </div>

                {/* 3. Short Supporting Text */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-medium">
                  {isHindi 
                    ? "लेस क्रिएशन आपको डिजिटल दुनिया में सुरक्षित रहने, साइबर खतरों को पहचानने और तकनीक को विश्वास के साथ समझने के लिए व्यावहारिक उपकरण और स्पष्ट ज्ञान प्रदान करता है।" 
                    : "Less Creation builds intelligent tools and shares clear, practical knowledge to help you confidently navigate technology, recognize cyber threats, and stay safe in the digital world."}
                </p>
              </div>

              {/* 4. Only Two Clear CTAs side-by-side */}
              <div className="flex flex-wrap items-center gap-3.5 w-full">
                <button
                  onClick={() => {
                    const el = document.getElementById('product-ecosystem');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-sm shadow-[0_10px_25px_rgba(37,99,235,0.25)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? "लेस लीगल जानें" : "Explore Less Legal"}</span>
                </button>
                
                <button
                  onClick={() => {
                    const el = document.getElementById('homepage-articles');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/10 shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 shrink-0 text-blue-500 dark:text-blue-400" />
                  <span>{isHindi ? "लेख पढ़ें" : "Read Articles"}</span>
                </button>
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

      {/* 4-COLUMN PREMIUM FEATURE HIGHLIGHTS */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-5 border border-slate-200/50 dark:border-white/5 shadow-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                {isHindi ? "डिजिटल सुरक्षा" : "Digital Safety"}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {isHindi ? "सजग रहें" : "Be Aware"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                {isHindi ? "विधिक ज्ञान" : "Legal Knowledge"}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {isHindi ? "अधिकार जानें" : "Know Your Rights"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                {isHindi ? "व्यावहारिक साधन" : "Practical Tools"}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {isHindi ? "सरल समाधान" : "Simpler Solutions"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                {isHindi ? "सभी के लिए" : "For Everyone"}
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {isHindi ? "सुरक्षित कल" : "A Safer Tomorrow"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Promo Banner & Flash Notice Board (rendered directly without phantom spacing) */}
      <DynamicPromoBanner onNavigate={onNavigate} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      <DynamicNoticeBoard onNavigate={onNavigate} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* 2. DIGITAL SAFETY & LEGAL ARTICLES SECTION (FRONT & CENTERED) */}
      <section id="homepage-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-28 w-full overflow-hidden">
        <ScrollReveal direction="up" className="w-full text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 dark:border-blue-700/40 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isHindi ? 'साइबर सुरक्षा व कानूनी विश्लेषण' : 'DIGITAL SAFETY & LEGAL INSIGHTS'}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isHindi ? 'ज्ञान जो आपको सुरक्षित रखे' : 'Knowledge That Keeps You Safe'}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            {isHindi 
              ? 'तेजी से बढ़ते एआई खतरों, ऑनलाइन फ्रॉड, डिजिटल अरेस्ट और नागरिक कानूनी अधिकारों पर सरल व व्यावहारिक संपादकीय लेख।' 
              : 'Practical, verified editorial guides on cyber frauds, online security, digital arrest scams, and citizen legal protections.'}
          </p>
        </ScrollReveal>

        {/* Category Filter Pills & Search Bar (Single Row, No Awkward Wrap) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 w-full min-w-0">
          {/* Scrollable category pills wrapper with explicit min-width safety */}
          <div className="w-full sm:w-auto max-w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 min-w-0">
              {[
                { key: 'ALL', label: isHindi ? 'सभी लेख' : 'All Articles' },
                { key: 'Digital Safety', label: isHindi ? 'डिजिटल सुरक्षा' : 'Digital Safety' },
                { key: 'Fraud Awareness', label: isHindi ? 'धोखाधड़ी जागरूकता' : 'Fraud Awareness' },
                { key: 'Legal Awareness', label: isHindi ? 'कानूनी अधिकार' : 'Legal Awareness' },
                { key: 'Privacy & Security', label: isHindi ? 'गोपनीयता' : 'Privacy & Security' },
                { key: 'Technology', label: isHindi ? 'प्रौद्योगिकी' : 'Technology' },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setArticleCategory(cat.key)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer badge-one-line ${
                    articleCategory === cat.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0 min-w-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={articleSearch}
              onChange={(e) => setArticleSearch(e.target.value)}
              placeholder={isHindi ? 'लेख खोजें...' : 'Search articles...'}
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            {articleSearch && (
              <button
                onClick={() => setArticleSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ARTICLES DISPLAY */}
        {articles.length > 0 ? (
          <div className="space-y-6">
            {/* Featured Article Spotlight Card */}
            {featuredArticle && articleCategory === 'ALL' && !articleSearch.trim() && (
              <article 
                onClick={() => onNavigate('article-detail', { slug: featuredArticle.slug })}
                className="group border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0E131F] p-4 sm:p-6 hover:border-blue-500/50 transition-all cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-5 items-center shadow-xs"
              >
                <div className="md:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                      {featuredArticle.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10.5px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isHindi ? "मुख्य लेख" : "Featured"}</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {formatArticleDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-500/10 border border-blue-500/25 flex items-center justify-center shrink-0">
                        <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1">
                        By Less Team
                        <PenTool className="w-2.5 h-2.5 text-blue-500/70" />
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {featuredArticle.readingTime}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        <span>{isHindi ? 'पढ़ें' : 'Read'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 aspect-video rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 overflow-hidden flex items-center justify-center">
                  {featuredArticle.featuredImage ? (
                    <img 
                      src={getDirectCloudImageUrl(featuredArticle.featuredImage)} 
                      alt={featuredArticle.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain bg-slate-50 dark:bg-slate-900 group-hover:scale-102 transition-transform duration-300" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-1.5">
                      <ShieldCheck className="w-8 h-8 text-blue-500/60 mx-auto" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Less Creation Insights</span>
                    </div>
                  )}
                </div>
              </article>
            )}

            {/* Recent Articles Grid */}
            {recentArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recentArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => onNavigate('article-detail', { slug: article.slug })}
                    className="group border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0E131F] overflow-hidden hover:border-blue-500/50 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-slate-100 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 overflow-hidden flex items-center justify-center relative">
                      {article.featuredImage ? (
                        <img
                          src={getDirectCloudImageUrl(article.featuredImage)}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center p-4 space-y-1">
                          <BookOpen className="w-7 h-7 text-blue-500/50 mx-auto" />
                          <span className="text-[9px] font-mono uppercase text-slate-400">Editorial Guide</span>
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-xs">
                        {article.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          <span>{formatArticleDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-blue-500" />
                          {article.readingTime}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          <span>{isHindi ? 'पढ़ें' : 'Read'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-slate-200/60 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-white/[0.02]">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isHindi ? 'इस श्रेणी में कोई लेख नहीं मिला।' : 'No articles match your selected filter.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Curated Foundational Guides (Displays When Firestore Articles are Loading or Empty) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                id: 'guide-digital-arrest',
                title: isHindi 
                  ? 'डिजिटल अरेस्ट फ्रॉड: फर्जी पुलिस और सीबीआई वीडियो कॉल का सच' 
                  : 'Digital Arrest Frauds: How Fake Police & CBI Calls Trap Citizens',
                category: isHindi ? 'डिजिटल सुरक्षा' : 'Digital Safety',
                excerpt: isHindi 
                  ? 'स्काइप और व्हाट्सएप पर फर्जी पुलिस वर्दी व कोर्ट सेटअप बनाकर नागरिकों से लाखों की उगाही करने के तरीकों व बचाव के नियम।' 
                  : 'How cyber syndicates impersonate law enforcement and Supreme Court judges on video calls, and key steps to protect yourself.',
                readingTime: '5 min read',
                date: 'Mar 2026'
              },
              {
                id: 'guide-customer-care-scam',
                title: isHindi 
                  ? 'फर्जी कस्टमर केयर नंबर व सर्च इंजन फ्रॉड की पहचान कैसे करें' 
                  : 'How to Identify Fake Customer Care Numbers & Search Engine Traps',
                category: isHindi ? 'धोखाधड़ी बचाव' : 'Fraud Awareness',
                excerpt: isHindi 
                  ? 'गूगल सर्च पर बैंक और डिलीवरी कंपनियों के फर्जी नंबर डालकर होने वाले ऑनलाइन बैंक फ्रॉड और यूपीआई घोटालों से सावधान रहने की गाइड।' 
                  : 'Scammers place fraudulent helpline numbers across search engines to drain bank accounts. Here is how to verify authentic contacts.',
                readingTime: '4 min read',
                date: 'Feb 2026'
              },
              {
                id: 'guide-cyber-law-rights',
                title: isHindi 
                  ? 'साइबर धोखाधड़ी होने पर हेल्पलाइन 1930 व नागरिक कानूनी अधिकार' 
                  : 'Citizen Legal Protections Under Cyber Law & Using Helpline 1930',
                category: isHindi ? 'कानूनी अधिकार' : 'Legal Awareness',
                excerpt: isHindi 
                  ? 'ऑनलाइन वित्तीय फ्रॉड के पहले गोल्डन आवर्स में 1930 डायल करने, cybercrime.gov.in पर रिपोर्ट दर्ज कराने और बैंक रिफंड प्राप्त करने की कानूनी प्रक्रिया।' 
                  : 'Actionable steps during the golden hour of financial fraud, filing complaints on the national cyber portal, and statutory bank refund rights.',
                readingTime: '6 min read',
                date: 'Feb 2026'
              }
            ].map((guide, idx) => (
              <article
                key={idx}
                onClick={() => onNavigate('articles')}
                className="group border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0E131F] p-5 hover:border-blue-500/50 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between shadow-xs space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                      {guide.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{guide.date}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-blue-500" />
                    {guide.readingTime}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>{isHindi ? 'विस्तार से पढ़ें' : 'Read Guide'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Articles Action */}
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('articles')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line"
          >
            <BookOpen className="w-4 h-4 text-blue-400 dark:text-blue-600" />
            <span>{isHindi ? 'सभी लेख व साइबर सुरक्षा गाइड पढ़ें' : 'Explore All Editorial Articles & Publications'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. PRODUCT ECOSYSTEM SECTION */}
      <section id="product-ecosystem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-28">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 dark:border-blue-700/40 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.home.ecosystemBadge || "PRODUCT ECOSYSTEM"}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.home.ecosystemTitle || "Products Built for Real-World Use"}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            {t.home.ecosystemSub || "Purposeful digital applications crafted for clarity, utility, and everyday efficiency."}
          </p>
        </ScrollReveal>

        {/* Dynamic Apps Showcase (Cards Managed via Admin Control Center) */}
        <DynamicAppsShowcase onNavigate={onNavigate} showAllLink={true} />

        {/* Ecosystem Grid: Flagship Hero Product & Lifetime Pass */}
        <div className="max-w-4xl mx-auto w-full space-y-6">
          
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
                  onClick={() => onNavigate('less-legal')}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap badge-one-line"
                >
                  <span>{isHindi ? "ऐप विवरण व फीचर्स" : "Explore Less Legal"}</span>
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

          {/* Permanent Lifetime Pass Banner Card (Preserved for monetization/Razorpay!) */}
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

        </div>
      </section>

      {/* 4. WHY LESS CREATION: BRAND PHILOSOPHY & 5 PRINCIPLES */}
      <section id="why-less-creation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-28">
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-900/30 border border-blue-500/20 dark:border-blue-700/40 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{t.home.whyBadge || "BRAND PHILOSOPHY & PURPOSE"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.home.whyTitle || "Why Less Creation"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            {t.home.whySubtitle || "Technology should make people more capable, more informed, and safer in the digital world."}
          </p>

          {/* Visual Brand Relationship Chain */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 py-2 px-4 rounded-2xl bg-blue-500/5 dark:bg-blue-950/40 border border-blue-500/15 dark:border-blue-800/30 text-[10px] sm:text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 font-black">DIGITAL SAFETY</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>AWARENESS</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>KNOWLEDGE</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>TECHNOLOGY</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>PRODUCTS</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-amber-600 dark:text-amber-400 font-black tracking-wider">
                LESS LEGAL (FLAGSHIP PRODUCT)
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* 5 Brand Principles Grid */}
        <div className="space-y-5">
          {/* First Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.home.whyPillars.slice(0, 3).map((pillar, idx) => {
              const icons = [ShieldCheck, Compass, Cpu];
              const PillarIcon = icons[idx];
              return (
                <div 
                  key={idx}
                  className="animated-card p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-[#0B132B]/90 border border-slate-200/90 dark:border-blue-900/40 backdrop-blur-xl shadow-xs hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-500/20">
                        {pillar.label || `0${idx + 1} · PRINCIPLE`}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Second Row: 2 Cards Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:max-w-4xl lg:mx-auto">
            {t.home.whyPillars.slice(3, 5).map((pillar, idx) => {
              const icons = [BookOpen, Sparkles];
              const PillarIcon = icons[idx];
              const cardIdx = idx + 3;
              return (
                <div 
                  key={cardIdx}
                  className="animated-card p-5 sm:p-6 rounded-2xl bg-white/95 dark:bg-[#0B132B]/90 border border-slate-200/90 dark:border-blue-900/40 backdrop-blur-xl shadow-xs hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-500/20">
                        {pillar.label || `0${cardIdx + 1} · PRINCIPLE`}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Closing Editorial Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-500/30 shadow-lg text-center space-y-3 max-w-4xl mx-auto mt-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>OUR COMMITMENT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {t.home.whyClosingTitle || "Building for a Safer Digital Future."}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.home.whyClosingText || "From practical digital tools to educational content, Less Creation focuses on making technology easier to understand, more useful in everyday life, and safer to navigate."}
          </p>
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
                  <div className="text-[10px] sm:text-[11px] text-amber-300 font-extrabold uppercase tracking-wider">
                    TECHNOLOGY • AWARENESS • DIGITAL SAFETY
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
                          src="/Founder1.jpg" 
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
                      
                      {/* Compact Bottom Identity Banner Positioned Lower */}
                      <div className="absolute bottom-2 inset-x-2.5 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-center shadow-lg">
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[8px] uppercase tracking-wider shadow-2xs">
                          <Scale className="w-2.5 h-2.5 fill-slate-950 shrink-0" />
                          <span>FOUNDER & ADVOCATE</span>
                        </div>
                        <h4 className="text-xs font-black text-white tracking-wide uppercase mt-0.5 leading-none">
                          Anurag Gurauli
                        </h4>
                        <p className="text-[9px] text-amber-200/90 font-bold leading-none mt-0.5">
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

    </div>
  );
};
