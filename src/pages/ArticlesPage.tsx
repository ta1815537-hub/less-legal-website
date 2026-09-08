import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import { 
  Search, Tag, Clock, Calendar, Sparkles, BookOpen, 
  ChevronRight, RefreshCw, X, ArrowRight 
} from 'lucide-react';
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
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedTag, setSelectedTag] = useState<string>(initialTag || 'ALL');

  // Debounce search query to prevent unnecessary computations
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load articles on mount & filter changes with live updates
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      const data = await articleService.getPublicArticleSummaries({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        tag: selectedTag !== 'ALL' ? selectedTag : undefined,
        search: debouncedSearch
      });
      if (isMounted) {
        setArticles(data);
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to live changes
    const unsubscribe = articleService.subscribeToPublicSummaries(() => {
      loadData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedCategory, selectedTag, debouncedSearch]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach(a => {
      (a.tags || []).forEach(t => set.add(t));
    });
    return Array.from(set);
  }, [articles]);

  // Categorize Featured vs Regular Articles
  const featuredArticle = useMemo(() => {
    return articles.find(a => a.isFeatured) || articles[0];
  }, [articles]);

  const regularArticles = useMemo(() => {
    if (selectedCategory !== 'ALL' || debouncedSearch || selectedTag !== 'ALL') {
      return articles;
    }
    return articles.filter(a => a.id !== featuredArticle?.id);
  }, [articles, featuredArticle, selectedCategory, debouncedSearch, selectedTag]);

  // Format Display Date cleanly
  const formatArticleDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full text-slate-900 dark:text-[#F5F2EE] transition-colors duration-200 pb-4 sm:pb-6">
      
      {/* COMPACT EDITORIAL HEADER */}
      <header className="border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0E131F]/90 backdrop-blur-md sticky top-14 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  {isHindi ? "संपादकीय प्रकाशन" : "Less Creation Articles"}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {isHindi 
                  ? "तकनीक, डिजिटल सुरक्षा और कानूनी जागरूकता" 
                  : "Technology, Digital Safety & Legal Literacy"}
              </h1>
            </div>

            {/* Compact Search Bar */}
            <div className="relative w-full sm:w-72 md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? "लेख खोजें..." : "Search articles, tags, topics..."}
                className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* HORIZONTAL CATEGORY SCROLL BAR */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {isHindi ? "सभी (All)" : "All Articles"}
            </button>

            {DEFAULT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {(selectedCategory !== 'ALL' || selectedTag !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedTag('ALL');
                  setSearchQuery('');
                }}
                className="ml-auto text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 pl-2 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isHindi ? "रीसेट" : "Reset"}</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* MAIN EDITORIAL CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Tag Pills (if selected or available) */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Tag className="w-3 h-3" />
              <span>{isHindi ? "टैग्स:" : "Tags:"}</span>
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? 'ALL' : tag)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              {isHindi ? "संपादकीय लेख लोड हो रहे हैं..." : "Loading editorial articles..."}
            </p>
          </div>
        ) : articles.length === 0 ? (
          
          /* COMPACT EDITORIAL EMPTY STATE */
          <div className="py-12 px-6 text-center max-w-lg mx-auto border border-dashed border-slate-300 dark:border-white/10 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isHindi ? "कोई लेख उपलब्ध नहीं है" : "Articles are coming soon"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#B8B3AF] leading-relaxed">
              {isHindi 
                ? "लेस क्रिएशन जल्द ही तकनीक, डिजिटल सुरक्षा, साइबर फ्रॉड व नागरिक अधिकारों पर व्यावहारिक लेख प्रकाशित करेगा।" 
                : "Less Creation will publish practical insights on technology, digital safety, fraud awareness and legal literacy."}
            </p>
            {(selectedCategory !== 'ALL' || selectedTag !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedTag('ALL');
                  setSearchQuery('');
                }}
                className="mt-2 px-3 py-1.5 rounded-md bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>{isHindi ? "सभी लेख देखें" : "View All Articles"}</span>
              </button>
            )}
          </div>

        ) : (

          <div className="space-y-6">

            {/* FEATURED ARTICLE (COMPACT EDITORIAL HERO) */}
            {featuredArticle && selectedCategory === 'ALL' && !debouncedSearch && selectedTag === 'ALL' && (
              <article 
                onClick={() => onNavigate('article-detail', { slug: featuredArticle.slug })}
                className="group border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#0E131F] p-4 sm:p-5 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
              >
                <div className="md:col-span-7 space-y-2.5">
                  
                  {/* Top Metadata with prominent Date */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-bold">
                      {featuredArticle.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10.5px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isHindi ? "मुख्य लेख" : "Featured"}</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {formatArticleDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  {/* Bottom Attribution */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 pointer-events-none select-none">
                    <div className="flex items-center gap-2 pointer-events-none select-none">
                      <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center overflow-hidden shrink-0 pointer-events-none select-none">
                        <img src="/Logo.png" alt="LT" className="w-full h-full object-cover pointer-events-none select-none" />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs pointer-events-none select-none">
                        By Less Team
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono pointer-events-none select-none">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {featuredArticle.readingTime}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>Read</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                </div>

                {/* Featured Thumbnail */}
                <div className="md:col-span-5 h-44 sm:h-52 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 overflow-hidden flex items-center justify-center">
                  {featuredArticle.featuredImage ? (
                    <img 
                      src={featuredArticle.featuredImage} 
                      alt={featuredArticle.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                      loading="eager"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-1">
                      <BookOpen className="w-8 h-8 text-blue-500/40 mx-auto" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Less Creation Editorial</span>
                    </div>
                  )}
                </div>

              </article>
            )}

            {/* LATEST ARTICLES LIST (Mobile: Compact Editorial Rows | Desktop: 2-Column Grid) */}
            <div className="space-y-3">
              
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/80 dark:border-white/10">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isHindi ? "हालिया संपादकीय लेख" : "Latest Articles"}</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {regularArticles.length} {isHindi ? "लेख" : "Articles"}
                </span>
              </div>

              {/* Mobile-first editorial list with high content density */}
              <div className="divide-y divide-slate-200/70 dark:divide-white/10 border-y border-slate-200/70 dark:border-white/10 bg-white dark:bg-[#0E131F] rounded-xl overflow-hidden">
                {regularArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => onNavigate('article-detail', { slug: article.slug })}
                    className="group p-3.5 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                  >
                    
                    {/* Optional Thumbnail / Category Badge */}
                    <div className="w-full sm:w-28 sm:h-20 shrink-0 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 overflow-hidden flex items-center justify-center">
                      {article.featuredImage ? (
                        <img 
                          src={article.featuredImage} 
                          alt={article.title} 
                          className="w-full h-28 sm:h-full object-cover group-hover:scale-105 transition-transform" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="p-2 text-center">
                          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {article.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Article Content Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      
                      {/* Category & Date Row */}
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {article.category}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatArticleDate(article.publishedAt || article.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-xs text-slate-600 dark:text-[#B8B3AF] line-clamp-1 sm:line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {/* Metadata Attribution Bar */}
                      <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          By Less Team
                        </span>
                        <span>•</span>
                        <span className="font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          {article.readingTime}
                        </span>
                      </div>

                    </div>

                    {/* Right Arrow Icon */}
                    <div className="hidden sm:flex items-center justify-center pl-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                  </article>
                ))}
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
