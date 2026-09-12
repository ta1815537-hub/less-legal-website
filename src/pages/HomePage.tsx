import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import { 
  Download, ArrowRight, Sparkles, 
  Calendar, Clock, BookOpen, ChevronRight,
  ChevronDown, User, Scale, Search, X,
  FileText, Calculator, Image as ImageIcon, QrCode, Briefcase
} from 'lucide-react';
import { AppLogo } from '../components/AppLogo';
import { ThreeDDeviceShowcase } from '../components/ThreeDDeviceShowcase';
import { ScrollReveal } from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { DynamicAppsShowcase } from '../components/DynamicAppsShowcase';
import { articleService } from '../services/articleService';
import { getDirectCloudImageUrl } from '../utils/adminStorage';

interface HomePageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [founderImgErr, setFounderImgErr] = useState(false);

  // Real-Time Articles Feed State
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [articleCategory, setArticleCategory] = useState<string>('ALL');
  const [articleSearch, setArticleSearch] = useState<string>('');

  // Curated Featured Tools for Modern Product Showcase
  const coreTools = [
    {
      id: 'rti-draft',
      slug: 'rti-draft',
      category: isHindi ? 'कानूनी अधिकार' : 'Legal Rights',
      title: isHindi ? 'आरटीआई ड्राफ्ट जनरेटर' : 'RTI Draft Generator',
      description: isHindi ? 'सूचना का अधिकार (RTI) आवेदन पत्र सरल व सटीक कानूनी प्रारूप में तैयार करें।' : 'Generate structured Right to Information applications with statutory legal formatting.',
      icon: FileText
    },
    {
      id: 'pdf-merge',
      slug: 'pdf-merge',
      category: isHindi ? 'दस्तावेज़ सुइट' : 'Document Suite',
      title: isHindi ? 'पीडीएफ मर्ज व स्प्लिट' : 'PDF Merge & Split',
      description: isHindi ? '100% ऑन-डिवाइस सुरक्षित प्रोसेसिंग। फाइलें कभी सर्वर पर अपलोड नहीं होतीं।' : '100% on-device private processing. Merge and manage judicial & office documents locally.',
      icon: FileText
    },
    {
      id: 'court-fee-calc',
      slug: 'court-fee-calc',
      category: isHindi ? 'कानूनी गणना' : 'Legal Finance',
      title: isHindi ? 'कोर्ट फीस एवं स्टांप कैलकुलेटर' : 'Court Fee Calculator',
      description: isHindi ? 'मुकदमा मूल्य और क्षेत्राधिकार के आधार पर आवश्यक कोर्ट फीस की त्वरित गणना करें।' : 'Calculate court fees, valuation thresholds, and legal stamp duty accurately.',
      icon: Calculator
    },
    {
      id: 'image-compress',
      slug: 'image-compress',
      category: isHindi ? 'डिजिटल उपकरण' : 'Digital Suite',
      title: isHindi ? 'स्मार्ट इमेज कंप्रेसर' : 'Smart Image Compressor',
      description: isHindi ? 'सरकारी व न्यायिक पोर्टल हेतु गुणवत्ता बनाए रखते हुए फोटो का आकार कम करें।' : 'Reduce file size for official e-filing and job portal submissions with local privacy.',
      icon: ImageIcon
    },
    {
      id: 'case-diary',
      slug: 'case-diary',
      category: isHindi ? 'कार्य प्रबंधन' : 'Productivity',
      title: isHindi ? 'केस डायरी व हियरिंग ट्रैकर' : 'Case Diary Workspace',
      description: isHindi ? 'अधिवक्ताओं व वादकारियों के लिए अगली तारीख, केस विवरण व नोट्स का व्यवस्थित रिकॉर्ड।' : 'Track court hearings, cause list dates, and case notes in an offline-ready diary.',
      icon: Briefcase
    },
    {
      id: 'qr-generator',
      slug: 'qr-generator',
      category: isHindi ? 'सुरक्षित उपयोगिता' : 'Utilities',
      title: isHindi ? 'सुरक्षित क्यूआर जनरेटर' : 'Secure QR Generator',
      description: isHindi ? 'बिना किसी ट्रैकिंग के लिंक, संपर्क व यूपीआई के लिए त्वरित क्यूआर कोड बनाएं।' : 'Generate instant QR codes for links, text, and payments with zero analytics tracking.',
      icon: QrCode
    }
  ];

  const handleLaunchTool = (slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tool', slug);
    window.history.pushState({}, '', url.toString());
    onNavigate('tools');
  };

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
  const faqs = useMemo(() => [
    {
      q: isHindi ? "लेस क्रिएशन का मुख्य उद्देश्य क्या है?" : "What is the objective of Less Creation?",
      a: isHindi 
        ? "लेस क्रिएशन अधिवक्ता अनुराग गुरौली (इलाहाबाद उच्च न्यायालय) का एक आधिकारिक विधिक व डिजिटल जागरूकता मंच है। इसका मुख्य उद्देश्य आम नागरिकों को ऑनलाइन धोखाधड़ी, डिजिटल अरेस्ट, वित्तीय घोटालों और साइबर अपराधों से बचाने हेतु विधिक रूप से सजग करना, व्यावहारिक सुरक्षा तकनीकें सिखाना और मार्गदर्शन प्रदान करना है। भविष्य में इससे संबंधित विशेष साइबर सुरक्षा टूल्स भी यहाँ उपलब्ध कराए जा सकते हैं।"
        : "Less Creation is an official legal & digital awareness initiative founded by Advocate Anurag Gurauli (High Court). Its primary objective is to empower everyday citizens with cyber law literacy, online fraud defense techniques, and statutory legal safeguards against digital crimes. Specialized cybersecurity and compliance utilities may also be provided here in the future."
    },
    {
      q: isHindi ? "क्या यहाँ साइबर सुरक्षा सम्बन्धी जानकारी व विधिक मार्गदर्शन मिलेगा?" : "Will I find cybersecurity information and legal guidance here?",
      a: isHindi 
        ? "जी हाँ, यहाँ आपको साइबर अपराधों से बचाव की व्यावहारिक तकनीकें, ऑनलाइन धोखाधड़ी से निपटने के कानूनी उपाय, आईटी एक्ट की धाराएं और दैनिक जीवन में डिजिटल सुरक्षा बनाए रखने के प्रामाणिक टिप्स मिलेंगे।"
        : "Yes, this platform provides authoritative articles, practical defense techniques against digital fraud, statutory information on cyber law, and daily digital safety tips."
    },
    {
      q: isHindi ? "भविष्य में इस वेबसाइट पर क्या सुविधाएं मिलेंगी?" : "What features will be available on this platform in the future?",
      a: isHindi 
        ? "भविष्य में आम नागरिकों और अधिवक्ताओं की सहायता हेतु साइबर सुरक्षा चेकिंग टूल्स, विधिक ड्राफ्टिंग सुविधाएं और ऑन-डिवाइस सुरक्षित यूटिलिटीज जोड़ी जा सकती हैं।"
        : "In the future, specialized cybersecurity verification tools, statutory drafting aids, and privacy-first digital utilities will be made available for citizens and legal professionals."
    },
    {
      q: isHindi ? "यह मंच किसके द्वारा संचालित और निर्देशित है?" : "Who manages and directs this initiative?",
      a: isHindi 
        ? "यह मंच इलाहाबाद उच्च न्यायालय में कार्यरत अधिवक्ता अनुराग गुरौली द्वारा व्यक्तिगत रूप से संचालित, डिजाइन और निर्देशित एक स्वतंत्र जन-जागरूकता पहल है।"
        : "This platform is an independent initiative personally created, designed, and directed by Advocate Anurag Gurauli, Advocate at the Allahabad High Court."
    }
  ], [isHindi]);

  return (
    <div className="flex flex-col gap-16 sm:gap-24 overflow-hidden transition-colors pb-28">
      
      {/* 1. HERO SECTION: MODERN PRODUCT DARK NAVY HERO (REFERENCE STYLE B INFLUENCE) */}
      <section className="relative w-full bg-[#0B1120] text-white border-b border-white/10 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#16A34A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Bold White Typography & Editorial Hierarchy */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                {isHindi ? (
                  <>
                    नागरिकों की कानूनी व <br />
                    <span className="text-[#22C55E]">साइबर सुरक्षा के लिए समर्पित।</span>
                  </>
                ) : (
                  <>
                    Cyber Law, Digital Defense & <br />
                    <span className="text-[#22C55E]">Public Legal Safety.</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl font-normal">
                {isHindi 
                  ? "अधिवक्ता अनुराग गुरौली (इलाहाबाद उच्च न्यायालय) का यह आधिकारिक मंच आम नागरिकों को साइबर अपराधों, ऑनलाइन धोखाधड़ी और डिजिटल खतरों से सुरक्षित रखने हेतु कानूनी जागरूकता, व्यावहारिक सुरक्षा तकनीकें और आवश्यक मार्गदर्शन प्रदान करने के लिए तत्पर है। भविष्य में इस मंच पर साइबर सुरक्षा से जुड़े विशेष टूल्स भी उपलब्ध कराए जा सकते हैं।"
                  : "The official digital platform of Advocate Anurag Gurauli (High Court), dedicated to equipping citizens with cyber law awareness, online fraud defense techniques, and statutory protections. Purpose-built cybersecurity and legal safety tools may also be introduced here in the future."}
              </p>

              {/* Action Buttons: Clean & Perfectly Aligned */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('articles')}
                  className="px-6 py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isHindi ? "साइबर सुरक्षा लेख व गाइड पढ़ें" : "Read Cyber Safety Guides"}</span>
                </button>

                <button
                  onClick={() => onNavigate('tools')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{isHindi ? "टूल्स डायरेक्टरी देखें" : "Explore All Tools"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Right Column: 3D Device Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 w-full flex justify-center items-center"
            >
              <ThreeDDeviceShowcase imageSrc="/Screenshot.jpg" language={language} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ARTICLES & EDITORIAL KNOWLEDGE SECTION */}
      <section id="homepage-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        <ScrollReveal direction="up" className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-white/10 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
              {isHindi ? "संपादकीय एवं गाइड" : "EDITORIAL & GUIDES"}
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#111016] dark:text-white tracking-tight mt-1">
              {isHindi ? 'ज्ञान जो आपको सुरक्षित रखे' : 'Knowledge That Keeps You Safe'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('articles')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] dark:text-[#22C55E] hover:underline transition-colors cursor-pointer"
          >
            <span>{isHindi ? 'सभी लेख देखें' : 'View All Publications'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </ScrollReveal>

        {/* Category Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
            {[
              { key: 'ALL', label: isHindi ? 'सभी लेख' : 'All Articles' },
              { key: 'Digital Safety', label: isHindi ? 'डिजिटल सुरक्षा' : 'Digital Safety' },
              { key: 'Fraud Awareness', label: isHindi ? 'धोखाधड़ी बचाव' : 'Fraud Awareness' },
              { key: 'Legal Awareness', label: isHindi ? 'कानूनी अधिकार' : 'Legal Awareness' },
              { key: 'Privacy & Security', label: isHindi ? 'गोपनीयता' : 'Privacy & Security' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setArticleCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  articleCategory === cat.key
                    ? 'bg-[#111016] text-white border-[#111016] dark:bg-white dark:text-[#111016] dark:border-white'
                    : 'bg-stone-100 dark:bg-[#151720] text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-white/10 hover:border-stone-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={articleSearch}
              onChange={(e) => setArticleSearch(e.target.value)}
              placeholder={isHindi ? 'लेख खोजें...' : 'Search articles...'}
              className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 rounded-lg text-[#111016] dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#16A34A]"
            />
            {articleSearch && (
              <button
                onClick={() => setArticleSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
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
                className="group border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] p-6 hover:border-[#16A34A]/60 transition-colors cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-2xs"
              >
                <div className="md:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-stone-800 dark:text-stone-200 text-[11px] font-bold">
                      {featuredArticle.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-[#16A34A] dark:text-[#22C55E] text-[11px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isHindi ? "मुख्य लेख" : "Featured"}</span>
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {formatArticleDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#111016] dark:text-white group-hover:text-[#16A34A] dark:group-hover:text-[#22C55E] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed font-normal">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-white/5 text-xs text-stone-500">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      Less Creation Editorial
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {featuredArticle.readingTime}
                      </span>
                      <span className="text-[#16A34A] dark:text-[#22C55E] font-bold flex items-center gap-0.5">
                        <span>{isHindi ? 'पढ़ें' : 'Read Article'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 aspect-video rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200/60 dark:border-white/5 overflow-hidden flex items-center justify-center">
                  {featuredArticle.featuredImage ? (
                    <img 
                      src={getDirectCloudImageUrl(featuredArticle.featuredImage)} 
                      alt={featuredArticle.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-1">
                      <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
                      <span className="text-[10px] uppercase font-bold text-stone-400">Editorial Guide</span>
                    </div>
                  )}
                </div>
              </article>
            )}

            {/* Recent Articles Grid */}
            {recentArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => onNavigate('article-detail', { slug: article.slug })}
                    className="group border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] overflow-hidden hover:border-[#16A34A]/60 transition-colors cursor-pointer flex flex-col justify-between shadow-2xs"
                  >
                    <div className="aspect-video bg-stone-100 dark:bg-white/5 border-b border-stone-100 dark:border-white/5 overflow-hidden flex items-center justify-center relative">
                      {article.featuredImage ? (
                        <img
                          src={getDirectCloudImageUrl(article.featuredImage)}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center p-4 space-y-1">
                          <BookOpen className="w-7 h-7 text-stone-400 mx-auto" />
                          <span className="text-[9px] uppercase font-bold text-stone-400">Article</span>
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#111016] text-white text-[10px] font-bold">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatArticleDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                        <h4 className="text-base font-bold text-[#111016] dark:text-white group-hover:text-[#16A34A] dark:group-hover:text-[#22C55E] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {article.readingTime}
                        </span>
                        <span className="text-[#16A34A] dark:text-[#22C55E] font-bold flex items-center gap-0.5">
                          <span>{isHindi ? 'पढ़ें' : 'Read'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Curated Foundational Guides */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'guide-digital-arrest',
                title: isHindi 
                  ? 'डिजिटल अरेस्ट फ्रॉड: फर्जी पुलिस और सीबीआई वीडियो कॉल का सच' 
                  : 'Digital Arrest Frauds: How Fake Police & CBI Video Calls Trap Citizens',
                category: isHindi ? 'डिजिटल सुरक्षा' : 'Digital Safety',
                excerpt: isHindi 
                  ? 'स्काइप और व्हाट्सएप पर फर्जी पुलिस वर्दी व कोर्ट सेटअप बनाकर नागरिकों से लाखों की उगाही करने के तरीकों व बचाव के नियम।' 
                  : 'How cyber syndicates impersonate law enforcement and court officials on video calls, and key steps to protect yourself.',
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
                className="group border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] p-5 hover:border-[#16A34A]/60 transition-colors cursor-pointer flex flex-col justify-between shadow-2xs space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-stone-800 dark:text-stone-200 text-[10px] font-bold">
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-stone-400">{guide.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#111016] dark:text-white group-hover:text-[#16A34A] dark:group-hover:text-[#22C55E] transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {guide.readingTime}
                  </span>
                  <span className="text-[#16A34A] dark:text-[#22C55E] font-bold flex items-center gap-0.5">
                    <span>{isHindi ? 'विस्तार से पढ़ें' : 'Read Guide'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. MANIFESTO & PHILOSOPHY */}
      <section id="mission-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal direction="up" className="border border-stone-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#151720] shadow-2xs space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
            LESS CREATION MANIFESTO
          </div>

          <blockquote className="text-xl sm:text-3xl font-bold text-[#111016] dark:text-white leading-snug tracking-tight">
            “{t.home.missionQuote || "When technology removes unnecessary hurdles and respects human time, it transforms everyday work into effortless progress."}”
          </blockquote>

          <div className="pt-4 border-t border-stone-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
            <span>Built with integrity for Indian citizens, advocates & innovators.</span>
            <span className="font-mono text-[#16A34A] dark:text-[#22C55E] font-semibold">#LessFrictionMoreFocus</span>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. FOUNDER SPOTLIGHT: ADVOCATE ANURAG GURAULI */}
      <section id="founder-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#151720] shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[280px] sm:max-w-[320px] rounded-2xl overflow-hidden border border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-stone-900 shadow-sm aspect-[4/5] relative">
                  {!founderImgErr ? (
                    <img 
                      src="/Founder1.jpg" 
                      alt="Anurag Gurauli — Founder of Less Creation & Advocate"
                      onError={() => setFounderImgErr(true)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <Scale className="w-10 h-10 text-[#16A34A] dark:text-[#22C55E] mb-2" />
                      <div className="text-base font-bold text-[#111016] dark:text-white">Anurag Gurauli</div>
                      <div className="text-xs text-stone-500 mt-1">Founder, Less Creation</div>
                    </div>
                  )}

                  <div className="absolute bottom-2 inset-x-2 p-2 rounded-xl bg-[#111016]/85 backdrop-blur-sm text-center text-white">
                    <div className="text-xs font-bold uppercase">Anurag Gurauli</div>
                    <div className="text-[10px] text-stone-300">Founder & Advocate, High Court</div>
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
                  {isHindi ? "संस्थापक परिचय • साइबर कानून विशेषज्ञ" : "FOUNDER PROFILE • CYBER LAW EXPERT"}
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#111016] dark:text-white leading-tight">
                  {isHindi 
                    ? "अधिवक्ता अनुराग गुरौली: आम नागरिकों की डिजिटल सुरक्षा के सजग प्रहरी" 
                    : "Advocate Anurag Gurauli: Safeguarding Citizen Rights in the Digital Age"}
                </h3>

                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                  {isHindi 
                    ? "अधिवक्ता अनुराग गुरौली (इलाहाबाद उच्च न्यायालय) साइबर कानून और डिजिटल सुरक्षा के प्रतिष्ठित जानकार हैं। वे एक निष्ठावान, कर्मठ और संवेदनशील विधिक व्यक्तित्व हैं, जो आम लोगों को ऑनलाइन धोखाधड़ी, फर्जीवाड़े और साइबर खतरों से बचाने के लिए निरंतर प्रयासरत हैं। उनका संकल्प है कि हर नागरिक विधिक रूप से जागरूक और डिजिटल रूप से सुरक्षित रहे।"
                    : "Advocate Anurag Gurauli (High Court) is an accomplished authority in cybersecurity and cyber law. Known for his unwavering diligence and deep concern for citizen safety, he is dedicated to educating individuals on digital self-defense, IT regulations, and fraud prevention."}
                </p>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs sm:text-sm text-stone-700 dark:text-stone-300 italic">
                  “{isHindi 
                    ? "जब नागरिक अपने कानूनी अधिकारों और डिजिटल सुरक्षा तकनीकों से अवगत होते हैं, तभी वे ऑनलाइन शोषण और वित्तीय धोखाधड़ी से सुरक्षित रह सकते हैं।"
                    : "When citizens understand their legal rights and digital defense techniques, they become resilient against fraud and cyber deception."}”
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate('founder')}
                    className="px-5 py-2.5 bg-[#111016] hover:bg-black text-white dark:bg-white dark:hover:bg-stone-100 dark:text-[#111016] text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{isHindi ? "संस्थापक प्रोफाइल पढ़ें" : "Read Founder's Story"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate('about')}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <span>{isHindi ? "हमारे बारे में" : "About Less Creation"}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>
 
      {/* 7. FINAL CTA: MODERN PRODUCT DARK CALLOUT */}
      <section id="final-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ScrollReveal direction="up">
          <div className="rounded-3xl bg-[#0B1120] text-white border border-white/10 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-xl">
            <div className="space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {isHindi ? "विधिक रूप से जागरूक, डिजिटल रूप से सुरक्षित" : "Legally Aware, Digitally Secure."}
              </h2>
              <p className="text-sm sm:text-base text-stone-300 font-normal">
                {isHindi 
                  ? "साइबर सुरक्षा नियमों, आईटी कानून और ऑनलाइन फ्रॉड से बचाव के लिए प्रामाणिक गाइड्स और टूल्स का लाभ उठाएं।"
                  : "Explore verified cybersecurity insights, statutory rights under cyber laws, and practical digital safeguards."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('articles')}
                className="px-6 py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isHindi ? "साइबर सुरक्षा गाइड पढ़ें" : "Read Cyber Safety Guides"}</span>
              </button>

              <button
                onClick={() => onNavigate('tools')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <span>{isHindi ? "टूल्स डायरेक्टरी देखें" : "Explore All Tools"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal direction="up" className="text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#111016] dark:text-white tracking-tight">
            Got Questions ?
          </h2>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div 
                key={idx}
                className="border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] overflow-hidden transition-colors shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#111016] dark:text-white focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#16A34A] dark:text-[#22C55E]' : ''}`} />
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
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-white/5 pt-3 font-normal">
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
