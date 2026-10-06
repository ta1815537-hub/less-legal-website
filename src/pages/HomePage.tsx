import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import { 
  ArrowRight, Calendar, Clock, BookOpen, ChevronRight,
  ChevronDown, Search, X, Star, ChevronLeft, Quote, Send, 
  CheckCircle2, MessageSquare, ShieldCheck, Lock, 
  FileText, Cpu, Heart, Layers, ArrowUpRight
} from 'lucide-react';
import { ScrollReveal } from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/articleService';
import { adminStorage, UserStory, getDirectCloudImageUrl } from '../utils/adminStorage';
import { FounderProfileHeroBanner } from '../components/FounderProfileHeroBanner';

interface HomePageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  // User Stories & Community Experiences State
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  
  // Lifetime Pass Special Offer Countdown Timer (120 days)
  const [passTimeLeft, setPassTimeLeft] = useState({ days: 120, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const STORAGE_KEY = 'less_legal_promo_target_120d_v1';
    let targetTime = localStorage.getItem(STORAGE_KEY);
    const ONE_HUNDRED_TWENTY_DAYS_MS = (120 * 24 * 3600 + 14 * 3600 + 28 * 60 + 45) * 1000;
    
    if (!targetTime) {
      const newTarget = Date.now() + ONE_HUNDRED_TWENTY_DAYS_MS;
      localStorage.setItem(STORAGE_KEY, newTarget.toString());
      targetTime = newTarget.toString();
    }
    
    const interval = setInterval(() => {
      const difference = parseInt(targetTime!) - Date.now();
      if (difference <= 0) {
        const newTarget = Date.now() + ONE_HUNDRED_TWENTY_DAYS_MS;
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
        targetTime = newTarget.toString();
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setPassTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storySubmittedMsg, setStorySubmittedMsg] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [storyForm, setStoryForm] = useState({
    authorName: '',
    authorRole: '',
    city: '',
    rating: 5,
    story: ''
  });

  // Real-time listener for approved User Stories from Firebase
  useEffect(() => {
    const unsub = adminStorage.listenUserStories((allStories) => {
      const approvedOnly = allStories.filter(s => s.status === 'approved');
      setUserStories(approvedOnly.length > 0 ? approvedOnly : adminStorage.getApprovedUserStories());
    });
    return () => unsub();
  }, []);

  // Auto-slide User Stories Cards every 3 seconds when not hovered
  const [isStoryHovered, setIsStoryHovered] = useState(false);

  useEffect(() => {
    if (userStories.length <= 1 || isStoryHovered || showStoryModal) return;

    const interval = setInterval(() => {
      const container = document.getElementById('user-stories-scroll-container');
      if (container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 360, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [userStories.length, isStoryHovered, showStoryModal]);

  const handleSubmitUserStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.authorName.trim() || !storyForm.story.trim()) return;

    setIsSubmittingStory(true);
    try {
      await adminStorage.saveUserStory({
        authorName: storyForm.authorName.trim(),
        authorRole: storyForm.authorRole.trim() || (isHindi ? 'नागरिक' : 'Citizen'),
        city: storyForm.city.trim() || '',
        story: storyForm.story.trim(),
        rating: storyForm.rating
      });
      setStorySubmittedMsg(true);
      setStoryForm({
        authorName: '',
        authorRole: '',
        city: '',
        rating: 5,
        story: ''
      });
    } catch {
      // Handled
    } finally {
      setIsSubmittingStory(false);
    }
  };

  // Editorial Articles State
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [articleCategory, setArticleCategory] = useState<string>('ALL');
  const [articleSearch, setArticleSearch] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchArticles = async () => {
      try {
        const list = await articleService.getPublicArticleSummaries();
        if (isMounted) {
          setArticles(list);
        }
      } catch {
        // Handled silently
      }
    };

    fetchArticles();

    const unsubscribe = articleService.subscribeToPublicSummaries((updated) => {
      if (isMounted) {
        setArticles(updated);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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

  // Knowledge Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = useMemo(() => [
    {
      q: isHindi ? "लेस क्रिएशन का मुख्य उद्देश्य क्या है?" : "What is the mission of Less Creation?",
      a: isHindi 
        ? "लेस क्रिएशन इलाहाबाद उच्च न्यायालय के अधिवक्ता अनुराग गुरौली द्वारा स्थापित एक आधिकारिक विधिक व डिजिटल जागरूकता मंच है। इसका मुख्य उद्देश्य आम नागरिकों को ऑनलाइन वित्तीय धोखाधड़ी, डिजिटल अरेस्ट, साइबर अपराधों से कानूनी सुरक्षा प्रदान करना और बिना किसी जटिलता के उपयोगी डिजिटल टूल्स उपलब्ध कराना है।"
        : "Less Creation is an official legal & cyber safety initiative founded by Advocate Anurag Gurauli, Allahabad High Court. It bridges legal authority with modern technology, empowering citizens with statutory defense against cyber fraud, digital arrest scams, and client-side privacy tools."
    },
    {
      q: isHindi ? "क्या यहाँ उपलब्ध टूल्स में मेरा डेटा निजी व सुरक्षित रहता है?" : "Are the tools completely private and safe to use?",
      a: isHindi 
        ? "जी हाँ, हमारे 95% से अधिक टूल्स (PDF टूल्स, कैलकुलेटर, इमेज टूल्स, क्यूआर कोड) क्लाइंट-साइड सीधे आपके ब्राउज़र में काम करते हैं। आपका कोई भी दस्तावेज़ या व्यक्तिगत डेटा हमारे सर्वर पर अपलोड नहीं होता।"
        : "Absolutely. Over 95% of our utilities operate client-side within your browser. Your confidential files never touch our servers."
    },
    {
      q: isHindi ? "साइबर अपराध या डिजिटल अरेस्ट की स्थिति में तुरंत क्या कदम उठाएं?" : "What immediate action should be taken in case of cyber fraud?",
      a: isHindi 
        ? "वित्तीय धोखाधड़ी होने पर तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें।"
        : "Dial the National Cyber Crime Helpline 1930 immediately or file an incident on cybercrime.gov.in."
    },
    {
      q: isHindi ? "यह मंच किसके द्वारा संचालित और निर्देशित है?" : "Who manages and directs this platform?",
      a: isHindi 
        ? "यह मंच इलाहाबाद उच्च न्यायालय में कार्यरत अधिवक्ता अनुराग गुरौली द्वारा संचालित और निर्देशित एक स्वतंत्र जन-जागरूकता पहल है।"
        : "This platform is an independent public initiative created and legally directed by Advocate Anurag Gurauli, Allahabad High Court."
    }
  ], [isHindi]);

  return (
    <div className="flex flex-col overflow-x-hidden transition-colors pb-32 sm:pb-36 bg-[#070B12] text-white">
      
      {/* =========================================================================
          1. HERO SECTION: KALI LINUX CYBER ENVIRONMENT LAYOUT
          ========================================================================= */}
      <section className="relative w-full bg-[#070B12] text-white border-b border-white/10 pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden">
        {/* Cyber Safety Grid Background Effect */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 38, 38, 0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070B12]/80 to-[#070B12]" />
          
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/30 to-transparent z-0"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Clear Display Headline - Secured & Professional */}
            {/* Bold Display Headline - Slightly smaller size */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {isHindi ? (
                <>
                  <span className="font-devanagari">साइबर सुरक्षा व विधिक अधिकार।</span> <br />
                  <span className="text-red-500 font-devanagari">
                    आम नागरिकों के लिए सशक्त मंच।
                  </span>
                </>
              ) : (
                <>
                  Cyber Law. Digital Defense. <br />
                  <span className="text-red-500">
                    Built for everyday citizens.
                  </span>
                </>
              )}
            </h1>

            {/* Clear Description Paragraph - Smaller size */}
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-xl mx-auto font-normal">
              {isHindi 
                ? "अधिवक्ता अनुराग गुरौली (इलाहाबाद उच्च न्यायालय) का आधिकारिक मंच — जहाँ डिजिटल फ्रॉड से बचाव की कानूनी तकनीकें और सीधे आपके डिवाइस पर चलने वाले 29+ सुरक्षित टूल्स उपलब्ध हैं।"
                : "The official platform by Advocate Anurag Gurauli (High Court). Actionable statutory defense against online fraud, paired with 29+ private, browser-based utilities."}
            </p>

            {/* Action Buttons in Cyber Red */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('tools')}
                className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-950/60 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <span>{isHindi ? "सभी 29+ टूल्स देखें" : "Explore 29+ Tools"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('articles')}
                className="px-6 py-3.5 text-stone-400 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{isHindi ? "सुरक्षा गाइड पढ़ें" : "Read Cyber Guides"}</span>
              </button>
            </div>

          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          2. FOUNDER PROFILE EDITORIAL AUTO SLIDE BANNER (SHIFTED UP)
          ========================================================================= */}
      <section id="founder-profile" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6 sm:-mt-8 relative z-20">
        <FounderProfileHeroBanner onNavigate={onNavigate} />
      </section>

      {/* =========================================================================
          3. EDITORIAL ARTICLES & CYBER DEFENSE KNOWLEDGE
          ========================================================================= */}
      <section id="homepage-articles" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 space-y-8 w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              {isHindi ? 'ज्ञान जो आपको धोखाधड़ी से बचाए' : 'Practical Cyber Law & Scam Defense'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('articles')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-red-400 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isHindi ? 'सभी लेख पढ़ें' : 'View All Publications'}</span>
          </button>
        </div>

        {/* Featured Story + Secondary Guides */}
        {featuredArticle && articleCategory === 'ALL' && !articleSearch.trim() && (
          <article 
            onClick={() => onNavigate('article-detail', { slug: featuredArticle.slug || featuredArticle.id })}
            className="group border border-white/10 rounded-2xl bg-[#0E1424] p-6 sm:p-8 hover:border-red-500/50 transition-all duration-200 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-md"
          >
            <div className="md:col-span-7 space-y-3.5">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold">
                <span>{formatArticleDate(featuredArticle.publishedAt || featuredArticle.createdAt)}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white group-hover:text-red-400 transition-colors leading-tight">
                {featuredArticle.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 line-clamp-3 leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-white">
                <span className="text-stone-400 font-normal">By Advocate Anurag Gurauli</span>
                <span className="text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="md:col-span-5 aspect-[16/10] rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
              {featuredArticle.featuredImage ? (
                <img 
                  src={getDirectCloudImageUrl(featuredArticle.featuredImage)} 
                  alt={featuredArticle.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                  loading="lazy"
                />
              ) : (
                <BookOpen className="w-10 h-10 text-stone-400" />
              )}
            </div>
          </article>
        )}

        {/* Secondary Articles Grid */}
        {recentArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentArticles.map(article => (
              <article
                key={article.id}
                onClick={() => onNavigate('article-detail', { slug: article.slug || article.id })}
                className="group border border-white/10 rounded-xl bg-[#0E1424] overflow-hidden hover:border-red-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-xs"
              >
                <div className="aspect-[16/9] bg-stone-100 dark:bg-white/5 overflow-hidden flex items-center justify-center">
                  {article.featuredImage ? (
                    <img
                      src={getDirectCloudImageUrl(article.featuredImage)}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-stone-400" />
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                      <span>{formatArticleDate(article.publishedAt || article.createdAt)}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-red-400">
                    <span>Read Publication</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. LIFETIME PASS SPECIAL OFFER
          ========================================================================= */}
      <section id="vip-pass-offer" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 w-full">
        <div className="rounded-3xl p-8 sm:p-12 border border-[#C9A24B]/40 bg-[#0B1120] text-white shadow-xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4 text-left">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Lifetime Premium Pass
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg">
                Permanent ad-free utility access, secure case diary, and advanced document tools for a single one-time contribution. Bound securely to your email address without recurring subscription fees.
              </p>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-black/30 border border-white/10 space-y-5 text-center flex flex-col items-center justify-center">
              {/* 4-Field Countdown */}
              <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <span className="block text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                    {passTimeLeft.days.toString().padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-stone-400 uppercase">Days</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <span className="block text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                    {passTimeLeft.hours.toString().padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-stone-400 uppercase">Hours</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <span className="block text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                    {passTimeLeft.minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-stone-400 uppercase">Mins</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <span className="block text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                    {passTimeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="block text-[9px] text-stone-400 uppercase">Secs</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('premium')}
                className="w-full py-3.5 px-6 rounded-xl bg-red-600/85 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-950/50 backdrop-blur-md border border-red-500/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Claim VIP Pass for ₹99</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. VERIFIED COMMUNITY TESTIMONIALS
          ========================================================================= */}
      <section id="community-voices" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-300/80 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Community Feedback & Citizen Voices
            </h2>
          </div>

          <button
            onClick={() => {
              setShowStoryModal(true);
              setStorySubmittedMsg(false);
            }}
            className="text-xs font-bold text-slate-900 dark:text-white hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Your Experience</span>
          </button>
        </div>

        {/* Horizontal Marquee */}
        <div 
          id="user-stories-scroll-container"
          onMouseEnter={() => setIsStoryHovered(true)}
          onMouseLeave={() => setIsStoryHovered(false)}
          className="flex overflow-x-auto gap-5 pb-4 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {userStories.map(story => (
            <div
              key={story.id}
              className="w-[300px] sm:w-[340px] shrink-0 snap-start bg-white dark:bg-[#101522] border border-stone-300/80 dark:border-white/10 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-5 h-5 text-stone-400 rotate-180" />
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic line-clamp-4">
                  “{story.story}”
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white leading-tight">
                    {story.authorName}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {story.authorRole}{story.city ? ` · ${story.city}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submission Modal */}
      <AnimatePresence>
        {showStoryModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-12 bg-black/40 backdrop-blur-[2px] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#0F1420] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative mt-4"
            >
              <button
                onClick={() => setShowStoryModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Share Your Experience
                </h3>
              </div>

              {storySubmittedMsg ? (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-red-500 mx-auto" />
                  <div className="text-sm font-bold text-red-400">
                    Story Submitted Successfully!
                  </div>
                  <button
                    onClick={() => setShowStoryModal(false)}
                    className="mt-2 px-5 py-2.5 rounded-full bg-red-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitUserStory} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={storyForm.authorName}
                      onChange={(e) => setStoryForm({ ...storyForm, authorName: e.target.value })}
                      placeholder="Your Name *"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500"
                    />
                    <input
                      type="text"
                      value={storyForm.authorRole}
                      onChange={(e) => setStoryForm({ ...storyForm, authorRole: e.target.value })}
                      placeholder="Profession / Role"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <input
                    type="text"
                    value={storyForm.city}
                    onChange={(e) => setStoryForm({ ...storyForm, city: e.target.value })}
                    placeholder="City / Location"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500"
                  />

                  <textarea
                    required
                    rows={4}
                    value={storyForm.story}
                    onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                    placeholder="Your comments or experience with Less Creation tools..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-red-500 resize-none"
                  />

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowStoryModal(false)}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-stone-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingStory}
                      className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isSubmittingStory ? "Submitting..." : "Submit Experience"}
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          8. KNOWLEDGE FAQ (CLEAN HORIZONTAL HAIRLINE DIVIDERS)
          ========================================================================= */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 space-y-6 w-full">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="border-t border-stone-300/80 dark:border-white/10 divide-y divide-stone-300/80 dark:divide-white/10">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-2 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
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
