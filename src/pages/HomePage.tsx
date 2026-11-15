import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import {
  ArrowRight, BookOpen, ChevronRight,
  ChevronDown, Star, Send,
  CheckCircle2, Sparkles, Smartphone, ShieldCheck, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/articleService';
import { adminStorage, UserStory, getDirectCloudImageUrl } from '../utils/adminStorage';
import { FounderProfileHeroBanner } from '../components/FounderProfileHeroBanner';
import { DynamicNoticeBoard } from '../components/DynamicNoticeBoard';
import { HomepageBannerCarousel } from '../components/HomepageBannerCarousel';
import { VipArticleLoader } from '../components/VipArticleLoader';

interface HomePageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // User Stories State (linked to Firestore + Admin Dashboard without wiping other stories)
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [showInlineStoryForm, setShowInlineStoryForm] = useState(false);
  const [storySubmittedMsg, setStorySubmittedMsg] = useState(false);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const storyFormSectionRef = useRef<HTMLDivElement | null>(null);

  const [storyForm, setStoryForm] = useState({
    authorName: '',
    authorRole: '',
    city: '',
    rating: 5,
    story: ''
  });

  useEffect(() => {
    const unsub = adminStorage.listenUserStories((allStories) => {
      const approvedOnly = allStories.filter(s => s.status === 'approved');
      setUserStories(approvedOnly.length > 0 ? approvedOnly : adminStorage.getApprovedUserStories());
    });
    return () => unsub();
  }, []);

  // Auto-slide User Stories Cards when not hovered
  const [isStoryHovered, setIsStoryHovered] = useState(false);

  useEffect(() => {
    if (userStories.length <= 1 || isStoryHovered || showInlineStoryForm) return;

    const interval = setInterval(() => {
      const container = document.getElementById('user-stories-scroll-container');
      if (container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [userStories.length, isStoryHovered, showInlineStoryForm]);

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
      // Handled gracefully
    } finally {
      setIsSubmittingStory(false);
    }
  };

  const handleOpenStoryForm = () => {
    setShowInlineStoryForm(prev => !prev);
    setStorySubmittedMsg(false);
    if (!showInlineStoryForm) {
      setTimeout(() => {
        storyFormSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // Real Firestore Editorial Articles (Single quota-cached subscription, zero fake articles)
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
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

  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1, 7);

  // Knowledge Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = useMemo(() => [
    {
      q: isHindi ? "लेस क्रिएशन का मुख्य उद्देश्य क्या है?" : "What is the mission of Less Creation?",
      a: isHindi
        ? "लेस क्रिएशन इलाहाबाद उच्च न्यायालय के अधिवक्ता अनुराग गुरौली द्वारा स्थापित एक आधिकारिक विधिक व साइबर सुरक्षा जागरूकता मंच है। इसका उद्देश्य नागरिकों को ऑनलाइन वित्तीय धोखाधड़ी और डिजिटल अरेस्ट से कानूनी सुरक्षा प्रदान करना तथा निजी ऑन-डिवाइस टूल्स उपलब्ध कराना है।"
        : "Less Creation is an official legal awareness and cyber defense platform founded by Advocate Anurag Gurauli, Allahabad High Court, providing statutory defense against online fraud and private on-device utilities."
    },
    {
      q: isHindi ? "क्या यहाँ उपलब्ध टूल्स में मेरा डेटा सुरक्षित रहता है?" : "Are the tools private and safe to use?",
      a: isHindi
        ? "जी हाँ, हमारे सभी टूल्स (PDF, इमेज, कैलकुलेटर, क्यूआर कोड) सीधे आपके ब्राउज़र में काम करते हैं। आपकी कोई भी फाइल सर्वर पर अपलोड नहीं होती।"
        : "Yes. Every document and calculation utility runs locally inside your browser so files never leave your device."
    },
    {
      q: isHindi ? "साइबर अपराध या डिजिटल अरेस्ट की स्थिति में तुरंत क्या करें?" : "What immediate step should be taken in case of cyber fraud?",
      a: isHindi
        ? "वित्तीय धोखाधड़ी होने पर तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें।"
        : "Call the National Cyber Crime Helpline 1930 immediately or report the incident on cybercrime.gov.in."
    }
  ], [isHindi]);

  return (
    <div className="flex flex-col overflow-x-hidden transition-colors pb-28 bg-[#070B12] text-white">

      {/* 1. OFFICIAL LESS LEGAL ANDROID APP PROMOTION (TOP OF HOMEPAGE) */}
      <section id="less-legal-app-promo" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2 w-full relative z-20">
        <div className="relative overflow-hidden rounded-2xl bg-[#030509] bg-gradient-to-r from-[#060B18] via-[#040710] to-[#12060B] border border-white/15 hover:border-red-500/40 p-4 sm:p-6 shadow-2xl transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#070B12] border border-white/15 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                <img
                  src="/app_logo_512x512-3.png"
                  alt="Less Legal Android App Icon"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C9A24B]">
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'आधिकारिक एंड्रॉइड ऐप • LESS LEGAL' : 'OFFICIAL ANDROID APP • LESS LEGAL'}</span>
                </div>

                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {isHindi
                    ? 'Less Legal App — केस डायरी, PDF वर्कस्पेस, लीगल ड्राफ्ट्स व 25+ स्मार्ट टूल्स'
                    : 'Less Legal App — Case Diary, PDF Workspace, Legal Drafts & 25+ Utilities'}
                </h2>

                <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                  {isHindi
                    ? 'अधिवक्ताओं, विधि छात्रों और नागरिकों के लिए तेज़, सुरक्षित ऑन-डिवाइस विधिक व दैनिक उपयोगिता ऐप। (₹99 आजीवन विज्ञापन-मुक्त पास केवल Less Legal Android App के लिए लागू होता है।)'
                    : 'Fast, privacy-first case diary, document workspace, land converters, and daily citizen utilities. Optional ₹99 ad-free pass applies exclusively inside the Android app.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('download')}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap transition-colors"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>{isHindi ? 'ऐप डाउनलोड करें' : 'Download App'}</span>
              </button>

              <button
                onClick={() => onNavigate('features')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-200 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                <span>{isHindi ? 'ऐप सुविधाएँ' : 'App Features'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPACT HERO SECTION (Clean Headline + Description, Zero Extra Buttons or Clutter) */}
      <section className="relative w-full bg-[#070B12] text-white border-b border-white/10 pt-5 sm:pt-7 pb-10 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(220, 38, 38, 0.14) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070B12]/80 to-[#070B12]" />
          <motion.div
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/30 to-transparent z-0"
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white [text-wrap:balance]">
              {isHindi ? (
                <>
                  <span>साइबर सुरक्षा व विधिक अधिकार।</span>{' '}
                  <span className="text-red-500 block sm:inline">
                    नागरिकों के लिए सशक्त मंच।
                  </span>
                </>
              ) : (
                <>
                  <span>Cyber Law. Digital Defense.</span>{' '}
                  <span className="text-red-500 block sm:inline">
                    Built for everyday citizens.
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-xl mx-auto font-normal">
              {isHindi
                ? 'अधिवक्ता अनुराग गुरौली (इलाहाबाद उच्च न्यायालय) द्वारा संचालित आधिकारिक मंच — डिजिटल फ्रॉड से विधिक बचाव और सुरक्षित ऑन-डिवाइस टूल्स।'
                : 'An official legal awareness and cyber defense platform by Advocate Anurag Gurauli, Allahabad High Court.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. TOP FEATURED & SWIPEABLE BANNERS (Directly below Header & Title) */}
      <section id="founder-profile" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-5 sm:-mt-7 relative z-20 space-y-4">
        <HomepageBannerCarousel onNavigate={onNavigate} />
        <FounderProfileHeroBanner onNavigate={onNavigate} />
      </section>

      {/* Active Admin Notices (Auto-hidden when none) */}
      <DynamicNoticeBoard onNavigate={onNavigate} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full" />

      {/* 3. EDITORIAL PUBLICATIONS FROM FIRESTORE */}
      <section id="homepage-articles" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-5 w-full">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-3">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {isHindi ? 'संपादकीय लेख एवं साइबर सुरक्षा' : 'Cyber Law & Editorial Guides'}
          </h2>

          <button
            onClick={() => onNavigate('articles')}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{isHindi ? 'सभी लेख देखें' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* VIP Loading Animation while Firestore articles load */}
        {articlesLoading ? (
          <VipArticleLoader variant="editorial-grid" cardCount={3} />
        ) : articles.length === 0 ? (
          <div className="border border-white/10 rounded-2xl bg-[#0D1220] p-8 text-center space-y-2">
            <BookOpen className="w-7 h-7 text-stone-500 mx-auto" />
            <p className="text-xs text-stone-400">
              {isHindi ? 'अभी कोई प्रकाशित लेख उपलब्ध नहीं है।' : 'No published editorial articles available yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Lead Featured Story */}
            {featuredArticle && (
              <article
                onClick={() => onNavigate('article-detail', { slug: featuredArticle.slug || featuredArticle.id })}
                className="group border border-white/10 rounded-2xl bg-[#0D1220] p-5 sm:p-6 hover:border-red-500/45 transition-all cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-lg"
              >
                <div className="md:col-span-8 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-stone-400">
                    <span className="text-red-400 font-semibold">{featuredArticle.category}</span>
                    {featuredArticle.readingTime && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{featuredArticle.readingTime}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-400 line-clamp-2 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-400 font-normal">
                      {featuredArticle.authorName || 'Advocate Anurag Gurauli'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-red-400 font-bold group-hover:translate-x-1 transition-transform whitespace-nowrap">
                      <span>{isHindi ? 'लेख पढ़ें' : 'Read Guide'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="md:col-span-4 aspect-[16/10] rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                  {featuredArticle.featuredImage ? (
                    <img
                      src={getDirectCloudImageUrl(featuredArticle.featuredImage)}
                      alt={featuredArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-stone-500" />
                  )}
                </div>
              </article>
            )}

            {/* Secondary Articles Grid */}
            {recentArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentArticles.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => onNavigate('article-detail', { slug: art.slug || art.id })}
                    className="group border border-white/10 rounded-2xl bg-[#0D1220] overflow-hidden hover:border-red-500/40 transition-all cursor-pointer flex flex-col justify-between shadow-md"
                  >
                    {art.featuredImage && (
                      <div className="aspect-[16/9] bg-white/5 overflow-hidden">
                        <img
                          src={getDirectCloudImageUrl(art.featuredImage)}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <span className="text-red-400 font-semibold truncate">{art.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="shrink-0">{art.readingTime || '4 min read'}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-red-400">
                        <span>{isHindi ? 'पूरा लेख पढ़ें' : 'Read Article'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

      </section>

      {/* 4. CITIZEN STORIES */}
      <section id="community-voices" ref={storyFormSectionRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4 w-full">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-3">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {isHindi ? 'नागरिक अनुभव एवं प्रतिक्रिया' : 'Citizen Stories'}
          </h2>

          <button
            onClick={handleOpenStoryForm}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition-all inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/10 border border-red-500/20 cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span>{showInlineStoryForm ? (isHindi ? 'बंद करें' : 'Close') : (isHindi ? 'अनुभव साझा करें' : 'Share Your Story')}</span>
          </button>
        </div>

        {/* Inline Contextual Form */}
        <AnimatePresence>
          {showInlineStoryForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-red-500/30 shadow-2xl space-y-4 my-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-bold text-white">
                      {isHindi ? 'अपना अनुभव साझा करें' : 'Share Your Experience'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowInlineStoryForm(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {storySubmittedMsg ? (
                  <div className="p-6 rounded-xl bg-red-600/10 border border-red-500/20 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-red-500 mx-auto" />
                    <div className="text-xs sm:text-sm font-bold text-red-400">
                      {isHindi ? 'आपका अनुभव सफलतापूर्वक प्राप्त हुआ!' : 'Story Submitted Successfully!'}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitUserStory} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        required
                        value={storyForm.authorName}
                        onChange={(e) => setStoryForm({ ...storyForm, authorName: e.target.value })}
                        placeholder={isHindi ? 'आपका नाम *' : 'Your Name *'}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        value={storyForm.authorRole}
                        onChange={(e) => setStoryForm({ ...storyForm, authorRole: e.target.value })}
                        placeholder={isHindi ? 'पेशा / कार्य' : 'Profession / Role'}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        value={storyForm.city}
                        onChange={(e) => setStoryForm({ ...storyForm, city: e.target.value })}
                        placeholder={isHindi ? 'शहर / राज्य' : 'City / Location'}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500"
                      />
                    </div>

                    <textarea
                      required
                      rows={3}
                      value={storyForm.story}
                      onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                      placeholder={isHindi ? 'लेस क्रिएशन पर अपनी प्रतिक्रिया लिखें...' : 'Write your experience or review...'}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500 resize-none"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-stone-400 mr-1">{isHindi ? 'रेटिंग:' : 'Rating:'}</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setStoryForm({ ...storyForm, rating: star })}
                            className="text-[#C9A24B] hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${star <= storyForm.rating ? 'fill-[#C9A24B]' : 'text-stone-600'}`} />
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowInlineStoryForm(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-400 hover:text-white cursor-pointer whitespace-nowrap"
                        >
                          {isHindi ? 'रद्द करें' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingStory}
                          className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-sm disabled:opacity-50 whitespace-nowrap"
                        >
                          {isSubmittingStory ? '...' : (isHindi ? 'जमा करें' : 'Submit')}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clean Story Cards */}
        <div
          id="user-stories-scroll-container"
          onMouseEnter={() => setIsStoryHovered(true)}
          onMouseLeave={() => setIsStoryHovered(false)}
          className="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {userStories.map((story, idx) => (
            <div
              key={story.id || idx}
              className="w-[275px] sm:w-[310px] shrink-0 snap-start bg-[#0D1220] border border-white/10 hover:border-red-500/40 rounded-2xl p-5 shadow-md space-y-3 flex flex-col justify-between transition-all hover:translate-y-[-2px]"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: story.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#C9A24B] fill-[#C9A24B]" />
                  ))}
                </div>

                <p className="text-xs text-stone-300 leading-relaxed italic line-clamp-4">
                  “{story.story}”
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {story.authorName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-white truncate">
                    {story.authorName}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    {story.authorRole || 'Citizen'}{story.city ? ` · ${story.city}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. KNOWLEDGE FAQ (Consistent max-w-5xl alignment) */}
      <section id="faq-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-4 w-full">
        <div className="border-b border-white/10 pb-3">
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-b border-white/10">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-1 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
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
                      <div className="pt-2 pb-1 text-xs text-stone-400 leading-relaxed font-normal max-w-3xl">
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
