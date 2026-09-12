import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import { 
  Download, ArrowRight, Sparkles, 
  Calendar, Clock, BookOpen, ChevronRight,
  ChevronDown, User, Scale, Search, X,
  FileText, Calculator, Image as ImageIcon, QrCode, Briefcase,
  Star, ChevronLeft, Quote, Send, CheckCircle2, MessageSquare
} from 'lucide-react';
import { AppLogo } from '../components/AppLogo';
import { ThreeDDeviceShowcase } from '../components/ThreeDDeviceShowcase';
import { ScrollReveal } from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { DynamicAppsShowcase } from '../components/DynamicAppsShowcase';
import { articleService } from '../services/articleService';
import { adminStorage, UserStory, getDirectCloudImageUrl } from '../utils/adminStorage';

interface HomePageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  // User Stories & Community Experiences State
  const [userStories, setUserStories] = useState<UserStory[]>([]);
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

  // Real-time listener for approved User Stories
  useEffect(() => {
    const unsub = adminStorage.listenUserStories((allStories) => {
      const approvedOnly = allStories.filter(s => s.status === 'approved');
      setUserStories(approvedOnly.length > 0 ? approvedOnly : adminStorage.getApprovedUserStories());
    });
    return () => unsub();
  }, []);

  // Auto-slide User Stories Cards unlimited every 2 seconds
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
    }, 2000);

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
    } catch (err) {
      console.error('User story submission error:', err);
    } finally {
      setIsSubmittingStory(false);
    }
  };

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


 
      {/* 7. USER STORIES & COMMUNITY EXPERIENCES (SWIPEABLE CARDS WITH ADMIN APPROVAL) */}
      <section id="user-stories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <ScrollReveal direction="up">
          <div className="bg-stone-50 dark:bg-[#12141F] border border-stone-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs relative overflow-hidden">
            
            {/* Header & Write Story CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/70 dark:border-white/10 pb-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isHindi ? "उपयोगकर्ता अनुभव व कहानियाँ" : "Community Stories & Feedback"}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111016] dark:text-white tracking-tight">
                  {isHindi ? "नागरिकों एवं अधिवक्ताओं के अनुभव" : "User Stories & Community Voices"}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                  {isHindi 
                    ? "पढ़ें हमारे समुदाय के सदस्यों, अधिवक्ताओं और जागरूक नागरिकों के वास्तविक अनुभव। आप भी अपनी प्रतिक्रिया या कहानी लिख सकते हैं।"
                    : "Read real stories and feedback shared by citizens and legal professionals. Share your experience to help educate others."}
                </p>
              </div>

              {/* Share Experience Button & Scroll Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowStoryModal(true);
                    setStorySubmittedMsg(false);
                  }}
                  className="px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{isHindi ? "अपनी कहानी / अनुभव लिखें" : "Share Your Story"}</span>
                </button>

                {/* Manual Scroll Controls */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const container = document.getElementById('user-stories-scroll-container');
                      if (container) container.scrollBy({ left: -360, behavior: 'smooth' });
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-white hover:bg-stone-100 dark:hover:bg-white/15 transition-colors cursor-pointer"
                    title="Previous Stories"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('user-stories-scroll-container');
                      if (container) container.scrollBy({ left: 360, behavior: 'smooth' });
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-white hover:bg-stone-100 dark:hover:bg-white/15 transition-colors cursor-pointer"
                    title="Next Stories"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Right-to-Left / Left-to-Right Screen Card Swipe Slider */}
            <div 
              id="user-stories-scroll-container"
              onMouseEnter={() => setIsStoryHovered(true)}
              onMouseLeave={() => setIsStoryHovered(false)}
              onTouchStart={() => setIsStoryHovered(true)}
              onTouchEnd={() => setIsStoryHovered(false)}
              className="flex overflow-x-auto gap-5 pb-4 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
            >
              {userStories.map((story) => (
                <div
                  key={story.id}
                  className="w-[300px] sm:w-[360px] shrink-0 snap-start bg-white dark:bg-[#151720] border border-stone-200/90 dark:border-white/10 rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Stars & Quote */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (story.rating || 5)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-200 dark:text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                      <Quote className="w-5 h-5 text-stone-300 dark:text-stone-700 rotate-180" />
                    </div>

                    {/* Non-editable Comment Story Text */}
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic line-clamp-5">
                      “{story.story}”
                    </p>
                  </div>

                  {/* Author Meta */}
                  <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center justify-center text-xs">
                        {story.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111016] dark:text-white leading-tight flex items-center gap-1">
                          <span>{story.authorName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">
                          {story.authorRole}{story.city ? ` • ${story.city}` : ''}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/5 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Swipe Hint */}
            <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5 pt-1">
              <span>← Swipe cards to read more stories →</span>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* USER STORY SUBMISSION MODAL */}
      <AnimatePresence>
        {showStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setShowStoryModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400 hover:text-stone-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHindi ? "कहानी साझा करें" : "Share Experience"}</span>
                </div>
                <h3 className="text-xl font-black text-[#111016] dark:text-white">
                  {isHindi ? "अपनी टिप्पणी या अनुभव साझा करें" : "Share Your Story or Feedback"}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {isHindi 
                    ? "आपकी टिप्पणी सबमिट होने के बाद नॉन-एडिटेबल (Non-Editable) रहेगी और एडमिन द्वारा अप्रूवल मिलने के बाद होमपेज पर दिखाई देगी।"
                    : "Submitted comments are non-editable and will be reviewed by the admin panel before appearing live."}
                </p>
              </div>

              {storySubmittedMsg ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    {isHindi ? "आपकी कहानी सफलतापूर्वक जमा कर दी गई है!" : "Story Submitted Successfully!"}
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    {isHindi 
                      ? "धन्यवाद! आपकी टिप्पणी अब समीक्षा में है। एडमिन डैशबोर्ड से अप्रूवल (Trust Approval) मिलते ही यह होमपेज कार्ड में लाइव हो जाएगी।"
                      : "Thank you! Your story is submitted for approval. Once reviewed by our admin, it will appear on the homepage slider."}
                  </p>
                  <button
                    onClick={() => setShowStoryModal(false)}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-700 transition-colors"
                  >
                    {isHindi ? "बंद करें" : "Close"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitUserStory} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                        {isHindi ? "आपका नाम *" : "Your Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={storyForm.authorName}
                        onChange={(e) => setStoryForm({ ...storyForm, authorName: e.target.value })}
                        placeholder={isHindi ? "जैसे: राजेश शर्मा" : "e.g. Rajesh Sharma"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                        {isHindi ? "व्यवसाय / पद" : "Profession / Role"}
                      </label>
                      <input
                        type="text"
                        value={storyForm.authorRole}
                        onChange={(e) => setStoryForm({ ...storyForm, authorRole: e.target.value })}
                        placeholder={isHindi ? "जैसे: अधिवक्ता / छात्र" : "e.g. Advocate / Student"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                        {isHindi ? "शहर / स्थान" : "City / Location"}
                      </label>
                      <input
                        type="text"
                        value={storyForm.city}
                        onChange={(e) => setStoryForm({ ...storyForm, city: e.target.value })}
                        placeholder={isHindi ? "जैसे: लखनऊ" : "e.g. Lucknow"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                        {isHindi ? "रेटिंग (Rating)" : "Rating (1-5 Stars)"}
                      </label>
                      <div className="flex items-center gap-1 pt-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setStoryForm({ ...storyForm, rating: star })}
                            className="p-1 cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= storyForm.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-stone-300 dark:text-stone-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      {isHindi ? "आपकी कहानी / अनुभव टिप्पणी *" : "Your Experience Comment *"}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={storyForm.story}
                      onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                      placeholder={isHindi ? "Less Creation टूल्स और लीगल अवेयरनेस के अपने अनुभव साझा करें..." : "Share your experience with Less Creation tools or legal defense awareness..."}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowStoryModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer hover:bg-stone-200 dark:hover:bg-white/15 transition-colors"
                    >
                      {isHindi ? "रद्द करें" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingStory}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingStory ? (isHindi ? "भेज रहे हैं..." : "Submitting...") : (isHindi ? "टिप्पणी सबमिट करें" : "Submit Experience")}</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
