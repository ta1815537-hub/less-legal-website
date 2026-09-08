import React, { useState, useEffect } from 'react';
import { PageRoute, Article } from '../types';
import { 
  Search, Tag, Clock, Eye, Calendar, Sparkles, BookOpen, 
  ArrowRight, ShieldCheck, ChevronRight, User, Filter, RefreshCw, X 
} from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';
import { articleService, DEFAULT_CATEGORIES } from '../services/articleService';

interface ArticlesPageProps {
  onNavigate: (route: PageRoute, params?: { slug?: string; tag?: string; category?: string; authorSlug?: string }) => void;
  initialCategory?: string;
  initialTag?: string;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ 
  onNavigate, 
  initialCategory, 
  initialTag 
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Articles & Loading State
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedTag, setSelectedTag] = useState<string>(initialTag || 'ALL');

  // Load articles on mount & sync seed articles
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Sync seed articles asynchronously
    articleService.syncInitialArticlesToCloud().catch(() => {});

    articleService.getPublicArticles({
      category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
      tag: selectedTag !== 'ALL' ? selectedTag : undefined,
      search: searchQuery
    }).then((data) => {
      if (isMounted) {
        setArticles(data);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [selectedCategory, selectedTag, searchQuery]);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(articles.flatMap(a => a.tags || []))
  );

  const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
  const regularArticles = articles.filter(a => a.id !== featuredArticle?.id);

  return (
    <div className="relative min-h-screen pt-8 pb-24 overflow-hidden">
      <HeroAmbientGlow />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 z-10">
        
        {/* Editorial Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isHindi ? "लेस क्रिएशन संपादकीय व लेख" : "Insights by Less Creation"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F5F2EE] tracking-tight leading-snug">
            {isHindi 
              ? "डिजिटल सुरक्षा, तकनीक और नागरिक अधिकारों पर विशेष लेख" 
              : "Essays on Technology, Digital Safety & Legal Literacy"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
            {isHindi 
              ? "सरल भाषा में समझें साइबर सुरक्षा, ऑन-डिवाइस प्राइवेसी, और व्यावहारिक अधिकारों के महत्वपूर्ण पहलू।" 
              : "Practical, clear, and high-impact editorial insights published by Less Creation Editorial."}
          </p>
        </div>

        {/* Search & Filtering Toolbar */}
        <div className="bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-white/80 dark:border-white/10 shadow-xs space-y-3.5">
          
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? "शीर्षक, श्रेणी या कीवर्ड द्वारा खोजें..." : "Search articles by title, category, tag, or topic..."}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-[#B8B3AF]">
              <span>{isHindi ? "श्रेणी (Categories)" : "Categories"}</span>
              {(selectedCategory !== 'ALL' || selectedTag !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedTag('ALL');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 text-[10.5px]"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isHindi ? "रीसेट" : "Reset Filters"}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#B8B3AF] hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {isHindi ? "सभी (All)" : "All Articles"}
              </button>

              {DEFAULT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#B8B3AF] hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Cloud Filter Chips */}
          {allTags.length > 0 && (
            <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>Tags:</span>
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? 'ALL' : tag)}
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-white/10'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isHindi ? "संपादकीय लेख लोड हो रहे हैं..." : "Loading editorial articles..."}
            </p>
          </div>
        ) : articles.length === 0 ? (
          /* Clean Empty State */
          <div className="py-12 text-center space-y-3 bg-white/80 dark:bg-[#121622]/80 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-white/10 p-6 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isHindi ? "कोई लेख उपलब्ध नहीं है" : "No Published Articles Yet"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#B8B3AF] leading-relaxed">
              {isHindi 
                ? "अभी कोई लेख प्रकाशित नहीं हुआ है। एडमिन पैनल से प्रकाशित नए लेख यहाँ तुरंत दिखाई देंगे।" 
                : "No published articles found. New original articles published from Less Creation Editorial will appear here automatically."}
            </p>
            {(selectedCategory !== 'ALL' || selectedTag !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedTag('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
              >
                {isHindi ? "सभी लेख देखें" : "View All Articles"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* FEATURED ARTICLE HERO CARD */}
            {featuredArticle && selectedCategory === 'ALL' && !searchQuery && (
              <div 
                onClick={() => onNavigate('article-detail', { slug: featuredArticle.slug })}
                className="group relative bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-white/10 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-7 space-y-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10.5px] font-bold">
                      {featuredArticle.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10.5px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isHindi ? "मुख्य लेख" : "Featured Essay"}</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF] line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-[#B8B3AF]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center font-bold text-blue-600 overflow-hidden shrink-0">
                        <img src={featuredArticle.authorImage || '/Logo.png'} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 dark:text-white text-xs">{featuredArticle.authorName || 'Less Creation Editorial'}</span>
                        <span className="text-[10px] text-slate-400">{featuredArticle.authorRole || 'Editorial & Research Team'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10.5px] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {featuredArticle.readingTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-emerald-500" />
                        {featuredArticle.viewCount} views
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 h-48 sm:h-56 rounded-xl bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-300">
                  {featuredArticle.featuredImage ? (
                    <img src={featuredArticle.featuredImage} alt={featuredArticle.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Less Creation Editorial</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LATEST ARTICLES GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-2.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{isHindi ? "हालिया लेख संग्रह" : "Latest Articles"}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {regularArticles.length + (featuredArticle ? 1 : 0)} {isHindi ? "लेख" : "Articles"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(selectedCategory === 'ALL' && !searchQuery ? regularArticles : articles).map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onNavigate('article-detail', { slug: article.slug })}
                    className="group bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl rounded-2xl border border-white/80 dark:border-white/10 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3.5 hover:-translate-y-0.5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {article.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {article.readingTime}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-[#B8B3AF] line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-[#B8B3AF]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0">
                          <img src={article.authorImage || '/Logo.png'} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white text-[11px] truncate max-w-[110px]">
                          {article.authorName || 'Less Creation Editorial'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-emerald-500" />
                          {article.viewCount}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Public Brand Statement Footer */}
        <div className="pt-8 text-center border-t border-slate-200/80 dark:border-white/10 space-y-1">
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {isHindi ? "लेस क्रिएशन द्वारा प्रकाशित आधिकारिक संपादकीय मंच" : "Official Editorial Publication by Less Creation"}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Less Creation. All articles published for public awareness & educational utility.
          </p>
        </div>

      </div>
    </div>
  );
};
